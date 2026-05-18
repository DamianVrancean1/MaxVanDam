using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.BusinessLayer.Structure;
using MaxVanDam.Domain.Models.Order;
using MaxVanDam.Domain.Models.Service;

namespace MaxVanDam.BusinessLayer.Core;

public class OrderLogic : OrderActions, IOrderLogic
{
    public ServiceResponse GetOrderList()          => GetOrderListAction();
    public ServiceResponse GetMyOrders(int userId, OrderQueryDto query) => GetMyOrdersAction(userId, query);
    public ServiceResponse GetOrderById(int id)    => GetOrderByIdAction(id);
    public ServiceResponse CreateOrder(OrderCreateDto dto)         => CreateOrderAction(dto);
    public ServiceResponse UpdateOrder(int id, OrderUpdateDto dto) => UpdateOrderAction(id, dto);
    public ServiceResponse DeleteOrder(int id)     => DeleteOrderAction(id);
}
