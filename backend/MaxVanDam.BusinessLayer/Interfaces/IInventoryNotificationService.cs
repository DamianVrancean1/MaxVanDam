using MaxVanDam.BusinessLayer.DTOs.Notification;

namespace MaxVanDam.BusinessLayer.Interfaces;

public interface IInventoryNotificationService
{
    Task<IEnumerable<NotificationResponseDto>> GetAllAsync();
    Task<IEnumerable<NotificationResponseDto>> GetUnreadAsync();
    Task<NotificationResponseDto?> MarkAsReadAsync(int id);
    Task<NotificationResponseDto> CreateAsync(int productId);
}
