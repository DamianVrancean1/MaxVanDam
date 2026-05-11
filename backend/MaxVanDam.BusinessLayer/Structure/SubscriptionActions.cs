using MaxVanDam.DataAccessLayer.Context;
using MaxVanDam.Domain.Entities.Subscription;
using MaxVanDam.Domain.Models.Service;
using MaxVanDam.Domain.Models.Subscription;
using MaxVanDam.BusinessLayer.Interfaces;
using Microsoft.Extensions.Logging;

namespace MaxVanDam.BusinessLayer.Structure;

public class SubscriptionActions
{
    private readonly ILogger<SubscriptionActions> _logger;
    private readonly IEmailService _emailService;

    public SubscriptionActions(ILogger<SubscriptionActions> logger, IEmailService emailService)
    {
        _logger = logger;
        _emailService = emailService;
    }

    protected ServiceResponse CreateSubscriptionAction(CreateSubscriptionDto dto)
    {
        try
        {
            _logger.LogInformation("Creating subscription for {Email} with plan {PlanId}", dto.Email, dto.PlanId);

            using var db = new SubscriptionDbContext();

            // Validate required fields
            if (string.IsNullOrWhiteSpace(dto.FirstName) || string.IsNullOrWhiteSpace(dto.LastName))
            {
                _logger.LogWarning("Subscription creation failed: Missing name for {Email}", dto.Email);
                return new ServiceResponse { IsSuccess = false, Message = "Nume și prenume sunt obligatorii." };
            }

            if (string.IsNullOrWhiteSpace(dto.Email))
            {
                _logger.LogWarning("Subscription creation failed: Missing email");
                return new ServiceResponse { IsSuccess = false, Message = "Email-ul este obligatoriu." };
            }

            if (string.IsNullOrWhiteSpace(dto.CompanyName))
            {
                _logger.LogWarning("Subscription creation failed: Missing company name for {Email}", dto.Email);
                return new ServiceResponse { IsSuccess = false, Message = "Denumirea companiei este obligatorie." };
            }

            // Calculate expiration date based on plan
            var expirationDate = dto.PlanId switch
            {
                "q1" => DateTime.UtcNow.AddMonths(3),
                "q2" => DateTime.UtcNow.AddYears(1),
                "q3" => DateTime.UtcNow.AddYears(3),
                _ => DateTime.UtcNow.AddMonths(1)
            };

            // Store only last 4 digits of card
            var cardLastFourDigits = dto.CardNumber.Length >= 4
                ? dto.CardNumber.Substring(dto.CardNumber.Length - 4)
                : dto.CardNumber;

            var subscription = new SubscriptionEntity
            {
                PlanId = dto.PlanId,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                CompanyName = dto.CompanyName,
                CardNumber = cardLastFourDigits,
                CardHolderName = dto.CardHolderName,
                ExpiryMonth = dto.ExpiryMonth,
                ExpiryYear = dto.ExpiryYear,
                Amount = dto.Amount,
                Status = "active",
                ExpirationDate = expirationDate,
                PurchaseDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            db.Subscriptions.Add(subscription);
            db.SaveChanges();

            _logger.LogInformation("Subscription created successfully for {Email}, ID: {Id}", dto.Email, subscription.Id);

            // Send confirmation email asynchronously (don't wait for it to complete)
            _ = Task.Run(async () =>
            {
                try
                {
                    await _emailService.SendSubscriptionConfirmationAsync(dto.Email, dto.FirstName, dto.PlanId, dto.Amount);
                    await _emailService.SendAdminNotificationAsync(
                        "Nou abonament creat",
                        $"Un nou abonament a fost creat pentru {dto.FirstName} {dto.LastName} ({dto.Email}) - Plan: {dto.PlanId}, Sumă: {dto.Amount} MDL"
                    );
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error sending emails for subscription {Id}", subscription.Id);
                }
            });

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Abonament creat cu succes!",
                Data = MapToDto(subscription)
            };
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error creating subscription for {Email}", dto?.Email ?? "unknown");
            return new ServiceResponse { IsSuccess = false, Message = $"Eroare la crearea abonamentului: {e.Message}" };
        }
    }

    protected ServiceResponse GetSubscriptionsListAction()
    {
        try
        {
            _logger.LogInformation("Retrieving subscriptions list");

            using var db = new SubscriptionDbContext();
            var subscriptions = db.Subscriptions
                .OrderByDescending(s => s.CreatedAt)
                .Select(s => MapToDto(s))
                .ToList();

            _logger.LogInformation("Retrieved {Count} subscriptions", subscriptions.Count);

            return new ServiceResponse { IsSuccess = true, Data = subscriptions };
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error retrieving subscriptions list");
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse GetSubscriptionByIdAction(int id)
    {
        try
        {
            _logger.LogInformation("Retrieving subscription with ID {Id}", id);

            using var db = new SubscriptionDbContext();
            var subscription = db.Subscriptions.Find(id);

            if (subscription is null)
            {
                _logger.LogWarning("Subscription with ID {Id} not found", id);
                return new ServiceResponse { IsSuccess = false, Message = "Abonament nu a fost găsit." };
            }

            _logger.LogInformation("Retrieved subscription {Id} for {Email}", id, subscription.Email);

            return new ServiceResponse { IsSuccess = true, Data = MapToDto(subscription) };
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error retrieving subscription with ID {Id}", id);
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse CancelSubscriptionAction(int id)
    {
        try
        {
            _logger.LogInformation("Cancelling subscription with ID {Id}", id);

            using var db = new SubscriptionDbContext();
            var subscription = db.Subscriptions.Find(id);

            if (subscription is null)
            {
                _logger.LogWarning("Cannot cancel: subscription with ID {Id} not found", id);
                return new ServiceResponse { IsSuccess = false, Message = "Abonament nu a fost găsit." };
            }

            subscription.Status = "cancelled";
            db.SaveChanges();

            _logger.LogInformation("Subscription {Id} cancelled successfully for {Email}", id, subscription.Email);

            return new ServiceResponse { IsSuccess = true, Message = "abonament anulat cu succes." };
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error cancelling subscription with ID {Id}", id);
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    private static SubscriptionInfoDto MapToDto(SubscriptionEntity s) => new()
    {
        Id = s.Id,
        PlanId = s.PlanId,
        FirstName = s.FirstName,
        LastName = s.LastName,
        Email = s.Email,
        PhoneNumber = s.PhoneNumber,
        CompanyName = s.CompanyName,
        CardHolderName = s.CardHolderName,
        CardNumberMasked = $"****{s.CardNumber}",
        Amount = s.Amount,
        Status = s.Status,
        PurchaseDate = s.PurchaseDate,
        ExpirationDate = s.ExpirationDate
    };
}
