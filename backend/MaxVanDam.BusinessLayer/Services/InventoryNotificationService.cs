using MaxVanDam.BusinessLayer.DTOs.Notification;
using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.DataAccessLayer.Context;
using MaxVanDam.Domain.Entities.InventoryNotification;
using Microsoft.EntityFrameworkCore;

namespace MaxVanDam.BusinessLayer.Services;

public class InventoryNotificationService : IInventoryNotificationService
{
    private readonly AppDbContext _context;

    public InventoryNotificationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<NotificationResponseDto>> GetAllAsync()
    {
        return await _context.InventoryNotifications
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => MapToDto(n))
            .ToListAsync();
    }

    public async Task<IEnumerable<NotificationResponseDto>> GetUnreadAsync()
    {
        return await _context.InventoryNotifications
            .Where(n => !n.IsRead)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => MapToDto(n))
            .ToListAsync();
    }

    public async Task<NotificationResponseDto?> MarkAsReadAsync(int id)
    {
        var notification = await _context.InventoryNotifications.FindAsync(id);
        if (notification is null) return null;

        notification.IsRead = true;
        await _context.SaveChangesAsync();
        return MapToDto(notification);
    }

    public async Task<NotificationResponseDto> CreateAsync(int productId)
    {
        var product = await _context.Products.FindAsync(productId)
            ?? throw new ArgumentException($"Produsul cu id {productId} nu există.");

        var existing = await _context.InventoryNotifications
            .AnyAsync(n => n.ProductId == productId && !n.IsRead);

        if (existing)
        {
            var existingDto = await _context.InventoryNotifications
                .Where(n => n.ProductId == productId && !n.IsRead)
                .Select(n => MapToDto(n))
                .FirstAsync();
            return existingDto;
        }

        var notification = new InventoryNotificationEntity
        {
            ProductId = productId,
            ProductName = product.Name,
            Message = $"Stoc epuizat pentru produsul \"{product.Name}\"",
            CreatedAt = DateTime.UtcNow,
            IsRead = false
        };

        _context.InventoryNotifications.Add(notification);
        await _context.SaveChangesAsync();
        return MapToDto(notification);
    }

    private static NotificationResponseDto MapToDto(InventoryNotificationEntity n) => new()
    {
        Id = n.Id,
        ProductId = n.ProductId,
        ProductName = n.ProductName,
        Message = n.Message,
        CreatedAt = n.CreatedAt,
        IsRead = n.IsRead
    };
}
