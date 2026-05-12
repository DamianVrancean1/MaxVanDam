using System.ComponentModel.DataAnnotations;

namespace MaxVanDam.Domain.Entities.Subscription;

public class SubscriptionEntity
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string PlanId { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string Email { get; set; } = string.Empty;

    [StringLength(50)]
    public string PhoneNumber { get; set; } = string.Empty;

    [StringLength(200)]
    public string CompanyName { get; set; } = string.Empty;

    [StringLength(4)]
    public string CardNumber { get; set; } = string.Empty;

    [StringLength(100)]
    public string CardHolderName { get; set; } = string.Empty;

    [StringLength(2)]
    public string ExpiryMonth { get; set; } = string.Empty;

    [StringLength(4)]
    public string ExpiryYear { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    [Required]
    [StringLength(20)]
    public string Status { get; set; } = "active";

    public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;
    public DateTime ExpirationDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
