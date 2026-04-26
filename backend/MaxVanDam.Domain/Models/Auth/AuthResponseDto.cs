namespace MaxVanDam.Domain.Models.Auth;

public class AuthResponseDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
