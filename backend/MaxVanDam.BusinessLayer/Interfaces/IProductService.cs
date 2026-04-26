using MaxVanDam.Domain.Models.Product;

namespace MaxVanDam.BusinessLayer.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductInfoDto>> GetAllAsync();
    Task<ProductInfoDto?> GetByIdAsync(int id);
    Task<ProductInfoDto> CreateAsync(ProductCreateDto dto);
    Task<ProductInfoDto?> UpdateAsync(int id, ProductUpdateDto dto);
    Task<bool> DeleteAsync(int id);
}
