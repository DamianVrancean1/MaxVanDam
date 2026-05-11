using MaxVanDam.Domain.Entities.Subscription;
using Microsoft.EntityFrameworkCore;

namespace MaxVanDam.DataAccessLayer.Context;

public sealed class SubscriptionDbContext : DbContext
{
    public DbSet<SubscriptionEntity> Subscriptions => Set<SubscriptionEntity>();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql(DbSession.ConnectionString);

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<SubscriptionEntity>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.HasIndex(s => s.Email);
            entity.Property(s => s.PlanId).IsRequired().HasMaxLength(50);
            entity.Property(s => s.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(s => s.LastName).IsRequired().HasMaxLength(100);
            entity.Property(s => s.Email).IsRequired().HasMaxLength(200);
            entity.Property(s => s.PhoneNumber).IsRequired().HasMaxLength(20);
            entity.Property(s => s.CompanyName).IsRequired().HasMaxLength(255);
            entity.Property(s => s.CardNumber).IsRequired().HasMaxLength(4);
            entity.Property(s => s.CardHolderName).IsRequired().HasMaxLength(100);
            entity.Property(s => s.Status).IsRequired().HasMaxLength(50);
        });
    }
}

