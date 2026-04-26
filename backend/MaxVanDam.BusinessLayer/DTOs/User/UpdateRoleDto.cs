using System.ComponentModel.DataAnnotations;

namespace MaxVanDam.BusinessLayer.DTOs.User;

public class UpdateRoleDto
{
    [Required]
    public string Role { get; set; } = string.Empty;
}
