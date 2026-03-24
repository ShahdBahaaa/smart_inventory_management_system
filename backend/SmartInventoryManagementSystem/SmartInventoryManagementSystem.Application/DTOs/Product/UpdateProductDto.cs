using SmartInventoryManagementSystem.Domain.Enums;

namespace SmartInventoryManagementSystem.Application.DTOs.Product
{
    public class UpdateProductDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Category { get; set; }
        public string? Brand { get; set; }
        public decimal? CostPrice { get; set; }
        public decimal? SellingPrice { get; set; }
        public int? ReorderPoint { get; set; }
        public int? SafetyStock { get; set; }
        public int? LeadTime { get; set; }
        public int? SupplierID { get; set; }
        public bool? ExpiryTracking { get; set; }
        public string? WarehouseLocation { get; set; }
        public ProductStatus? Status { get; set; }
    }
}