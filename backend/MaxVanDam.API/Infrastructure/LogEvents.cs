namespace MaxVanDam.API.Infrastructure;

/// <summary>
/// Stable numeric event IDs for the security subsystem.
/// Keeping IDs fixed lets you filter and alert in Seq, ELK, DataDog, etc.
/// without relying on message text (which can change).
///
/// Range 2000–2099 is reserved for authentication / rate-limiting events.
/// </summary>
public static class LogEvents
{
    /// <summary>
    /// A request was rejected because the client exceeded the login rate limit.
    /// Logged as Warning — high frequency may indicate an automated attack.
    /// Fields: Method, Path, ClientIp, UserAgent.
    /// NOTE: passwords and tokens are NEVER included in these log entries.
    /// </summary>
    public static readonly EventId RateLimitExceeded = new(2000, "RateLimitExceeded");

    /// <summary>
    /// Reserved for future use: a single IP has hit the limit repeatedly
    /// across multiple windows, suggesting persistent brute-force.
    /// </summary>
    public static readonly EventId SuspiciousLoginPattern = new(2001, "SuspiciousLoginPattern");
}
