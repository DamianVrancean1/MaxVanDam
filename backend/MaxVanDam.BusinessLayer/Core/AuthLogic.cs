using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.BusinessLayer.Structure;
using MaxVanDam.Domain.Models.Auth;
using MaxVanDam.Domain.Models.Service;

namespace MaxVanDam.BusinessLayer.Core;

public class AuthLogic : AuthActions, IAuthLogic
{
    public ServiceResponse Register(RegisterDto dto) => RegisterAction(dto);
    public ServiceResponse Login(LoginDto dto) => LoginAction(dto);
    public ServiceResponse ChangePassword(int userId, ChangePasswordDto dto) => ChangePasswordAction(userId, dto);
    public ServiceResponse UpdateProfile(int userId, UpdateProfileDto dto) => UpdateProfileAction(userId, dto);
}
