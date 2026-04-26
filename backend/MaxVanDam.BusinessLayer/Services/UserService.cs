using MaxVanDam.BusinessLayer.DTOs.User;
using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.DataAccessLayer.Context;
using MaxVanDam.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MaxVanDam.BusinessLayer.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserResponseDto>> GetAllAsync()
    {
        return await _context.Users
            .Select(u => MapToDto(u))
            .ToListAsync();
    }

    public async Task<UserResponseDto?> GetByIdAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        return user is null ? null : MapToDto(user);
    }

    public async Task<UserResponseDto?> LoginAsync(LoginRequestDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == dto.Username);

        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return null;

        return MapToDto(user);
    }

    public async Task<UserResponseDto> RegisterAsync(RegisterRequestDto dto)
    {
        var user = new User
        {
            Username = dto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Email = dto.Email,
            Role = "user",
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return MapToDto(user);
    }

    public async Task<UserResponseDto?> UpdateRoleAsync(int id, UpdateRoleDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user is null) return null;

        user.Role = dto.Role;
        await _context.SaveChangesAsync();
        return MapToDto(user);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user is null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }

    private static UserResponseDto MapToDto(User u) => new()
    {
        Id = u.Id,
        Username = u.Username,
        Role = u.Role,
        Email = u.Email,
        CreatedAt = u.CreatedAt
    };
}
