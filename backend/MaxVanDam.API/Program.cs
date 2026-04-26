using MaxVanDam.BusinessLayer.Extensions;
using MaxVanDam.DataAccess.Context;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// CORS — permite request-uri din frontend React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://localhost:5176",
                "http://localhost:5177"
              )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Entity Framework Core + PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Business Layer services (IProductService, IUserService, IInventoryNotificationService)
builder.Services.AddBusinessLayerServices();

builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "MaxVanDam API",
        Version = "v1",
        Description = "API pentru aplicatia de piese auto MaxVanDam"
    });
});

var app = builder.Build();

// Swagger UI disponibil in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "MaxVanDam API v1"));
}

app.UseCors("AllowFrontend");
app.UseStaticFiles();
app.UseAuthorization();
app.MapControllers();

app.Run();
