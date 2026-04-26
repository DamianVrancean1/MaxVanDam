using MaxVanDam.Domain.Models.Notification;

namespace MaxVanDam.BusinessLayer.Interfaces;

public interface IInventoryNotificationService
{
    Task<IEnumerable<NotificationInfoDto>> GetAllAsync();
    Task<IEnumerable<NotificationInfoDto>> GetUnreadAsync();
    Task<NotificationInfoDto?> MarkAsReadAsync(int id);
    Task<NotificationInfoDto> CreateAsync(int productId);
}
