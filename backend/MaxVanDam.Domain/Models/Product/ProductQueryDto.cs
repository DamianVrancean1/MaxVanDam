namespace MaxVanDam.Domain.Models.Product;

public class ProductQueryDto
{
    public string? Search          { get; set; }
    public string? Category        { get; set; }
    public decimal? MinPrice       { get; set; }
    public decimal? MaxPrice       { get; set; }

    /// <summary>Comma-separated list of brands, e.g. "BMW,Audi"</summary>
    public string? Brands          { get; set; }

    public bool InStockOnly        { get; set; }
    public string? CompatibleBrand { get; set; }
    public string? CompatibleModel { get; set; }
}
