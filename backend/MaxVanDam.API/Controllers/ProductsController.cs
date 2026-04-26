using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.Domain.Models.Product;
using Microsoft.AspNetCore.Mvc;

namespace MaxVanDam.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductInfoDto>>> GetAll()
    {
        var products = await _productService.GetAllAsync();
        return Ok(products);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductInfoDto>> GetById(int id)
    {
        var product = await _productService.GetByIdAsync(id);
        if (product is null)
            return NotFound(new { message = $"Produsul cu id {id} nu a fost găsit." });

        return Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<ProductInfoDto>> Create([FromBody] ProductCreateDto dto)
    {
        var product = await _productService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProductInfoDto>> Update(int id, [FromBody] ProductUpdateDto dto)
    {
        var product = await _productService.UpdateAsync(id, dto);
        if (product is null)
            return NotFound(new { message = $"Produsul cu id {id} nu a fost găsit." });

        return Ok(product);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _productService.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { message = $"Produsul cu id {id} nu a fost găsit." });

        return NoContent();
    }
}
