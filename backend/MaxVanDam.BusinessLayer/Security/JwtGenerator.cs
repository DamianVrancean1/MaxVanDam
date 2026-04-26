using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MaxVanDam.Domain.Entities.User;
using Microsoft.IdentityModel.Tokens;

namespace MaxVanDam.BusinessLayer.Security;

public static class JwtGenerator
{
    public static string Generate(UserEntity user)
    {
        var secret = Environment.GetEnvironmentVariable("JWT_SECRET")
            ?? throw new InvalidOperationException("JWT_SECRET environment variable is not set.");
        var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "MaxVanDam";
        var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "MaxVanDam";
        var expiryMinutes = int.TryParse(Environment.GetEnvironmentVariable("JWT_EXPIRY_MINUTES"), out var m) ? m : 60;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
