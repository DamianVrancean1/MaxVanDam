namespace MaxVanDam.Domain.Models.Order;

public class OrderQueryDto
{
    /// <summary>Filter by order status. Accepted: pending, processing, shipped, delivered, cancelled.</summary>
    public string? Status { get; set; }

    /// <summary>Include only orders created on or after this date (UTC).</summary>
    public DateTime? StartDate { get; set; }

    /// <summary>Include only orders created on or before this date (UTC), inclusive to end of day.</summary>
    public DateTime? EndDate { get; set; }
}
