using MaxVanDam.BusinessLayer.Security;
using MaxVanDam.DataAccessLayer.Context;
using MaxVanDam.Domain.Entities.User;
using MaxVanDam.Domain.Models.Auth;
using MaxVanDam.Domain.Models.Service;
using MaxVanDam.Domain.Models.User;

namespace MaxVanDam.BusinessLayer.Structure;

public class UserActions
{
    protected ServiceResponse GetUserListAction()
    {
        try
        {
            using var db = new UserDbContext();
            var users = db.Users
                .Select(u => MapToDto(u))
                .ToList();
            return new ServiceResponse { IsSuccess = true, Data = users };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse CreateUserAction(RegisterDto dto)
    {
        try
        {
            using var db = new UserDbContext();

            if (db.Users.Any(u => u.Username == dto.Username))
                return new ServiceResponse { IsSuccess = false, Message = "Username-ul este deja folosit." };

            if (db.Users.Any(u => u.Email == dto.Email))
                return new ServiceResponse { IsSuccess = false, Message = "Email-ul este deja folosit." };

            var pepper = Environment.GetEnvironmentVariable("AUTH_PEPPER") ?? string.Empty;
            var salt   = PasswordHasher.GenerateSalt();
            var hash   = PasswordHasher.Hash(dto.Password, salt, pepper, 0, 0);

            var user = new UserEntity
            {
                Username     = dto.Username,
                PasswordHash = $"{salt}:{hash}",
                Email        = dto.Email,
                Role         = dto.Role ?? "user",
                CreatedAt    = DateTime.UtcNow,
                IsActive     = true,
            };

            db.Users.Add(user);
            db.SaveChanges();
            return new ServiceResponse { IsSuccess = true, Data = MapToDto(user) };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse UpdateUserRoleAction(int id, AdminUserUpdateDto dto)
    {
        try
        {
            using var db = new UserDbContext();
            var user = db.Users.Find(id);
            if (user is null)
                return new ServiceResponse { IsSuccess = false, Message = $"Utilizatorul cu id {id} nu a fost găsit." };

            user.Role = dto.Role;
            db.SaveChanges();
            return new ServiceResponse { IsSuccess = true, Data = MapToDto(user) };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse UpdateUserStatusAction(int id, UserStatusDto dto)
    {
        try
        {
            using var db = new UserDbContext();
            var user = db.Users.Find(id);
            if (user is null)
                return new ServiceResponse { IsSuccess = false, Message = $"Utilizatorul cu id {id} nu a fost găsit." };

            user.IsActive = dto.IsActive;
            db.SaveChanges();
            return new ServiceResponse { IsSuccess = true, Data = MapToDto(user) };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse DeleteUserAction(int id)
    {
        try
        {
            using var db = new UserDbContext();
            var user = db.Users.Find(id);
            if (user is null)
                return new ServiceResponse { IsSuccess = false, Message = $"Utilizatorul cu id {id} nu a fost găsit." };

            db.Users.Remove(user);
            db.SaveChanges();
            return new ServiceResponse { IsSuccess = true, Message = "Utilizator șters cu succes." };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    private static UserInfoDto MapToDto(UserEntity u) => new()
    {
        Id          = u.Id,
        Username    = u.Username,
        Role        = u.Role,
        Email       = u.Email,
        CreatedAt   = u.CreatedAt,
        IsActive    = u.IsActive,
        LastLoginAt = u.LastLoginAt,
    };
}
