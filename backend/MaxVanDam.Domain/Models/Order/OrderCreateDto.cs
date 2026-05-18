using System.ComponentModel.DataAnnotations;

namespace MaxVanDam.Domain.Models.Order;

public class OrderCreateDto
{
    [Required(ErrorMessage = "SupplierName este obligatoriu.")]
    [StringLength(200, MinimumLength = 1)]
    public string SupplierName { get; set; } = string.Empty;

    public string ItemsJson { get; set; } = "[]";

    [Range(0, int.MaxValue, ErrorMessage = "ItemsCount nu poate fi negativ.")]
    public int ItemsCount { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "TotalValue nu poate fi negativă.")]
    public decimal TotalValue { get; set; }

    public string Status { get; set; } = "pending";

    public string Priority { get; set; } = "normal";

    [StringLength(100)]
    public string Category { get; set; } = string.Empty;

    public DateTime? EstimatedDelivery { get; set; }
}
