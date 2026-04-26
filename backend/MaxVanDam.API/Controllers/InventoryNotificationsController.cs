using MaxVanDam.BusinessLayer.DTOs.Notification;
using MaxVanDam.BusinessLayer.Interfaces;
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
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<NotificationResponseDto>>> GetAll()
    {
        var notifications = await _notificationService.GetAllAsync();
        return Ok(notifications);
    }

    [HttpGet("unread")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<NotificationResponseDto>>> GetUnread()
    {
        var notifications = await _notificationService.GetUnreadAsync();
        return Ok(notifications);
    }

    [HttpPatch("{id:int}/read")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<NotificationResponseDto>> MarkAsRead(int id)
    {
        var notification = await _notificationService.MarkAsReadAsync(id);
        if (notification is null)
            return NotFound(new { message = $"Notificarea cu id {id} nu a fost găsită." });

        return Ok(notification);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<NotificationResponseDto>> Create([FromBody] int productId)
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
