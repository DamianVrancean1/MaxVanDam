using System.ComponentModel.DataAnnotations;

namespace MaxVanDam.Domain.Models.User;

public class UserUpdateDto
{
    [Required]
    [StringLength(100)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(200)]
    public string Email { get; set; } = string.Empty;
}
