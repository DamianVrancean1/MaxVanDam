using MaxVanDam.Domain.Entities.InventoryNotification;
using Microsoft.EntityFrameworkCore;

namespace MaxVanDam.DataAccessLayer.Context;

public sealed class NotificationsDbContext : DbContext
{
    public DbSet<InventoryNotificationEntity> InventoryNotifications => Set<InventoryNotificationEntity>();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql(DbSession.ConnectionString);

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<InventoryNotificationEntity>(entity =>
        {
            entity.HasKey(n => n.Id);
            entity.Property(n => n.ProductName).IsRequired().HasMaxLength(200);
            entity.Property(n => n.Message).IsRequired().HasMaxLength(500);
            entity.Ignore(n => n.Product);
        });
    }
}
