using System.ComponentModel.DataAnnotations;

namespace MaxVanDam.Domain.Models.Auth;

public class UpdateProfileDto
{
    [StringLength(100)]
    public string? Username { get; set; }

    [StringLength(200)]
    public string? Email { get; set; }
}
