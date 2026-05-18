using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.RateLimiting;
using MaxVanDam.API;
using MaxVanDam.API.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;

DotNetEnv.Env.Load(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", ".env"));

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ── Forwarded Headers ────────────────────────────────────────────────────────
// Purpose  : make RemoteIpAddress reflect the real client IP when the app
//            sits behind nginx, IIS ARR, Cloudflare, or any other reverse proxy.
//
// Security : X-Forwarded-For can be spoofed by any client.
//            TrustAllProxies=true is safe ONLY when the app is unreachable
//            except through a known, trusted proxy.
//
//            PRODUCTION HARDENING — set in appsettings.Production.json:
//              "ForwardedHeaders": {
//                "TrustAllProxies": false,
//                "TrustedProxies": ["10.0.0.1", "192.168.1.0/24"]
//              }
var trustAll       = builder.Configuration.GetValue<bool>("ForwardedHeaders:TrustAllProxies", true);
var trustedProxies = builder.Configuration
    .GetSection("ForwardedHeaders:TrustedProxies")
    .Get<string[]>() ?? [];

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;

    if (trustAll)
    {
        // Trust any proxy — acceptable for local dev and single-proxy deployments
        options.KnownNetworks.Clear();
        options.KnownProxies.Clear();
    }
    else
    {
        // Only trust explicitly listed proxy IPs (production best-practice)
        foreach (var proxy in trustedProxies)
        {
            if (IPAddress.TryParse(proxy, out var ip))
                options.KnownProxies.Add(ip);
        }
    }
});

// ── Rate Limiting ────────────────────────────────────────────────────────────
var loginPermitLimit = builder.Configuration.GetValue<int>("RateLimiting:Login:PermitLimit",  5);
var loginWindowSecs  = builder.Configuration.GetValue<int>("RateLimiting:Login:WindowSeconds", 60);

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // Called for every rejected request — logs security event, writes 429 response.
    // SECURITY: never log request body (passwords), query strings, or JWT tokens.
    options.OnRejected = async (context, cancellationToken) =>
    {
        var logger = context.HttpContext.RequestServices
            .GetRequiredService<ILoggerFactory>()
            .CreateLogger("MaxVanDam.Security");

        var clientIp = NormalizeIp(context.HttpContext.Connection.RemoteIpAddress);
        var path     = context.HttpContext.Request.Path.Value ?? "/";
        var method   = context.HttpContext.Request.Method;
        // User-Agent helps distinguish automated tools from browsers — safe to log
        var ua       = context.HttpContext.Request.Headers.UserAgent.FirstOrDefault() ?? "—";

        logger.LogWarning(
            LogEvents.RateLimitExceeded,
            "Rate limit exceeded. Method={Method} Path={Path} ClientIp={ClientIp} UserAgent={UserAgent}",
            method, path, clientIp, ua
        );

        var response = context.HttpContext.Response;
        response.StatusCode  = StatusCodes.Status429TooManyRequests;
        response.ContentType = "application/json";

        // Prefer the exact retry window from the limiter; fall back to full window
        var retryAfterSeconds = loginWindowSecs;
        if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
            retryAfterSeconds = (int)Math.Ceiling(retryAfter.TotalSeconds);

        // Retry-After header is part of RFC 6585 — well-supported by browsers and API clients
        response.Headers["Retry-After"] = retryAfterSeconds.ToString();

        var body = JsonSerializer.Serialize(new
        {
            status            = 429,
            message           = $"Prea multe încercări de autentificare. " +
                                $"Încearcă din nou în {retryAfterSeconds} secunde.",
            retryAfterSeconds
        });

        await response.WriteAsync(body, cancellationToken);
    };

    // "login" policy — fixed window, per-IP, applied only via [EnableRateLimiting]
    // on AuthController.Login. No other endpoint is affected.
    options.AddPolicy(RateLimitPolicies.Login, httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            // NormalizeIp maps ::1 → 127.0.0.1 so IPv4/IPv6 loopback share one bucket
            partitionKey: NormalizeIp(httpContext.Connection.RemoteIpAddress),
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit          = loginPermitLimit,
                Window               = TimeSpan.FromSeconds(loginWindowSecs),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                // QueueLimit = 0 — over-limit requests are rejected immediately, not queued.
                // Queuing would allow attackers to hold connections open.
                QueueLimit           = 0
            }
        )
    );
});

// ── JWT Authentication ───────────────────────────────────────────────────────
var jwtSecret   = Environment.GetEnvironmentVariable("JWT_SECRET")   ?? "fallback-secret-min-32-chars-long!!";
var jwtIssuer   = Environment.GetEnvironmentVariable("JWT_ISSUER")   ?? "MaxVanDam";
var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "MaxVanDam";

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = jwtIssuer,
            ValidAudience            = jwtAudience,
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        };

        // ── Cookie extraction ────────────────────────────────────────────────
        // Read JWT exclusively from the HttpOnly 'access_token' cookie.
        // No fallback to Authorization: Bearer — cookie is the only accepted source.
        //
        // CSRF protection rationale:
        //   SameSite=Strict on the cookie blocks all cross-site requests, so a
        //   forged form/fetch from another origin will never carry the cookie.
        //   No additional anti-forgery token is required.
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var token = context.Request.Cookies["access_token"];
                if (!string.IsNullOrEmpty(token))
                    context.Token = token;
                return Task.CompletedTask;
            },

            // Return a clean JSON 401 instead of the default WWW-Authenticate: Bearer
            // challenge header, which is meaningless for a cookie-based SPA and can
            // trigger browser login dialogs in some environments.
            OnChallenge = context =>
            {
                context.HandleResponse();
                context.Response.StatusCode  = StatusCodes.Status401Unauthorized;
                context.Response.ContentType = "application/json";
                return context.Response.WriteAsync(
                    JsonSerializer.Serialize(new { message = "Sesiune expirată sau neautentificat." })
                );
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());  // required for HttpOnly cookie exchange
});

var app = builder.Build();

// ── Middleware Pipeline ──────────────────────────────────────────────────────
// ORDER IS CRITICAL. Each middleware runs in registration order.
//
//  1. UseForwardedHeaders  — must be first; populates RemoteIpAddress
//  2. UseHttpsRedirection  — redirects HTTP → HTTPS before any processing
//  3. UseCors              — CORS headers before authentication
//  4. UseRateLimiter       — rejects brute-force before hitting auth logic
//  5. UseAuthentication    — validates JWT on protected endpoints
//  6. UseAuthorization     — checks role/policy claims
//  7. MapControllers       — dispatches to controller actions

app.UseForwardedHeaders();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("FrontendPolicy");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

// ── Helpers ──────────────────────────────────────────────────────────────────

/// <summary>
/// Returns a canonical string representation of a client IP address.
/// Normalizes the IPv6 loopback (::1) to its IPv4 equivalent (127.0.0.1)
/// so that localhost requests always share the same rate-limit bucket
/// regardless of which network stack the OS used.
/// Returns "unknown" when RemoteIpAddress is null (e.g. in unit tests).
/// </summary>
static string NormalizeIp(IPAddress? address)
{
    if (address is null) return "unknown";

    // IPv6-mapped IPv4 addresses (::ffff:x.x.x.x) — unwrap to plain IPv4
    if (address.IsIPv4MappedToIPv6)
        address = address.MapToIPv4();

    // Treat IPv6 loopback same as IPv4 loopback
    return address.ToString() == "::1" ? "127.0.0.1" : address.ToString();
}
