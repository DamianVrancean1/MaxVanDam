using MaxVanDam.BusinessLayer.Core;
using MaxVanDam.BusinessLayer.Interfaces;

namespace MaxVanDam.BusinessLayer;

public class BusinessLogic
{
    public IAuthLogic GetAuthLogic() => new AuthLogic();
    public IProductLogic GetProductLogic() => new ProductLogic();
    public IUserLogic GetUserLogic() => new UserLogic();
    public INotificationLogic GetNotificationLogic() => new NotificationLogic();
    public ISubscriptionLogic GetSubscriptionLogic() => new SubscriptionLogic();
    public IOrderLogic GetOrderLogic() => new OrderLogic();
}
