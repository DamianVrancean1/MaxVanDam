using MaxVanDam.Domain.Entities.Order;
using Microsoft.EntityFrameworkCore;

namespace MaxVanDam.DataAccessLayer.Context;

public sealed class OrdersDbContext : DbContext
{
    public DbSet<OrderEntity> Orders => Set<OrderEntity>();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql(DbSession.ConnectionString);

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<OrderEntity>(entity =>
        {
            entity.HasKey(o => o.Id);
            entity.Property(o => o.SupplierName).IsRequired().HasMaxLength(200);
            entity.Property(o => o.Status).IsRequired().HasMaxLength(50);
            entity.Property(o => o.Priority).IsRequired().HasMaxLength(50);
            entity.Property(o => o.Category).HasMaxLength(100);
            entity.Property(o => o.TotalValue).HasColumnType("decimal(12,2)");
            entity.Property(o => o.ItemsJson).HasColumnType("text");
        });
    }
}
