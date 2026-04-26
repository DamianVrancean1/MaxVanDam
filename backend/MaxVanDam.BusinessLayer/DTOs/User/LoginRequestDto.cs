using System.ComponentModel.DataAnnotations;

namespace MaxVanDam.BusinessLayer.DTOs.User;

public class LoginRequestDto
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
