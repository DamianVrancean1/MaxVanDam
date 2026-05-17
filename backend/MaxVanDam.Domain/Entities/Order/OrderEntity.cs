using System.ComponentModel.DataAnnotations;

namespace MaxVanDam.Domain.Entities.Order;

public class OrderEntity
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(200)]
    public string SupplierName { get; set; } = string.Empty;

    public string ItemsJson { get; set; } = "[]";

    public int ItemsCount { get; set; }

    public decimal TotalValue { get; set; }

    [Required]
    [StringLength(50)]
    public string Status { get; set; } = "pending";

    [Required]
    [StringLength(50)]
    public string Priority { get; set; } = "normal";

    [StringLength(100)]
    public string Category { get; set; } = string.Empty;

    public DateTime? EstimatedDelivery { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
