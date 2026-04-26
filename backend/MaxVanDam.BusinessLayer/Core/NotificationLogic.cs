using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.BusinessLayer.Structure;
using MaxVanDam.Domain.Models.Service;

namespace MaxVanDam.BusinessLayer.Core;

public class NotificationLogic : NotificationActions, INotificationLogic
{
    public ServiceResponse GetAllNotifications() => GetAllNotificationsAction();
    public ServiceResponse GetUnread() => GetUnreadAction();
    public ServiceResponse MarkAsRead(int id) => MarkAsReadAction(id);
    public ServiceResponse CreateNotification(int productId) => CreateNotificationAction(productId);
}
