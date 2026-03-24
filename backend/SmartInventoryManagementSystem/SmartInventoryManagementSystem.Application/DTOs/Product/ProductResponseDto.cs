namespace SmartInventoryManagementSystem.Application.DTOs.Product
{
    public class ProductResponseDto
    {
        public int ProductID { get; set; }
        public string SKU { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public decimal CostPrice { get; set; }
        public decimal SellingPrice { get; set; }
        public int CurrentStock { get; set; }
        public int ReorderPoint { get; set; }
        public int SafetyStock { get; set; }
        public int LeadTime { get; set; }
        public int SupplierID { get; set; }
        public string SupplierName { get; set; } = string.Empty;
        public bool ExpiryTracking { get; set; }
        public string WarehouseLocation { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? AbcCategory { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}