using MaxVanDam.DataAccessLayer.Context;
using MaxVanDam.Domain.Entities.Subscription;
using MaxVanDam.Domain.Models.Service;
using MaxVanDam.Domain.Models.Subscription;

namespace MaxVanDam.BusinessLayer.Structure;

public class SubscriptionActions
{
    protected ServiceResponse CreateSubscriptionAction(CreateSubscriptionDto dto)
    {
        try
        {
            using var db = new SubscriptionDbContext();

            var expirationDate = dto.PlanId switch
            {
                "q1" => DateTime.UtcNow.AddMonths(3),
                "q2" => DateTime.UtcNow.AddYears(1),
                "q3" => DateTime.UtcNow.AddYears(3),
                _    => DateTime.UtcNow.AddMonths(1)
            };

            var cardLastFour = dto.CardNumber.Length >= 4
                ? dto.CardNumber[^4..]
                : dto.CardNumber;

            var subscription = new SubscriptionEntity
            {
                PlanId         = dto.PlanId,
                FirstName      = dto.FirstName,
                LastName       = dto.LastName,
                Email          = dto.Email,
                PhoneNumber    = dto.PhoneNumber,
                CompanyName    = dto.CompanyName,
                CardNumber     = cardLastFour,
                CardHolderName = dto.CardHolderName,
                ExpiryMonth    = dto.ExpiryMonth,
                ExpiryYear     = dto.ExpiryYear,
                Amount         = dto.Amount,
                Status         = "active",
                ExpirationDate = expirationDate,
                PurchaseDate   = DateTime.UtcNow,
                CreatedAt      = DateTime.UtcNow
            };

            db.Subscriptions.Add(subscription);
            db.SaveChanges();

            return new ServiceResponse { IsSuccess = true, Message = "Abonament creat cu succes!", Data = MapToDto(subscription) };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse GetSubscriptionsListAction()
    {
        try
        {
            using var db = new SubscriptionDbContext();
            var subscriptions = db.Subscriptions
                .OrderByDescending(s => s.CreatedAt)
                .Select(s => MapToDto(s))
                .ToList();
            return new ServiceResponse { IsSuccess = true, Data = subscriptions };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse GetSubscriptionByIdAction(int id)
    {
        try
        {
            using var db = new SubscriptionDbContext();
            var subscription = db.Subscriptions.Find(id);
            if (subscription is null)
                return new ServiceResponse { IsSuccess = false, Message = $"Abonamentul cu id {id} nu a fost găsit." };
            return new ServiceResponse { IsSuccess = true, Data = MapToDto(subscription) };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse CancelSubscriptionAction(int id)
    {
        try
        {
            using var db = new SubscriptionDbContext();
            var subscription = db.Subscriptions.Find(id);
            if (subscription is null)
                return new ServiceResponse { IsSuccess = false, Message = $"Abonamentul cu id {id} nu a fost găsit." };

            subscription.Status = "cancelled";
            db.SaveChanges();
            return new ServiceResponse { IsSuccess = true, Message = "Abonament anulat cu succes." };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse GetStatsAction()
    {
        try
        {
            using var db = new SubscriptionDbContext();
            var total = db.Subscriptions.Count();
            var active = db.Subscriptions.Count(s => s.Status == "active");
            var cancelled = db.Subscriptions.Count(s => s.Status == "cancelled");
            var revenue = db.Subscriptions.Sum(s => (decimal?)s.Amount) ?? 0m;

            var stats = new
            {
                TotalSubscriptions = total,
                ActiveSubscriptions = active,
                CancelledSubscriptions = cancelled,
                TotalRevenue = revenue,
                AverageRevenue = total > 0 ? revenue / total : 0m
            };

            return new ServiceResponse { IsSuccess = true, Data = stats };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    private static SubscriptionInfoDto MapToDto(SubscriptionEntity s) => new()
    {
        Id               = s.Id,
        PlanId           = s.PlanId,
        FirstName        = s.FirstName,
        LastName         = s.LastName,
        Email            = s.Email,
        PhoneNumber      = s.PhoneNumber,
        CompanyName      = s.CompanyName,
        CardHolderName   = s.CardHolderName,
        CardNumberMasked = $"****{s.CardNumber}",
        Amount           = s.Amount,
        Status           = s.Status,
        PurchaseDate     = s.PurchaseDate,
        ExpirationDate   = s.ExpirationDate
    };
}
