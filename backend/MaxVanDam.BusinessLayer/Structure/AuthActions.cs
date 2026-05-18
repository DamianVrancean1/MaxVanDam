using MaxVanDam.BusinessLayer.Security;
using MaxVanDam.DataAccessLayer.Context;
using MaxVanDam.Domain.Entities.User;
using MaxVanDam.Domain.Models.Auth;
using MaxVanDam.Domain.Models.Service;
using MaxVanDam.Domain.Models.User;
using Microsoft.EntityFrameworkCore;

namespace MaxVanDam.BusinessLayer.Structure;

public class AuthActions
{
    protected ServiceResponse RegisterAction(RegisterDto dto)
    {
        try
        {
            using var db = new UserDbContext();

            if (db.Users.Any(u => u.Username == dto.Username))
                return new ServiceResponse { IsSuccess = false, Message = "Username-ul este deja folosit." };

            if (db.Users.Any(u => u.Email == dto.Email))
                return new ServiceResponse { IsSuccess = false, Message = "Email-ul este deja folosit." };

            var pepper = Environment.GetEnvironmentVariable("AUTH_PEPPER") ?? string.Empty;
            var salt = PasswordHasher.GenerateSalt();
            var hash = PasswordHasher.Hash(dto.Password, salt, pepper, 0, 0);

            var user = new UserEntity
            {
                Username = dto.Username,
                PasswordHash = $"{salt}:{hash}",
                Email = dto.Email,
                Role = "user",
                CreatedAt = DateTime.UtcNow
            };

            db.Users.Add(user);
            db.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Data = new AuthResponseDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Role = user.Role,
                    Email = user.Email,
                    CreatedAt = user.CreatedAt
                }
            };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse LoginAction(LoginDto dto)
    {
        try
        {
            using var db = new UserDbContext();

            var user = db.Users.FirstOrDefault(u => u.Username == dto.Username);
            if (user is null)
                return new ServiceResponse { IsSuccess = false, Message = "Credențiale invalide." };

            var parts = user.PasswordHash.Split(':', 2);
            if (parts.Length != 2)
                return new ServiceResponse { IsSuccess = false, Message = "Credențiale invalide." };

            var pepper = Environment.GetEnvironmentVariable("AUTH_PEPPER") ?? string.Empty;

            if (!PasswordHasher.Verify(dto.Password, parts[0], pepper, 0, 0, parts[1]))
                return new ServiceResponse { IsSuccess = false, Message = "Credențiale invalide." };

            var accessToken    = JwtGenerator.GenerateAccessToken(user);
            var rawRefresh     = JwtGenerator.GenerateRefreshToken();
            var refreshHash    = JwtGenerator.HashRefreshToken(rawRefresh);
            var refreshDays    = int.TryParse(
                Environment.GetEnvironmentVariable("REFRESH_TOKEN_EXPIRY_DAYS"), out var d) ? d : 7;

            db.RefreshTokens.Add(new RefreshTokenEntity
            {
                UserId    = user.Id,
                TokenHash = refreshHash,
                ExpiresAt = DateTime.UtcNow.AddDays(refreshDays),
                Revoked   = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            user.LastLoginAt = DateTime.UtcNow;
            db.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Data = new AuthResponseDto
                {
                    Id           = user.Id,
                    Username     = user.Username,
                    Role         = user.Role,
                    Email        = user.Email,
                    CreatedAt    = user.CreatedAt,
                    Token        = accessToken,
                    RefreshToken = rawRefresh
                }
            };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse ChangePasswordAction(int userId, ChangePasswordDto dto)
    {
        try
        {
            using var db = new UserDbContext();
            var user = db.Users.Find(userId);
            if (user is null)
                return new ServiceResponse { IsSuccess = false, Message = "Utilizatorul nu a fost găsit." };

            var parts = user.PasswordHash.Split(':', 2);
            if (parts.Length != 2)
                return new ServiceResponse { IsSuccess = false, Message = "Eroare internă de autentificare." };

            var pepper = Environment.GetEnvironmentVariable("AUTH_PEPPER") ?? string.Empty;

            if (!PasswordHasher.Verify(dto.OldPassword, parts[0], pepper, 0, 0, parts[1]))
                return new ServiceResponse { IsSuccess = false, Message = "Parola curentă este incorectă." };

            var salt = PasswordHasher.GenerateSalt();
            var hash = PasswordHasher.Hash(dto.NewPassword, salt, pepper, 0, 0);
            user.PasswordHash = $"{salt}:{hash}";
            db.SaveChanges();

            return new ServiceResponse { IsSuccess = true, Message = "Parola a fost schimbată cu succes." };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse UpdateProfileAction(int userId, UpdateProfileDto dto)
    {
        try
        {
            using var db = new UserDbContext();
            var user = db.Users.Find(userId);
            if (user is null)
                return new ServiceResponse { IsSuccess = false, Message = "Utilizatorul nu a fost găsit." };

            if (!string.IsNullOrWhiteSpace(dto.Username) && dto.Username != user.Username)
            {
                if (db.Users.Any(u => u.Username == dto.Username))
                    return new ServiceResponse { IsSuccess = false, Message = "Username-ul este deja folosit." };
                user.Username = dto.Username;
            }

            if (!string.IsNullOrWhiteSpace(dto.Email) && dto.Email != user.Email)
            {
                if (db.Users.Any(u => u.Email == dto.Email))
                    return new ServiceResponse { IsSuccess = false, Message = "Email-ul este deja folosit." };
                user.Email = dto.Email;
            }

            db.SaveChanges();

            return new ServiceResponse
            {
                IsSuccess = true,
                Data = new UserInfoDto
                {
                    Id       = user.Id,
                    Username = user.Username,
                    Email    = user.Email,
                    Role     = user.Role,
                    CreatedAt = user.CreatedAt,
                    IsActive = user.IsActive,
                }
            };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }
}
