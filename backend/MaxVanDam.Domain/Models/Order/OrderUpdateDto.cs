namespace MaxVanDam.Domain.Models.Order;

public class OrderUpdateDto
{
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public string? SupplierName { get; set; }
    public string? Category { get; set; }
    public decimal? TotalValue { get; set; }
    public int? ItemsCount { get; set; }
    public DateTime? EstimatedDelivery { get; set; }
}
