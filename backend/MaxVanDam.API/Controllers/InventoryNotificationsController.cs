using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.Domain.Models.Notification;
using Microsoft.AspNetCore.Mvc;

namespace MaxVanDam.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InventoryNotificationsController : ControllerBase
{
    private readonly IInventoryNotificationService _notificationService;

    public InventoryNotificationsController(IInventoryNotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NotificationInfoDto>>> GetAll()
    {
        var notifications = await _notificationService.GetAllAsync();
        return Ok(notifications);
    }

    [HttpGet("unread")]
    public async Task<ActionResult<IEnumerable<NotificationInfoDto>>> GetUnread()
    {
        var notifications = await _notificationService.GetUnreadAsync();
        return Ok(notifications);
    }

    [HttpPatch("{id:int}/read")]
    public async Task<ActionResult<NotificationInfoDto>> MarkAsRead(int id)
    {
        var notification = await _notificationService.MarkAsReadAsync(id);
        if (notification is null)
            return NotFound(new { message = $"Notificarea cu id {id} nu a fost găsită." });

        return Ok(notification);
    }

    [HttpPost]
    public async Task<ActionResult<NotificationInfoDto>> Create([FromBody] int productId)
    {
        try
        {
            var notification = await _notificationService.CreateAsync(productId);
            return CreatedAtAction(nameof(GetAll), notification);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
