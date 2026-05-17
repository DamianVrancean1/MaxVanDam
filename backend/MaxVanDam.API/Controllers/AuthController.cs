using System.Security.Claims;
using MaxVanDam.BusinessLayer;
using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.Domain.Models.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MaxVanDam.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthLogic _authLogic;

    public AuthController()
    {
        var bl = new BusinessLogic();
        _authLogic = bl.GetAuthLogic();
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterDto dto)
    {
        var response = _authLogic.Register(dto);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDto dto)
    {
        var response = _authLogic.Login(dto);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [HttpPost("change-password")]
    [Authorize]
    public IActionResult ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();

        var response = _authLogic.ChangePassword(userId.Value, dto);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(new { message = response.Message });
    }

    [HttpPatch("profile")]
    [Authorize]
    public IActionResult UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();

        var response = _authLogic.UpdateProfile(userId.Value, dto);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    private int? GetCurrentUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var id) ? id : null;
    }
}
