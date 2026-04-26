using System.ComponentModel.DataAnnotations;

namespace MaxVanDam.Domain.Models.Auth;

public class RegisterDto
{
    [Required]
    [StringLength(100)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(200)]
    public string Email { get; set; } = string.Empty;
}
