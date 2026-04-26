using MaxVanDam.DataAccessLayer.Context;
using MaxVanDam.Domain.Entities.InventoryNotification;
using MaxVanDam.Domain.Models.Notification;
using MaxVanDam.Domain.Models.Service;

namespace MaxVanDam.BusinessLayer.Structure;

public class NotificationActions
{
    protected ServiceResponse GetAllNotificationsAction()
    {
        try
        {
            using var db = new MasterDbContext();
            var notifications = db.InventoryNotifications
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => MapToDto(n))
                .ToList();
            return new ServiceResponse { IsSuccess = true, Data = notifications };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse GetUnreadAction()
    {
        try
        {
            using var db = new MasterDbContext();
            var notifications = db.InventoryNotifications
                .Where(n => !n.IsRead)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => MapToDto(n))
                .ToList();
            return new ServiceResponse { IsSuccess = true, Data = notifications };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse MarkAsReadAction(int id)
    {
        try
        {
            using var db = new MasterDbContext();
            var notification = db.InventoryNotifications.Find(id);
            if (notification is null)
                return new ServiceResponse { IsSuccess = false, Message = $"Notificarea cu id {id} nu a fost găsită." };

            notification.IsRead = true;
            db.SaveChanges();
            return new ServiceResponse { IsSuccess = true, Data = MapToDto(notification) };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse CreateNotificationAction(int productId)
    {
        try
        {
            using var db = new MasterDbContext();
            var product = db.Products.Find(productId);
            if (product is null)
                return new ServiceResponse { IsSuccess = false, Message = $"Produsul cu id {productId} nu există." };

            var existing = db.InventoryNotifications
                .FirstOrDefault(n => n.ProductId == productId && !n.IsRead);

            if (existing is not null)
                return new ServiceResponse { IsSuccess = true, Data = MapToDto(existing) };

            var notification = new InventoryNotificationEntity
            {
                ProductId = productId,
                ProductName = product.Name,
                Message = $"Stoc epuizat pentru produsul \"{product.Name}\"",
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            db.InventoryNotifications.Add(notification);
            db.SaveChanges();
            return new ServiceResponse { IsSuccess = true, Data = MapToDto(notification) };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    private static NotificationInfoDto MapToDto(InventoryNotificationEntity n) => new()
    {
        Id = n.Id,
        ProductId = n.ProductId,
        ProductName = n.ProductName,
        Message = n.Message,
        CreatedAt = n.CreatedAt,
        IsRead = n.IsRead
    };
}
