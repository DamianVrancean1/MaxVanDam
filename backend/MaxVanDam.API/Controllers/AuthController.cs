using System.Security.Claims;
using MaxVanDam.BusinessLayer;
using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.Domain.Models.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

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
    [EnableRateLimiting(RateLimitPolicies.Login)]
    public IActionResult Login([FromBody] LoginDto dto)
    {
        var response = _authLogic.Login(dto);
        if (!response.IsSuccess) return BadRequest(response.Message);

        var data = (AuthResponseDto)response.Data!;
        SetAuthCookies(data.Token!, data.RefreshToken!);

        // Return only user info — tokens are delivered via HttpOnly cookies, not body
        return Ok(new
        {
            data.Id,
            data.Username,
            data.Role,
            data.Email,
            data.CreatedAt,
        });
    }

    [HttpPost("refresh")]
    public IActionResult Refresh()
    {
        var rawRefreshToken = Request.Cookies["refresh_token"];
        if (string.IsNullOrEmpty(rawRefreshToken))
            return Unauthorized(new { message = "Refresh token lipsă." });

        var response = _authLogic.Refresh(new RefreshRequestDto { RefreshToken = rawRefreshToken });
        if (!response.IsSuccess)
        {
            ClearAuthCookies();
            return Unauthorized(new { message = response.Message });
        }

        var data = (AuthResponseDto)response.Data!;
        SetAuthCookies(data.Token!, data.RefreshToken!);

        return Ok(new
        {
            data.Id,
            data.Username,
            data.Role,
            data.Email,
            data.CreatedAt,
        });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var rawRefreshToken = Request.Cookies["refresh_token"];
        if (!string.IsNullOrEmpty(rawRefreshToken))
            _authLogic.Logout(new RefreshRequestDto { RefreshToken = rawRefreshToken });

        ClearAuthCookies();
        return Ok(new { message = "Deconectat cu succes." });
    }

    // Session restore endpoint: called by frontend on app startup to verify session.
    // Requires JWT cookie — becomes fully functional after Task 3 (cookie JWT middleware).
    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        var userId   = GetCurrentUserId();
        if (userId is null) return Unauthorized();

        return Ok(new
        {
            id       = userId,
            username = User.FindFirstValue(ClaimTypes.Name),
            role     = User.FindFirstValue(ClaimTypes.Role),
            email    = User.FindFirstValue(ClaimTypes.Email),
        });
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

    // ── Private helpers ───────────────────────────────────────────────────────

    private int? GetCurrentUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var id) ? id : null;
    }

    private void SetAuthCookies(string accessToken, string rawRefreshToken)
    {
        var accessMinutes = int.TryParse(
            Environment.GetEnvironmentVariable("ACCESS_TOKEN_EXPIRY_MINUTES"), out var m) ? m : 15;
        var refreshDays = int.TryParse(
            Environment.GetEnvironmentVariable("REFRESH_TOKEN_EXPIRY_DAYS"), out var d) ? d : 7;

        // access_token — short-lived, sent to all API routes
        Response.Cookies.Append("access_token", accessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure   = Request.IsHttps,        // true in prod (HTTPS), false in local dev (HTTP)
            SameSite = SameSiteMode.Strict,
            Path     = "/",
            MaxAge   = TimeSpan.FromMinutes(accessMinutes),
        });

        // refresh_token — long-lived, scoped only to /api/auth to minimize exposure
        Response.Cookies.Append("refresh_token", rawRefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure   = Request.IsHttps,
            SameSite = SameSiteMode.Strict,
            Path     = "/api/auth",
            MaxAge   = TimeSpan.FromDays(refreshDays),
        });
    }

    private void ClearAuthCookies()
    {
        Response.Cookies.Delete("access_token", new CookieOptions
        {
            HttpOnly = true,
            Secure   = Request.IsHttps,
            SameSite = SameSiteMode.Strict,
            Path     = "/",
        });
        Response.Cookies.Delete("refresh_token", new CookieOptions
        {
            HttpOnly = true,
            Secure   = Request.IsHttps,
            SameSite = SameSiteMode.Strict,
            Path     = "/api/auth",
        });
    }
}
