using System.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace MaxVanDam.API.Middleware;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();

        // Log request
        _logger.LogInformation(
            "Request: {Method} {Path} from {RemoteIp}",
            context.Request.Method,
            context.Request.Path,
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown"
        );

        try
        {
            await _next(context);

            stopwatch.Stop();

            // Log response
            _logger.LogInformation(
                "Response: {Method} {Path} returned {StatusCode} in {ElapsedMs}ms",
                context.Request.Method,
                context.Request.Path,
                context.Response.StatusCode,
                stopwatch.ElapsedMilliseconds
            );
        }
        catch (Exception ex)
        {
            stopwatch.Stop();

            _logger.LogError(
                ex,
                "Request {Method} {Path} failed after {ElapsedMs}ms with error: {Message}",
                context.Request.Method,
                context.Request.Path,
                stopwatch.ElapsedMilliseconds,
                ex.Message
            );

            throw;
        }
    }
}
