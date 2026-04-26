using System.ComponentModel.DataAnnotations;
using MaxVanDam.Domain.Entities.InventoryNotification;

namespace MaxVanDam.Domain.Entities.Product;

public class ProductEntity
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Brand { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Model { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Category { get; set; } = string.Empty;

    public decimal Price { get; set; }
    public int Stock { get; set; }

    [StringLength(2000)]
    public string Description { get; set; } = string.Empty;

    [StringLength(500)]
    public string ShortDescription { get; set; } = string.Empty;

    [StringLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    public string WarehouseLocation { get; set; } = string.Empty;
    public List<string> Compatibility { get; set; } = new();

    public ICollection<InventoryNotificationEntity> InventoryNotifications { get; set; } = new List<InventoryNotificationEntity>();
}
