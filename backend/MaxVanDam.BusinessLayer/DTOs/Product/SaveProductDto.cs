using System.ComponentModel.DataAnnotations;

namespace MaxVanDam.BusinessLayer.DTOs.Product;

public class SaveProductDto
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Brand { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Model { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Range(0.01, 999999.99)]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue)]
    public int Stock { get; set; }

    public string Description { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;

    [MaxLength(50)]
    public string WarehouseLocation { get; set; } = string.Empty;

    public List<string> Compatibility { get; set; } = new();
}
