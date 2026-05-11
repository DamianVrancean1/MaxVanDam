using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.BusinessLayer.Structure;
using MaxVanDam.Domain.Models.Service;
using MaxVanDam.Domain.Models.Subscription;

namespace MaxVanDam.BusinessLayer.Core;

public class SubscriptionLogic : SubscriptionActions, ISubscriptionLogic
{
    public ServiceResponse CreateSubscription(CreateSubscriptionDto dto)
        => CreateSubscriptionAction(dto);

    public ServiceResponse GetSubscriptionsList()
        => GetSubscriptionsListAction();

    public ServiceResponse GetSubscriptionById(int id)
        => GetSubscriptionByIdAction(id);

    public ServiceResponse CancelSubscription(int id)
        => CancelSubscriptionAction(id);

    public ServiceResponse GetStats()
        => GetStatsAction();
}
