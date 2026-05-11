using System.ComponentModel.DataAnnotations;

namespace MaxVanDam.Domain.Models.Subscription;

public class CreateSubscriptionDto
{
    [Required(ErrorMessage = "Planul este obligatoriu")]
    [RegularExpression("^(q1|q2|q3)$", ErrorMessage = "Plan invalid")]
    public string PlanId { get; set; } = string.Empty;

    [Required(ErrorMessage = "Prenumele este obligatoriu")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Prenumele trebuie să aibă între 2 și 50 de caractere")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Numele este obligatoriu")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Numele trebuie să aibă între 2 și 50 de caractere")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email-ul este obligatoriu")]
    [EmailAddress(ErrorMessage = "Email invalid")]
    [StringLength(200, ErrorMessage = "Email-ul nu poate depăși 200 de caractere")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Numărul de telefon este obligatoriu")]
    [Phone(ErrorMessage = "Număr de telefon invalid")]
    [StringLength(20, ErrorMessage = "Numărul de telefon nu poate depăși 20 de caractere")]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Denumirea companiei este obligatorie")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Denumirea companiei trebuie să aibă între 2 și 100 de caractere")]
    public string CompanyName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Numărul cardului este obligatoriu")]
    [RegularExpression(@"^\d{13,19}$", ErrorMessage = "Număr card invalid (13-19 cifre)")]
    public string CardNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Numele deținătorului cardului este obligatoriu")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Numele deținătorului trebuie să aibă între 2 și 100 de caractere")]
    public string CardHolderName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Luna expirării este obligatorie")]
    [RegularExpression(@"^(0[1-9]|1[0-2])$", ErrorMessage = "Luna expirării invalidă (01-12)")]
    public string ExpiryMonth { get; set; } = string.Empty;

    [Required(ErrorMessage = "Anul expirării este obligatoriu")]
    [RegularExpression(@"^\d{4}$", ErrorMessage = "Anul expirării invalid (YYYY)")]
    public string ExpiryYear { get; set; } = string.Empty;

    [Required(ErrorMessage = "Suma este obligatorie")]
    [Range(0.01, 10000, ErrorMessage = "Suma trebuie să fie între 0.01 și 10000")]
    public decimal Amount { get; set; }
}

public class SubscriptionInfoDto
{
    public int Id { get; set; }
    public string PlanId { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string CardHolderName { get; set; } = string.Empty;
    public string CardNumberMasked { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime PurchaseDate { get; set; }
    public DateTime ExpirationDate { get; set; }
}
