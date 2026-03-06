using Microsoft.EntityFrameworkCore;
using SmartInventoryManagementSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace SmartInventoryManagementSystem.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductBatch> ProductBatches { get; set; }
        public DbSet<StockMovement> StockMovements { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
        public DbSet<PurchaseOrderItem> PurchaseOrderItems { get; set; }
        public DbSet<Alert> Alerts { get; set; }
        public DbSet<ForecastResult> ForecastResults { get; set; }
        public DbSet<EOQResult> EOQResults { get; set; }
        public DbSet<DiscountStrategy> DiscountStrategies { get; set; }
        public DbSet<DiscountRecommendation> DiscountRecommendations { get; set; }
        public DbSet<ActiveDiscount> ActiveDiscounts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Primary Keys
            modelBuilder.Entity<User>().HasKey(u => u.UserID);
            modelBuilder.Entity<Product>().HasKey(p => p.ProductID);
            modelBuilder.Entity<ProductBatch>().HasKey(pb => pb.BatchID);
            modelBuilder.Entity<StockMovement>().HasKey(sm => sm.MovementID);
            modelBuilder.Entity<Supplier>().HasKey(s => s.SupplierID);
            modelBuilder.Entity<PurchaseOrder>().HasKey(po => po.POID);
            modelBuilder.Entity<PurchaseOrderItem>().HasKey(poi => poi.ItemID);
            modelBuilder.Entity<Alert>().HasKey(a => a.AlertID);
            modelBuilder.Entity<ForecastResult>().HasKey(f => f.ForecastID);
            modelBuilder.Entity<EOQResult>().HasKey(e => e.EOQResultID);
            modelBuilder.Entity<DiscountStrategy>().HasKey(ds => ds.StrategyID);
            modelBuilder.Entity<DiscountRecommendation>().HasKey(dr => dr.RecommendationID);
            modelBuilder.Entity<ActiveDiscount>().HasKey(ad => ad.ActiveDiscountID);

            // Unique Indexes
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<Product>().HasIndex(p => p.SKU).IsUnique();

            // Product decimal
            modelBuilder.Entity<Product>()
                .Property(p => p.CostPrice).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Product>()
                .Property(p => p.SellingPrice).HasColumnType("decimal(18,2)");

            // Supplier decimal
            modelBuilder.Entity<Supplier>()
                .Property(s => s.OnTimeDeliveryRate).HasColumnType("decimal(5,2)");
            modelBuilder.Entity<Supplier>()
                .Property(s => s.QualityScore).HasColumnType("decimal(5,2)");
            modelBuilder.Entity<Supplier>()
                .Property(s => s.FulfillmentRate).HasColumnType("decimal(5,2)");

            // PurchaseOrderItem decimal
            modelBuilder.Entity<PurchaseOrderItem>()
                .Property(p => p.UnitPrice).HasColumnType("decimal(18,2)");

            // EOQResult decimal
            modelBuilder.Entity<EOQResult>()
                .Property(e => e.OptimalQuantity).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<EOQResult>()
                .Property(e => e.ReorderPoint).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<EOQResult>()
                .Property(e => e.SafetyStock).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<EOQResult>()
                .Property(e => e.AnnualSavings).HasColumnType("decimal(18,2)");

            // ForecastResult decimal
            modelBuilder.Entity<ForecastResult>()
                .Property(f => f.PredictedDemand).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<ForecastResult>()
                .Property(f => f.ConfidenceScore).HasColumnType("decimal(5,2)");

            // DiscountRecommendation decimal
            modelBuilder.Entity<DiscountRecommendation>()
                .Property(d => d.SuggestedDiscountPercent).HasColumnType("decimal(5,2)");
            modelBuilder.Entity<DiscountRecommendation>()
                .Property(d => d.ConfidenceScore).HasColumnType("decimal(5,2)");

            // DiscountStrategy decimal
            modelBuilder.Entity<DiscountStrategy>()
                .Property(d => d.MaxDiscountPercent).HasColumnType("decimal(5,2)");

            // ActiveDiscount decimal
            modelBuilder.Entity<ActiveDiscount>()
                .Property(a => a.DiscountPercent).HasColumnType("decimal(5,2)");

            // ActiveDiscount → Product
            modelBuilder.Entity<ActiveDiscount>()
                .HasOne(ad => ad.Product)
                .WithMany()
                .HasForeignKey(ad => ad.ProductID)
                .OnDelete(DeleteBehavior.Restrict);

            // ActiveDiscount → Recommendation
            modelBuilder.Entity<ActiveDiscount>()
                .HasOne(ad => ad.Recommendation)
                .WithMany()
                .HasForeignKey(ad => ad.RecommendationID)
                .OnDelete(DeleteBehavior.Restrict);

            // Relationships
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Supplier)
                .WithMany(s => s.Products)
                .HasForeignKey(p => p.SupplierID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<StockMovement>()
                .HasOne(sm => sm.User)
                .WithMany(u => u.StockMovements)
                .HasForeignKey(sm => sm.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PurchaseOrder>()
                .HasOne(po => po.CreatedByUser)
                .WithMany(u => u.PurchaseOrders)
                .HasForeignKey(po => po.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PurchaseOrder>()
                .HasOne(po => po.ApprovedByUser)
                .WithMany()
                .HasForeignKey(po => po.ApprovedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ActiveDiscount>()
                .HasOne(ad => ad.ApprovedByUser)
                .WithMany()
                .HasForeignKey(ad => ad.ApprovedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DiscountRecommendation>()
                .HasOne(dr => dr.ReviewedByUser)
                .WithMany()
                .HasForeignKey(dr => dr.ReviewedBy)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
