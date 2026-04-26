using MaxVanDam.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MaxVanDam.DataAccessLayer.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<User> Users => Set<User>();
    public DbSet<InventoryNotification> InventoryNotifications => Set<InventoryNotification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>(entity =>
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
            entity.Property(p => p.Compatibility)
                  .HasColumnType("text[]");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Username).IsUnique();
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Username).IsRequired().HasMaxLength(100);
            entity.Property(u => u.PasswordHash).IsRequired();
            entity.Property(u => u.Role).IsRequired().HasMaxLength(50);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(200);
        });

        modelBuilder.Entity<InventoryNotification>(entity =>
        {
            entity.HasKey(n => n.Id);
            entity.Property(n => n.ProductName).IsRequired().HasMaxLength(200);
            entity.Property(n => n.Message).IsRequired().HasMaxLength(500);
            entity.HasOne(n => n.Product)
                  .WithMany(p => p.InventoryNotifications)
                  .HasForeignKey(n => n.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
