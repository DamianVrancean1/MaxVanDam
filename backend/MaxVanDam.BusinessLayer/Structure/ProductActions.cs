using MaxVanDam.DataAccessLayer.Context;
using MaxVanDam.Domain.Entities.Product;
using MaxVanDam.Domain.Models.Product;
using MaxVanDam.Domain.Models.Service;

namespace MaxVanDam.BusinessLayer.Structure;

public class ProductActions
{
    protected ServiceResponse GetProductListAction()
    {
        try
        {
            using var db = new MasterDbContext();
            var products = db.Products
                .Select(p => MapToDto(p))
                .ToList();
            return new ServiceResponse { IsSuccess = true, Data = products };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse GetProductByIdAction(int id)
    {
        try
        {
            using var db = new MasterDbContext();
            var product = db.Products.Find(id);
            if (product is null)
                return new ServiceResponse { IsSuccess = false, Message = $"Produsul cu id {id} nu a fost găsit." };
            return new ServiceResponse { IsSuccess = true, Data = MapToDto(product) };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse CreateProductAction(ProductCreateDto dto)
    {
        try
        {
            using var db = new MasterDbContext();
            var product = new ProductEntity
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
            db.Products.Add(product);
            db.SaveChanges();
            return new ServiceResponse { IsSuccess = true, Data = MapToDto(product) };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse UpdateProductAction(int id, ProductUpdateDto dto)
    {
        try
        {
            using var db = new MasterDbContext();
            var product = db.Products.Find(id);
            if (product is null)
                return new ServiceResponse { IsSuccess = false, Message = $"Produsul cu id {id} nu a fost găsit." };

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

            db.SaveChanges();
            return new ServiceResponse { IsSuccess = true, Data = MapToDto(product) };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse DeleteProductAction(int id)
    {
        try
        {
            using var db = new MasterDbContext();
            var product = db.Products.Find(id);
            if (product is null)
                return new ServiceResponse { IsSuccess = false, Message = $"Produsul cu id {id} nu a fost găsit." };

            db.Products.Remove(product);
            db.SaveChanges();
            return new ServiceResponse { IsSuccess = true, Message = "Produs șters cu succes." };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    private static ProductInfoDto MapToDto(ProductEntity p) => new()
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
