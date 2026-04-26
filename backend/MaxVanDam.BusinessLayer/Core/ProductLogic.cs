using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.BusinessLayer.Structure;
using MaxVanDam.Domain.Models.Product;
using MaxVanDam.Domain.Models.Service;

namespace MaxVanDam.BusinessLayer.Core;

public class ProductLogic : ProductActions, IProductLogic
{
    public ServiceResponse GetProductList() => GetProductListAction();
    public ServiceResponse GetProductById(int id) => GetProductByIdAction(id);
    public ServiceResponse CreateProduct(ProductCreateDto dto) => CreateProductAction(dto);
    public ServiceResponse UpdateProduct(int id, ProductUpdateDto dto) => UpdateProductAction(id, dto);
    public ServiceResponse DeleteProduct(int id) => DeleteProductAction(id);
}
