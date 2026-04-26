using MaxVanDam.Domain.Models.Auth;
using MaxVanDam.Domain.Models.User;

namespace MaxVanDam.BusinessLayer.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserInfoDto>> GetAllAsync();
    Task<UserInfoDto?> GetByIdAsync(int id);
    Task<AuthResponseDto?> LoginAsync(LoginDto dto);
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<UserInfoDto?> UpdateRoleAsync(int id, AdminUserUpdateDto dto);
    Task<bool> DeleteAsync(int id);
}
