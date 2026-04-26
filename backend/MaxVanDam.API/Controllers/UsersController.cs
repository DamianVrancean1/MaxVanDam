using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.Domain.Models.Auth;
using MaxVanDam.Domain.Models.User;
using Microsoft.AspNetCore.Mvc;

namespace MaxVanDam.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserInfoDto>>> GetAll()
    {
        var users = await _userService.GetAllAsync();
        return Ok(users);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserInfoDto>> GetById(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user is null)
            return NotFound(new { message = $"Utilizatorul cu id {id} nu a fost găsit." });

        return Ok(user);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
    {
        var user = await _userService.LoginAsync(dto);
        if (user is null)
            return Unauthorized(new { message = "Username sau parolă incorecte." });

        return Ok(user);
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto dto)
    {
        try
        {
            var user = await _userService.RegisterAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }
        catch (Exception ex) when (ex.Message.Contains("unique") || ex.Message.Contains("duplicate"))
        {
            return BadRequest(new { message = "Username-ul sau email-ul este deja folosit." });
        }
    }

    [HttpPatch("{id:int}/role")]
    public async Task<ActionResult<UserInfoDto>> UpdateRole(int id, [FromBody] AdminUserUpdateDto dto)
    {
        var user = await _userService.UpdateRoleAsync(id, dto);
        if (user is null)
            return NotFound(new { message = $"Utilizatorul cu id {id} nu a fost găsit." });

        return Ok(user);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _userService.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { message = $"Utilizatorul cu id {id} nu a fost găsit." });

        return NoContent();
    }
}
