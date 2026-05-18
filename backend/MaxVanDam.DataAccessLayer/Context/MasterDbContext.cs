using MaxVanDam.Domain.Entities.InventoryNotification;
using MaxVanDam.Domain.Entities.Order;
using MaxVanDam.Domain.Entities.Product;
using MaxVanDam.Domain.Entities.User;
using Microsoft.EntityFrameworkCore;

namespace MaxVanDam.DataAccessLayer.Context;

public sealed class MasterDbContext : DbContext
{
    public DbSet<ProductEntity> Products => Set<ProductEntity>();
    public DbSet<UserEntity> Users => Set<UserEntity>();
    public DbSet<InventoryNotificationEntity> InventoryNotifications => Set<InventoryNotificationEntity>();
    public DbSet<OrderEntity> Orders => Set<OrderEntity>();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql(DbSession.ConnectionString);

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ProductEntity>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
            entity.Property(p => p.Brand).IsRequired().HasMaxLength(100);
            entity.Property(p => p.Model).IsRequired().HasMaxLength(100);
            entity.Property(p => p.Category).IsRequired().HasMaxLength(100);
            entity.Property(p => p.Price).HasColumnType("decimal(10,2)");
            entity.Property(p => p.Description).HasMaxLength(2000);
            entity.Property(p => p.ShortDescription).HasMaxLength(500);
            entity.Property(p => p.ImageUrl).HasMaxLength(500);
            entity.Property(p => p.Compatibility).HasColumnType("text[]");
        });

        modelBuilder.Entity<UserEntity>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Username).IsUnique();
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Username).IsRequired().HasMaxLength(100);
            entity.Property(u => u.PasswordHash).IsRequired();
            entity.Property(u => u.Role).IsRequired().HasMaxLength(50);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(200);
        });

        modelBuilder.Entity<InventoryNotificationEntity>(entity =>
        {
            entity.HasKey(n => n.Id);
            entity.Property(n => n.ProductName).IsRequired().HasMaxLength(200);
            entity.Property(n => n.Message).IsRequired().HasMaxLength(500);
            entity.HasOne(n => n.Product)
                  .WithMany(p => p.InventoryNotifications)
                  .HasForeignKey(n => n.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<OrderEntity>(entity =>
        {
            entity.HasKey(o => o.Id);
            entity.Property(o => o.UserId);
            entity.Property(o => o.SupplierName).IsRequired().HasMaxLength(200);
            entity.Property(o => o.Status).IsRequired().HasMaxLength(50);
            entity.Property(o => o.Priority).IsRequired().HasMaxLength(50);
            entity.Property(o => o.Category).HasMaxLength(100);
            entity.Property(o => o.TotalValue).HasColumnType("decimal(12,2)");
            entity.Property(o => o.ItemsJson).HasColumnType("text");
        });
    }
}
