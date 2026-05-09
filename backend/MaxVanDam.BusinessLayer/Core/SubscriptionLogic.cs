using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.BusinessLayer.Structure;
using MaxVanDam.Domain.Models.Service;
using MaxVanDam.Domain.Models.Subscription;

namespace MaxVanDam.BusinessLayer.Core;

public class SubscriptionLogic : SubscriptionActions, ISubscriptionLogic
{
    public ServiceResponse CreateSubscription(CreateSubscriptionDto dto)
    {
        return CreateSubscriptionAction(dto);
    }

    public ServiceResponse GetSubscriptionsList()
    {
        return GetSubscriptionsListAction();
    }

    public ServiceResponse GetSubscriptionById(int id)
    {
        return GetSubscriptionByIdAction(id);
    }

    public ServiceResponse CancelSubscription(int id)
    {
        return CancelSubscriptionAction(id);
    }
}


