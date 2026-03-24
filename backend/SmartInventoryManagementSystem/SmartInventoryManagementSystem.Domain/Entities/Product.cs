using SmartInventoryManagementSystem.Domain.Enums;

namespace SmartInventoryManagementSystem.Domain.Entities
{
    public class Product
    {
        public int ProductID { get; set; }
        public string SKU { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public ProductUnit Unit { get; set; }
        public decimal CostPrice { get; set; }
        public decimal SellingPrice { get; set; }
        public int ReorderPoint { get; set; }
        public int SafetyStock { get; set; }
        public int LeadTime { get; set; }
        public int CurrentStock { get; set; } = 0; 
        public int SupplierID { get; set; }
        public bool ExpiryTracking { get; set; }
        public string WarehouseLocation { get; set; } = string.Empty;
        public ABCCategory? AbcCategory { get; set; }
        public ProductStatus Status { get; set; } = ProductStatus.ACTIVE;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public int CreatedBy { get; set; }

        // Navigation Properties
        public Supplier Supplier { get; set; } = null!;
        public ICollection<ProductBatch> Batches { get; set; } = new List<ProductBatch>();
        public ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
    }
}
