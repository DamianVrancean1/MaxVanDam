using MaxVanDam.Domain.Models.Auth;
using MaxVanDam.Domain.Models.Service;
using MaxVanDam.Domain.Models.User;

namespace MaxVanDam.BusinessLayer.Interfaces;

public interface IUserLogic
{
    ServiceResponse GetUserList();
    ServiceResponse CreateUser(RegisterDto dto);
    ServiceResponse UpdateUserRole(int id, AdminUserUpdateDto dto);
    ServiceResponse DeleteUser(int id);
}
