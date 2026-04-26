using System.Security.Cryptography;
using System.Text;

namespace MaxVanDam.BusinessLayer.Security;

public static class PasswordHasher
{
    public static string GenerateSalt()
    {
        var bytes = RandomNumberGenerator.GetBytes(32);
        return Convert.ToBase64String(bytes);
    }

    public static string Hash(string password, string salt, string pepper, int userId, long timestamp)
    {
        var raw = $"{password}{salt}{pepper}{userId}{timestamp}";
        var rawBytes = Encoding.UTF8.GetBytes(raw);
        var hashBytes = SHA512.HashData(rawBytes);
        return Convert.ToBase64String(hashBytes);
    }

    public static bool Verify(string password, string salt, string pepper, int userId, long timestamp, string storedHash)
    {
        var computedHash = Hash(password, salt, pepper, userId, timestamp);
        var computedBytes = Convert.FromBase64String(computedHash);
        var storedBytes = Convert.FromBase64String(storedHash);
        return CryptographicOperations.FixedTimeEquals(computedBytes, storedBytes);
    }
}
