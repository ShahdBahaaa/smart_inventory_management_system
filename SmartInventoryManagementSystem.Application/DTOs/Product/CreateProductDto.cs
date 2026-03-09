using SmartInventoryManagementSystem.Domain.Enums;

namespace SmartInventoryManagementSystem.Application.DTOs.Product
{
    public class CreateProductDto
    {
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
        public int SupplierID { get; set; }
        public bool ExpiryTracking { get; set; }
        public string WarehouseLocation { get; set; } = string.Empty;
    }
}