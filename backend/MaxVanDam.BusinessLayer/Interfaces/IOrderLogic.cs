using MaxVanDam.Domain.Models.Order;
using MaxVanDam.Domain.Models.Service;

namespace MaxVanDam.BusinessLayer.Interfaces;

public interface IOrderLogic
{
    ServiceResponse GetOrderList();
    ServiceResponse GetOrderById(int id);
    ServiceResponse CreateOrder(OrderCreateDto dto);
    ServiceResponse UpdateOrder(int id, OrderUpdateDto dto);
    ServiceResponse DeleteOrder(int id);
}
