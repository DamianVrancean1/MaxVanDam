using MaxVanDam.Domain.Models.Service;
using MaxVanDam.Domain.Models.Subscription;

namespace MaxVanDam.BusinessLayer.Interfaces;

public interface ISubscriptionLogic
{
    ServiceResponse CreateSubscription(CreateSubscriptionDto dto);
    ServiceResponse GetSubscriptionsList();
    ServiceResponse GetSubscriptionById(int id);
    ServiceResponse CancelSubscription(int id);
}

