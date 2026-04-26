using System.ComponentModel.DataAnnotations;

namespace MaxVanDam.Domain.Models.Auth;

public class LoginDto
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
