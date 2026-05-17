namespace MaxVanDam.Domain.Models.Order;

public class OrderInfoDto
{
    public int Id { get; set; }
    public string SupplierName { get; set; } = string.Empty;
    public string ItemsJson { get; set; } = "[]";
    public int ItemsCount { get; set; }
    public decimal TotalValue { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public DateTime? EstimatedDelivery { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
