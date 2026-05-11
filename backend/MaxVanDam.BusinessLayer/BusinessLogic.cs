using MaxVanDam.BusinessLayer.Core;
using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.BusinessLayer.Services;
using MaxVanDam.BusinessLayer.Structure;
using Microsoft.Extensions.Logging;

namespace MaxVanDam.BusinessLayer;

public class BusinessLogic
{
    private readonly ILoggerFactory _loggerFactory;

    public BusinessLogic(ILoggerFactory loggerFactory)
    {
        _loggerFactory = loggerFactory;
    }

    public IAuthLogic GetAuthLogic() => new AuthLogic();
    public IProductLogic GetProductLogic() => new ProductLogic();
    public IUserLogic GetUserLogic() => new UserLogic();
    public INotificationLogic GetNotificationLogic() => new NotificationLogic();
    public ISubscriptionLogic GetSubscriptionLogic() => new SubscriptionLogic(_loggerFactory.CreateLogger<SubscriptionActions>(), GetEmailService());
    public IEmailService GetEmailService() => new EmailService(_loggerFactory.CreateLogger<EmailService>());
}
