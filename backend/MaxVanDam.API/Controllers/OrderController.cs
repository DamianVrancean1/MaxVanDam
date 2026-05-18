using System.Security.Claims;
using MaxVanDam.BusinessLayer;
using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.Domain.Models.Order;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MaxVanDam.API.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly IOrderLogic _orderLogic;
    private readonly ILogger<OrderController> _logger;

    public OrderController(ILogger<OrderController> logger)
    {
        var bl = new BusinessLogic();
        _orderLogic = bl.GetOrderLogic();
        _logger = logger;
    }

    private static readonly HashSet<string> ValidStatuses =
        ["pending", "processing", "shipped", "delivered", "cancelled"];

    // ── User endpoint ─────────────────────────────────────────────────────────

    [HttpGet("my")]
    public IActionResult GetMy(
        [FromQuery] string?   status    = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate   = null)
    {
        var userId = GetCurrentUserId();
        if (userId is null)
        {
            _logger.LogWarning("GetMy: NameIdentifier claim absent din JWT. IP={IP}", GetClientIp());
            return Unauthorized(new { message = "Sesiune invalidă." });
        }

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
        if (!response.IsSuccess) return BadRequest(new { message = response.Message });
        return Ok(response.Data);
    }

    // ── Admin endpoints ───────────────────────────────────────────────────────

    [HttpGet("list")]
    [Authorize(Roles = "admin")]
    public IActionResult GetList()
    {
        var response = _orderLogic.GetOrderList();
        if (!response.IsSuccess) return BadRequest(new { message = response.Message });
        return Ok(response.Data);
    }

    [HttpGet("{id:int}")]
    [Authorize(Roles = "admin")]
    public IActionResult GetById(int id)
    {
        if (id <= 0) return BadRequest(new { message = "ID invalid." });

        var response = _orderLogic.GetOrderById(id);
        if (!response.IsSuccess) return NotFound(new { message = "Comanda nu a fost găsită." });
        return Ok(response.Data);
    }

    [HttpPost("create")]
    [Authorize(Roles = "admin")]
    public IActionResult Create([FromBody] OrderCreateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(new { message = "Date invalide.", errors = ModelState });

        var userId = GetCurrentUserId();
        var response = _orderLogic.CreateOrder(dto, userId);
        if (!response.IsSuccess) return BadRequest(new { message = response.Message });
        return Ok(response.Data);
    }

    [HttpPatch("{id:int}")]
    [Authorize(Roles = "admin")]
    public IActionResult Update(int id, [FromBody] OrderUpdateDto dto)
    {
        if (id <= 0) return BadRequest(new { message = "ID invalid." });
        if (!ModelState.IsValid) return BadRequest(new { message = "Date invalide.", errors = ModelState });

        var response = _orderLogic.UpdateOrder(id, dto);
        if (!response.IsSuccess) return BadRequest(new { message = response.Message });
        return Ok(response.Data);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "admin")]
    public IActionResult Delete(int id)
    {
        if (id <= 0) return BadRequest(new { message = "ID invalid." });

        var response = _orderLogic.DeleteOrder(id);
        if (!response.IsSuccess) return BadRequest(new { message = response.Message });
        return Ok(new { message = response.Message });
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private int? GetCurrentUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var id) ? id : null;
    }

    private string GetClientIp() =>
        HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
}
