using MaxVanDam.BusinessLayer.Interfaces;
using MaxVanDam.BusinessLayer.Services;
using Microsoft.Extensions.DependencyInjection;

namespace MaxVanDam.BusinessLayer.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddBusinessLayerServices(this IServiceCollection services)
    {
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IInventoryNotificationService, InventoryNotificationService>();
        return services;
    }
}
