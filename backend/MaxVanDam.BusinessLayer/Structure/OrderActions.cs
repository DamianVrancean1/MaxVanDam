using MaxVanDam.DataAccessLayer.Context;
using MaxVanDam.Domain.Entities.Order;
using MaxVanDam.Domain.Models.Order;
using MaxVanDam.Domain.Models.Service;

namespace MaxVanDam.BusinessLayer.Structure;

public class OrderActions
{
    protected ServiceResponse GetOrderListAction()
    {
        try
        {
            using var db = new MasterDbContext();
            var orders = db.Orders
                .OrderByDescending(o => o.UpdatedAt)
                .Select(o => MapToDto(o))
                .ToList();
            return new ServiceResponse { IsSuccess = true, Data = orders };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse GetMyOrdersAction(int userId, OrderQueryDto query)
    {
        try
        {
            using var db = new MasterDbContext();

            var q = db.Orders.Where(o => o.UserId == userId);

            if (!string.IsNullOrWhiteSpace(query.Status))
                q = q.Where(o => o.Status == query.Status);

            if (query.StartDate.HasValue)
                q = q.Where(o => o.CreatedAt >= query.StartDate.Value);

            if (query.EndDate.HasValue)
                // include the full end day
                q = q.Where(o => o.CreatedAt < query.EndDate.Value.Date.AddDays(1));

            var orders = q
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => MapToDto(o))
                .ToList();

            return new ServiceResponse { IsSuccess = true, Data = orders };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse GetOrderByIdAction(int id)
    {
        try
        {
            using var db = new MasterDbContext();
            var order = db.Orders.Find(id);
            if (order is null)
                return new ServiceResponse { IsSuccess = false, Message = $"Comanda cu id {id} nu a fost găsită." };
            return new ServiceResponse { IsSuccess = true, Data = MapToDto(order) };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse CreateOrderAction(OrderCreateDto dto, int? createdByUserId)
    {
        try
        {
            using var db = new MasterDbContext();
            var order = new OrderEntity
            {
                UserId            = createdByUserId,
                SupplierName      = dto.SupplierName,
                ItemsJson         = dto.ItemsJson,
                ItemsCount        = dto.ItemsCount,
                TotalValue        = dto.TotalValue,
                Status            = dto.Status,
                Priority          = dto.Priority,
                Category          = dto.Category,
                EstimatedDelivery = dto.EstimatedDelivery,
                CreatedAt         = DateTime.UtcNow,
                UpdatedAt         = DateTime.UtcNow,
            };
            db.Orders.Add(order);
            db.SaveChanges();
            return new ServiceResponse { IsSuccess = true, Data = MapToDto(order) };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse UpdateOrderAction(int id, OrderUpdateDto dto)
    {
        try
        {
            using var db = new MasterDbContext();
            var order = db.Orders.Find(id);
            if (order is null)
                return new ServiceResponse { IsSuccess = false, Message = $"Comanda cu id {id} nu a fost găsită." };

            if (dto.Status       is not null) order.Status            = dto.Status;
            if (dto.Priority     is not null) order.Priority          = dto.Priority;
            if (dto.SupplierName is not null) order.SupplierName      = dto.SupplierName;
            if (dto.Category     is not null) order.Category          = dto.Category;
            if (dto.TotalValue   is not null) order.TotalValue        = dto.TotalValue.Value;
            if (dto.ItemsCount   is not null) order.ItemsCount        = dto.ItemsCount.Value;
            if (dto.EstimatedDelivery is not null) order.EstimatedDelivery = dto.EstimatedDelivery;

            order.UpdatedAt = DateTime.UtcNow;
            db.SaveChanges();
            return new ServiceResponse { IsSuccess = true, Data = MapToDto(order) };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    protected ServiceResponse DeleteOrderAction(int id)
    {
        try
        {
            using var db = new MasterDbContext();
            var order = db.Orders.Find(id);
            if (order is null)
                return new ServiceResponse { IsSuccess = false, Message = $"Comanda cu id {id} nu a fost găsită." };

            db.Orders.Remove(order);
            db.SaveChanges();
            return new ServiceResponse { IsSuccess = true, Message = "Comandă ștearsă cu succes." };
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }
    }

    private static OrderInfoDto MapToDto(OrderEntity o) => new()
    {
        Id                = o.Id,
        SupplierName      = o.SupplierName,
        ItemsJson         = o.ItemsJson,
        ItemsCount        = o.ItemsCount,
        TotalValue        = o.TotalValue,
        Status            = o.Status,
        Priority          = o.Priority,
        Category          = o.Category,
        EstimatedDelivery = o.EstimatedDelivery,
        CreatedAt         = o.CreatedAt,
        UpdatedAt         = o.UpdatedAt,
    };
}
