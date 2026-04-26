using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.DataAccessLayer.Context;
using MaxVanDam.Domain.Entities.User;
using MaxVanDam.Domain.Models.Auth;
using MaxVanDam.Domain.Models.User;
using Microsoft.EntityFrameworkCore;

namespace MaxVanDam.BusinessLayer.Services;

public class UserService : IUserService
{
    private readonly MasterDbContext _context;

    public UserService(MasterDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserInfoDto>> GetAllAsync()
    {
        return await _context.Users
            .Select(u => MapToUserInfo(u))
            .ToListAsync();
    }

    public async Task<UserInfoDto?> GetByIdAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        return user is null ? null : MapToUserInfo(user);
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == dto.Username);

        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return null;

        return MapToAuthResponse(user);
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var user = new UserEntity
        {
            Username = dto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Email = dto.Email,
            Role = "user",
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return MapToAuthResponse(user);
    }

    public async Task<UserInfoDto?> UpdateRoleAsync(int id, AdminUserUpdateDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user is null) return null;

        user.Role = dto.Role;
        await _context.SaveChangesAsync();
        return MapToUserInfo(user);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user is null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }

    private static AuthResponseDto MapToAuthResponse(UserEntity u) => new()
    {
        Id = u.Id,
        Username = u.Username,
        Role = u.Role,
        Email = u.Email,
        CreatedAt = u.CreatedAt
    };

    private static UserInfoDto MapToUserInfo(UserEntity u) => new()
    {
        Id = u.Id,
        Username = u.Username,
        Role = u.Role,
        Email = u.Email,
        CreatedAt = u.CreatedAt
    };
}
