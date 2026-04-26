using System.ComponentModel.DataAnnotations;

namespace MaxVanDam.Domain.Models.User;

public class AdminUserUpdateDto
{
    [Required]
    public string Role { get; set; } = string.Empty;
}
