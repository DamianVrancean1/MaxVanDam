namespace MaxVanDam.DataAccessLayer;

public static class DbSession
{
    public static string ConnectionString =>
        Environment.GetEnvironmentVariable("CONNECTION_DEFAULT")
        ?? throw new InvalidOperationException("CONNECTION_DEFAULT environment variable is not set.");
}
