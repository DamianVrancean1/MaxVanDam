namespace MaxVanDam.Domain.Models.Order;

public class OrderCreateDto
{
    public string SupplierName { get; set; } = string.Empty;
    public string ItemsJson { get; set; } = "[]";
    public int ItemsCount { get; set; }
    public decimal TotalValue { get; set; }
    public string Status { get; set; } = "pending";
    public string Priority { get; set; } = "normal";
    public string Category { get; set; } = string.Empty;
    public DateTime? EstimatedDelivery { get; set; }
}
