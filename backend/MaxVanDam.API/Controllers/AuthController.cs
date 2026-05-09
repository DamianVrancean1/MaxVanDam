using MaxVanDam.BusinessLayer;
using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.Domain.Models.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MaxVanDam.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthLogic _authLogic;

    public AuthController(ILoggerFactory loggerFactory)
    {
        var bl = new BusinessLogic(loggerFactory);
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
}
