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

    [HttpGet("my")]
    [Authorize]
    public IActionResult GetMy()
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();

        var response = _orderLogic.GetMyOrders(userId.Value);
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
