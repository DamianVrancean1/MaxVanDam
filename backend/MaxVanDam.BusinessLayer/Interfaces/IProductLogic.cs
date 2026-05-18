using MaxVanDam.Domain.Models.Product;
using MaxVanDam.Domain.Models.Service;

namespace MaxVanDam.BusinessLayer.Interfaces;

public interface IProductLogic
{
    ServiceResponse GetProductList();
    ServiceResponse GetFilteredProductList(ProductQueryDto query);
    ServiceResponse GetProductById(int id);
    ServiceResponse CreateProduct(ProductCreateDto dto);
    ServiceResponse UpdateProduct(int id, ProductUpdateDto dto);
    ServiceResponse DeleteProduct(int id);
}
