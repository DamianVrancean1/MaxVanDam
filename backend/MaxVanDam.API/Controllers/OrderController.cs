using System.Security.Claims;
using MaxVanDam.BusinessLayer;
using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.Domain.Models.Order;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MaxVanDam.API.Controllers;

[ApiController]
[Route("api/orders")]
public class OrderController : ControllerBase
{
    private readonly IOrderLogic _orderLogic;

    public OrderController()
    {
        var bl = new BusinessLogic();
        _orderLogic = bl.GetOrderLogic();
    }

    private static readonly HashSet<string> ValidStatuses =
        ["pending", "processing", "shipped", "delivered", "cancelled"];

    [HttpGet("my")]
    [Authorize]
    public IActionResult GetMy(
        [FromQuery] string?   status    = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate   = null)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();

        if (status is not null && !ValidStatuses.Contains(status.ToLower()))
            return BadRequest(new { message = $"Status invalid. Valori acceptate: {string.Join(", ", ValidStatuses)}." });

        if (startDate.HasValue && endDate.HasValue && startDate.Value > endDate.Value)
            return BadRequest(new { message = "startDate nu poate fi după endDate." });

        var query = new OrderQueryDto
        {
            Status    = status?.ToLower(),
            StartDate = startDate.HasValue ? DateTime.SpecifyKind(startDate.Value, DateTimeKind.Utc) : null,
            EndDate   = endDate.HasValue   ? DateTime.SpecifyKind(endDate.Value,   DateTimeKind.Utc) : null,
        };

        var response = _orderLogic.GetMyOrders(userId.Value, query);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [HttpGet("list")]
    [Authorize(Roles = "admin")]
    public IActionResult GetList()
    {
        var response = _orderLogic.GetOrderList();
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult GetById(int id)
    {
        var response = _orderLogic.GetOrderById(id);
        if (!response.IsSuccess) return NotFound(response.Message);
        return Ok(response.Data);
    }

    [HttpPost("create")]
    [Authorize(Roles = "admin")]
    public IActionResult Create([FromBody] OrderCreateDto dto)
    {
        var response = _orderLogic.CreateOrder(dto);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [HttpPatch("{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult Update(int id, [FromBody] OrderUpdateDto dto)
    {
        var response = _orderLogic.UpdateOrder(id, dto);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult Delete(int id)
    {
        var response = _orderLogic.DeleteOrder(id);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Message);
    }

    private int? GetCurrentUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var id) ? id : null;
    }
}
