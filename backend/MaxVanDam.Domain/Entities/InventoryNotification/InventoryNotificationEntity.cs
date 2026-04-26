using System.ComponentModel.DataAnnotations;
using MaxVanDam.Domain.Entities.Product;

namespace MaxVanDam.Domain.Entities.InventoryNotification;

public class InventoryNotificationEntity
{
    [Key]
    public int Id { get; set; }

    public int ProductId { get; set; }

    [Required]
    [StringLength(200)]
    public string ProductName { get; set; } = string.Empty;

    [Required]
    [StringLength(500)]
    public string Message { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsRead { get; set; } = false;

    public ProductEntity Product { get; set; } = null!;
}
