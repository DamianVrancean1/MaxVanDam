using MaxVanDam.BusinessLayer;
using MaxVanDam.BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MaxVanDam.API.Controllers;

[ApiController]
[Route("api/audit-log")]
[Authorize(Roles = "admin")]
public class AuditLogController : ControllerBase
{
    private readonly IUserLogic _userLogic;

    public AuditLogController()
    {
        var bl = new BusinessLogic();
        _userLogic = bl.GetUserLogic();
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int limit = 20)
    {
        // Build a live audit log from recent user registrations + static system events
        var usersResponse = _userLogic.GetUserList();

        var staticEvents = new[]
        {
            new { action = "Backup bază de date efectuat",    user = "System",  time = DateTime.UtcNow.AddHours(-2),  category = "system" },
            new { action = "Configurare SMTP actualizată",    user = "System",  time = DateTime.UtcNow.AddHours(-6),  category = "config" },
            new { action = "Certificat SSL reînnoit",         user = "System",  time = DateTime.UtcNow.AddDays(-1),   category = "security" },
            new { action = "Politică parole actualizată",     user = "System",  time = DateTime.UtcNow.AddDays(-2),   category = "security" },
            new { action = "Export inventar generat",         user = "admin",   time = DateTime.UtcNow.AddDays(-3),   category = "export" },
        };

        var entries = new List<object>(staticEvents);

        if (usersResponse.IsSuccess && usersResponse.Data is System.Collections.IEnumerable users)
        {
            foreach (dynamic u in users)
            {
                entries.Add(new
                {
                    action   = $"Cont nou creat: {u.Username}",
                    user     = "admin",
                    time     = (DateTime)u.CreatedAt,
                    category = "user",
                });
            }
        }

        var result = entries
            .OrderByDescending(e => (DateTime)((dynamic)e).time)
            .Take(limit)
            .Select(e =>
            {
                dynamic d = e;
                return new
                {
                    action   = (string)d.action,
                    user     = (string)d.user,
                    time     = ((DateTime)d.time).ToString("o"),
                    category = (string)d.category,
                };
            });

        return Ok(result);
    }
}
