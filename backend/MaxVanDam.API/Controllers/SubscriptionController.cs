using MaxVanDam.BusinessLayer;
using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.Domain.Models.Subscription;
using Microsoft.AspNetCore.Mvc;

namespace MaxVanDam.API.Controllers;

[ApiController]
[Route("api/subscriptions")]
public class SubscriptionController : ControllerBase
{
    private readonly ISubscriptionLogic _subscriptionLogic;

    public SubscriptionController()
    {
        var bl = new BusinessLogic();
        _subscriptionLogic = bl.GetSubscriptionLogic();
    }

    [HttpPost("create")]
    public IActionResult Create([FromBody] CreateSubscriptionDto dto)
    {
        var response = _subscriptionLogic.CreateSubscription(dto);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [HttpGet("list")]
    public IActionResult GetList()
    {
        var response = _subscriptionLogic.GetSubscriptionsList();
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = _subscriptionLogic.GetSubscriptionById(id);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [HttpPost("{id}/cancel")]
    public IActionResult Cancel(int id)
    {
        var response = _subscriptionLogic.CancelSubscription(id);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Message);
    }
}

