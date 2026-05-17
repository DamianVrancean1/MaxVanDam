using MaxVanDam.Domain.Models.Auth;
using MaxVanDam.Domain.Models.Service;

namespace MaxVanDam.BusinessLayer.Interfaces;

public interface IAuthLogic
{
    ServiceResponse Register(RegisterDto dto);
    ServiceResponse Login(LoginDto dto);
    ServiceResponse ChangePassword(int userId, ChangePasswordDto dto);
    ServiceResponse UpdateProfile(int userId, UpdateProfileDto dto);
}
