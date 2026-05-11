using MaxVanDam.BusinessLayer;
using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.Domain.Models.Subscription;
using Microsoft.AspNetCore.Authorization;
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

    [Authorize(Policy = "AdminOnly")]
    [HttpGet("list")]
    public IActionResult GetList()
    {
        var response = _subscriptionLogic.GetSubscriptionsList();
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = _subscriptionLogic.GetSubscriptionById(id);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPost("{id}/cancel")]
    public IActionResult Cancel(int id)
    {
        var response = _subscriptionLogic.CancelSubscription(id);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Message);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpGet("stats")]
    public IActionResult GetStats()
    {
        try
        {
            using var db = new MaxVanDam.DataAccessLayer.Context.SubscriptionDbContext();
            var totalSubscriptions = db.Subscriptions.Count();
            var activeSubscriptions = db.Subscriptions.Count(s => s.Status == "active");
            var cancelledSubscriptions = db.Subscriptions.Count(s => s.Status == "cancelled");
            var totalRevenue = db.Subscriptions.Sum(s => s.Amount);

            var stats = new
            {
                TotalSubscriptions = totalSubscriptions,
                ActiveSubscriptions = activeSubscriptions,
                CancelledSubscriptions = cancelledSubscriptions,
                TotalRevenue = totalRevenue,
                AverageRevenue = totalSubscriptions > 0 ? totalRevenue / totalSubscriptions : 0
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            return BadRequest($"Eroare la obținerea statisticilor: {ex.Message}");
        }
    }
}
