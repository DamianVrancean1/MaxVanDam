namespace MaxVanDam.Domain.Entities.Subscription;

public class SubscriptionEntity
{
    public int Id { get; set; }
    public string PlanId { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string CardNumber { get; set; } = string.Empty; // Last 4 digits only
    public string CardHolderName { get; set; } = string.Empty;
    public string ExpiryMonth { get; set; } = string.Empty;
    public string ExpiryYear { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = "active"; // active, expired, cancelled
    public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;
    public DateTime ExpirationDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

