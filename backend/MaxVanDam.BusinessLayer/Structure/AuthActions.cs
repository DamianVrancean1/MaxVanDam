using MaxVanDam.BusinessLayer.Security;
using MaxVanDam.DataAccessLayer.Context;
using MaxVanDam.Domain.Entities.User;
using MaxVanDam.Domain.Models.Auth;
using MaxVanDam.Domain.Models.Service;

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

            var token = JwtGenerator.Generate(user);

            return new ServiceResponse
            {
                IsSuccess = true,
                Data = new AuthResponseDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Role = user.Role,
                    Email = user.Email,
                    CreatedAt = user.CreatedAt,
                    Token = token
                }
            };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }
}
