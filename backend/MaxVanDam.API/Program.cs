using System.Text;
using System.Text.Json;
using System.Threading.RateLimiting;
using MaxVanDam.API;
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
// Extracts real client IP when running behind nginx, IIS, Cloudflare, etc.
// KnownNetworks/KnownProxies cleared so any trusted proxy can forward headers;
// tighten to specific proxy CIDRs in production.
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// ── Rate Limiting ────────────────────────────────────────────────────────────
var loginPermitLimit  = builder.Configuration.GetValue<int>("RateLimiting:Login:PermitLimit",  5);
var loginWindowSecs   = builder.Configuration.GetValue<int>("RateLimiting:Login:WindowSeconds", 60);

builder.Services.AddRateLimiter(options =>
{
    // Default rejection status code — individual policies can override
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // Standardized JSON rejection response with Retry-After header
    options.OnRejected = async (context, cancellationToken) =>
    {
        var response = context.HttpContext.Response;
        response.StatusCode  = StatusCodes.Status429TooManyRequests;
        response.ContentType = "application/json";

        var retryAfterSeconds = loginWindowSecs;
        if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
            retryAfterSeconds = (int)Math.Ceiling(retryAfter.TotalSeconds);

        response.Headers["Retry-After"] = retryAfterSeconds.ToString();

        var body = JsonSerializer.Serialize(new
        {
            status  = 429,
            message = "Prea multe încercări de autentificare. Încearcă din nou în " +
                      $"{retryAfterSeconds} secunde.",
            retryAfterSeconds
        });

        await response.WriteAsync(body, cancellationToken);
    };

    // "login" policy — fixed window, per-IP, only on /api/auth/login
    options.AddPolicy(RateLimitPolicies.Login, httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            // After UseForwardedHeaders, RemoteIpAddress reflects the real client IP
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit          = loginPermitLimit,
                Window               = TimeSpan.FromSeconds(loginWindowSecs),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                // QueueLimit = 0 means requests over the limit are rejected immediately
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
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

// ── Middleware Pipeline ──────────────────────────────────────────────────────
// ORDER MATTERS — do not reorder without understanding the dependencies.

// 1. Forwarded headers first — populates RemoteIpAddress before anything reads it
app.UseForwardedHeaders();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 2. HTTPS redirect
app.UseHttpsRedirection();

// 3. CORS — must be before auth and rate limiting
app.UseCors("FrontendPolicy");

// 4. Rate limiting — before auth so brute-force attempts never reach the auth stack
app.UseRateLimiter();

// 5. Authentication + Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
