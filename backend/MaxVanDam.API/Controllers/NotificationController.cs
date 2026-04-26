using MaxVanDam.BusinessLayer;
using MaxVanDam.BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MaxVanDam.API.Controllers;

[ApiController]
[Route("api/notifications")]
public class NotificationController : ControllerBase
{
    private readonly INotificationLogic _notificationLogic;

    public NotificationController()
    {
        var bl = new BusinessLogic();
        _notificationLogic = bl.GetNotificationLogic();
    }

    [HttpGet("list")]
    public IActionResult GetList()
    {
        var response = _notificationLogic.GetAllNotifications();
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [HttpGet("unread")]
    public IActionResult GetUnread()
    {
        var response = _notificationLogic.GetUnread();
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [HttpPatch("{id}/read")]
    public IActionResult MarkAsRead(int id)
    {
        var response = _notificationLogic.MarkAsRead(id);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [HttpPost("create")]
    public IActionResult Create([FromBody] int productId)
    {
        var response = _notificationLogic.CreateNotification(productId);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }
}
