using MaxVanDam.BusinessLayer;
using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.Domain.Models.Auth;
using MaxVanDam.Domain.Models.User;
using Microsoft.AspNetCore.Mvc;
namespace MaxVanDam.API.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly IUserLogic _userLogic;

    public UserController()
    {
        var bl = new BusinessLogic();
        _userLogic = bl.GetUserLogic();
    }

    [HttpGet("list")]
    public IActionResult GetList()
    {
        var response = _userLogic.GetUserList();
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [HttpPost("create")]
    public IActionResult Create([FromBody] RegisterDto dto)
    {
        var response = _userLogic.CreateUser(dto);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [HttpPut("{id}/role")]
    public IActionResult UpdateRole(int id, [FromBody] AdminUserUpdateDto dto)
    {
        var response = _userLogic.UpdateUserRole(id, dto);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = _userLogic.DeleteUser(id);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Message);
    }
}
