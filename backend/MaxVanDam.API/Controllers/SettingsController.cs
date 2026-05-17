using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MaxVanDam.API.Controllers;

[ApiController]
[Route("api/settings")]
[Authorize(Roles = "admin")]
public class SettingsController : ControllerBase
{
    // In-memory store — resets on API restart (no DB table needed for MVP)
    private static readonly Dictionary<string, object> _settings = new()
    {
        ["companyName"]            = "MaxVanDam SRL",
        ["warehouseAddress"]       = "str. Industrială 14, Chișinău",
        ["contactEmail"]           = "contact@maxvandam.md",
        ["criticalStockThreshold"] = 5,
        ["lowStockThreshold"]      = 10,
        ["currency"]               = "MDL",
    };

    [HttpGet]
    public IActionResult Get() => Ok(_settings);

    [HttpPatch]
    public IActionResult Patch([FromBody] Dictionary<string, object> updates)
    {
        foreach (var kv in updates)
        {
            if (_settings.ContainsKey(kv.Key))
                _settings[kv.Key] = kv.Value;
        }
        return Ok(_settings);
    }
}
