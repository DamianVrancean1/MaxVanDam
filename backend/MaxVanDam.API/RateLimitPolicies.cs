namespace MaxVanDam.API;

/// <summary>
/// Named rate limit policies used by EnableRateLimiting attributes and Program.cs.
/// Using constants prevents typos and keeps policy names in one place.
/// </summary>
public static class RateLimitPolicies
{
    /// <summary>
    /// Applied only to POST /api/auth/login.
    /// 5 attempts per 60 seconds per IP (configurable via appsettings RateLimiting:Login).
    /// </summary>
    public const string Login = "login";
}
