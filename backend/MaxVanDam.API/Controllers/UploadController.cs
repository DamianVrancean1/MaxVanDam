using Microsoft.AspNetCore.Mvc;

namespace MaxVanDam.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp"
    };
    private const long MaxFileSizeBytes = 2 * 1024 * 1024; // 2MB

    public UploadController(IWebHostEnvironment env)
    {
        _env = env;
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Upload([FromForm] IFormFile file)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { message = "Niciun fișier selectat." });

        if (file.Length > MaxFileSizeBytes)
            return BadRequest(new { message = "Fișierul depășește limita de 2MB." });

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
            return BadRequest(new { message = "Format invalid. Acceptat: jpg, png, webp." });

        var uploadsPath = Path.Combine(_env.WebRootPath, "uploads");
        Directory.CreateDirectory(uploadsPath);

        var uniqueFileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsPath, uniqueFileName);

        await using var stream = System.IO.File.Create(filePath);
        await file.CopyToAsync(stream);

        var url = $"/uploads/{uniqueFileName}";
        return Ok(new { url });
    }

    [HttpDelete]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult Delete([FromQuery] string url)
    {
        if (string.IsNullOrWhiteSpace(url) || !url.StartsWith("/uploads/"))
            return BadRequest(new { message = "URL invalid." });

        var fileName = Path.GetFileName(url);
        var filePath = Path.Combine(_env.WebRootPath, "uploads", fileName);

        if (System.IO.File.Exists(filePath))
            System.IO.File.Delete(filePath);

        return NoContent();
    }
}
