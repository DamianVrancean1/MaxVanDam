using MaxVanDam.BusinessLayer;
using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.Domain.Models.Product;
using Microsoft.AspNetCore.Mvc;
namespace MaxVanDam.API.Controllers;

[ApiController]
[Route("api/products")]
public class ProductController : ControllerBase
{
    private readonly IProductLogic _productLogic;

    public ProductController()
    {
        var bl = new BusinessLogic();
        _productLogic = bl.GetProductLogic();
    }

    [HttpGet("list")]
    public IActionResult GetList()
    {
        var response = _productLogic.GetProductList();
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [HttpGet("search")]
    public IActionResult Search(
        [FromQuery] string?  search          = null,
        [FromQuery] string?  category        = null,
        [FromQuery] decimal? minPrice        = null,
        [FromQuery] decimal? maxPrice        = null,
        [FromQuery] string?  brands          = null,
        [FromQuery] bool     inStockOnly     = false,
        [FromQuery] string?  compatibleBrand = null,
        [FromQuery] string?  compatibleModel = null)
    {
        if (minPrice.HasValue && minPrice.Value < 0)
            return BadRequest(new { message = "minPrice nu poate fi negativ." });

        if (maxPrice.HasValue && maxPrice.Value < 0)
            return BadRequest(new { message = "maxPrice nu poate fi negativ." });

        if (minPrice.HasValue && maxPrice.HasValue && minPrice.Value > maxPrice.Value)
            return BadRequest(new { message = "minPrice nu poate fi mai mare decât maxPrice." });

        var query = new ProductQueryDto
        {
            Search          = search,
            Category        = category,
            MinPrice        = minPrice,
            MaxPrice        = maxPrice,
            Brands          = brands,
            InStockOnly     = inStockOnly,
            CompatibleBrand = compatibleBrand,
            CompatibleModel = compatibleModel,
        };

        var response = _productLogic.GetFilteredProductList(query);
        if (!response.IsSuccess) return BadRequest(new { message = response.Message });
        return Ok(response.Data);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = _productLogic.GetProductById(id);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [HttpPost("create")]
    public IActionResult Create([FromBody] ProductCreateDto dto)
    {
        var response = _productLogic.CreateProduct(dto);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] ProductUpdateDto dto)
    {
        var response = _productLogic.UpdateProduct(id, dto);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Data);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = _productLogic.DeleteProduct(id);
        if (!response.IsSuccess) return BadRequest(response.Message);
        return Ok(response.Message);
    }
}
