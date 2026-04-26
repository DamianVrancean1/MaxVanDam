using MaxVanDam.BusinessLayer.DTOs.Product;

namespace MaxVanDam.BusinessLayer.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductResponseDto>> GetAllAsync();
    Task<ProductResponseDto?> GetByIdAsync(int id);
    Task<ProductResponseDto> CreateAsync(SaveProductDto dto);
    Task<ProductResponseDto?> UpdateAsync(int id, SaveProductDto dto);
    Task<bool> DeleteAsync(int id);
}
