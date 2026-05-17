using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.BusinessLayer.Structure;
using MaxVanDam.Domain.Models.Auth;
using MaxVanDam.Domain.Models.Service;
using MaxVanDam.Domain.Models.User;

namespace MaxVanDam.BusinessLayer.Core;

public class UserLogic : UserActions, IUserLogic
{
    public ServiceResponse GetUserList() => GetUserListAction();
    public ServiceResponse CreateUser(RegisterDto dto) => CreateUserAction(dto);
    public ServiceResponse UpdateUserRole(int id, AdminUserUpdateDto dto) => UpdateUserRoleAction(id, dto);
    public ServiceResponse UpdateUserStatus(int id, UserStatusDto dto) => UpdateUserStatusAction(id, dto);
    public ServiceResponse DeleteUser(int id) => DeleteUserAction(id);
}
