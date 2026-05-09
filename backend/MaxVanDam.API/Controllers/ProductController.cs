using MaxVanDam.BusinessLayer;
using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.Domain.Models.Product;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MaxVanDam.API.Controllers;

[ApiController]
[Route("api/products")]
public class ProductController : ControllerBase
{
    private readonly IProductLogic _productLogic;

    public ProductController(ILoggerFactory loggerFactory)
    {
        var bl = new BusinessLogic(loggerFactory);
        _productLogic = bl.GetProductLogic();
    }

    [HttpGet("list")]
    public IActionResult GetList()
    {
        var response = _productLogic.GetProductList();
        if (!response.IsSuccess) return BadRequest(response.Message);
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
