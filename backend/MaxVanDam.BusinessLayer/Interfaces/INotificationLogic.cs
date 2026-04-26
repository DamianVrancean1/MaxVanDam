using MaxVanDam.Domain.Models.Service;

namespace MaxVanDam.BusinessLayer.Interfaces;

public interface INotificationLogic
{
    ServiceResponse GetAllNotifications();
    ServiceResponse GetUnread();
    ServiceResponse MarkAsRead(int id);
    ServiceResponse CreateNotification(int productId);
}
