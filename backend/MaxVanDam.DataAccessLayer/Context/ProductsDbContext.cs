using MaxVanDam.Domain.Entities.Product;
using Microsoft.EntityFrameworkCore;

namespace MaxVanDam.DataAccessLayer.Context;

public sealed class ProductsDbContext : DbContext
{
    public DbSet<ProductEntity> Products => Set<ProductEntity>();

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
            entity.Ignore(p => p.InventoryNotifications);
        });
    }
}
