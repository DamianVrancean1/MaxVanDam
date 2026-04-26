using MaxVanDam.BusinessLayer.DTOs.Product;
using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.DataAccessLayer.Context;
using MaxVanDam.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MaxVanDam.BusinessLayer.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _context;

    public ProductService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ProductResponseDto>> GetAllAsync()
    {
        return await _context.Products
            .Select(p => MapToDto(p))
            .ToListAsync();
    }

    public async Task<ProductResponseDto?> GetByIdAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        return product is null ? null : MapToDto(product);
    }

    public async Task<ProductResponseDto> CreateAsync(SaveProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            Brand = dto.Brand,
            Model = dto.Model,
            Category = dto.Category,
            Price = dto.Price,
            Stock = dto.Stock,
            Description = dto.Description,
            ShortDescription = dto.ShortDescription,
            ImageUrl = dto.ImageUrl,
            WarehouseLocation = dto.WarehouseLocation,
            Compatibility = dto.Compatibility
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return MapToDto(product);
    }

    public async Task<ProductResponseDto?> UpdateAsync(int id, SaveProductDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product is null) return null;

        product.Name = dto.Name;
        product.Brand = dto.Brand;
        product.Model = dto.Model;
        product.Category = dto.Category;
        product.Price = dto.Price;
        product.Stock = dto.Stock;
        product.Description = dto.Description;
        product.ShortDescription = dto.ShortDescription;
        product.ImageUrl = dto.ImageUrl;
        product.WarehouseLocation = dto.WarehouseLocation;
        product.Compatibility = dto.Compatibility;

        await _context.SaveChangesAsync();
        return MapToDto(product);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product is null) return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return true;
    }

    private static ProductResponseDto MapToDto(Product p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Brand = p.Brand,
        Model = p.Model,
        Category = p.Category,
        Price = p.Price,
        Stock = p.Stock,
        Description = p.Description,
        ShortDescription = p.ShortDescription,
        ImageUrl = p.ImageUrl,
        WarehouseLocation = p.WarehouseLocation,
        Compatibility = p.Compatibility
    };
}
