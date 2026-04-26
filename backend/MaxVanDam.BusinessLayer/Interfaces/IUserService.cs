using MaxVanDam.BusinessLayer.DTOs.User;

namespace MaxVanDam.BusinessLayer.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserResponseDto>> GetAllAsync();
    Task<UserResponseDto?> GetByIdAsync(int id);
    Task<UserResponseDto?> LoginAsync(LoginRequestDto dto);
    Task<UserResponseDto> RegisterAsync(RegisterRequestDto dto);
    Task<UserResponseDto?> UpdateRoleAsync(int id, UpdateRoleDto dto);
    Task<bool> DeleteAsync(int id);
}
