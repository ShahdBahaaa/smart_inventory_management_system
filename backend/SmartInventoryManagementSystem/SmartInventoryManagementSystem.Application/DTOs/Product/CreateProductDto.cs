using SmartInventoryManagementSystem.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace SmartInventoryManagementSystem.Application.DTOs.Product
{
    public class CreateProductDto
    {
        [Required(ErrorMessage = "SKU is required")]
        [StringLength(50, ErrorMessage = "SKU must not exceed 50 characters")]
        public string SKU { get; set; } = string.Empty;

        [Required(ErrorMessage = "Name is required")]
        [StringLength(200, ErrorMessage = "Name must not exceed 200 characters")]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Category is required")]
        [StringLength(100)]
        public string Category { get; set; } = string.Empty;

        [StringLength(100)]
        public string Brand { get; set; } = string.Empty;

        public ProductUnit Unit { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Cost price must be greater than 0")]
        public decimal CostPrice { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Selling price must be greater than 0")]
        public decimal SellingPrice { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Reorder point must be 0 or more")]
        public int ReorderPoint { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Safety stock must be 0 or more")]
        public int SafetyStock { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Lead time must be at least 1 day")]
        public int LeadTime { get; set; }

        [Required(ErrorMessage = "Supplier is required")]
        public int SupplierID { get; set; }

        public bool ExpiryTracking { get; set; }

        [StringLength(200)]
        public string WarehouseLocation { get; set; } = string.Empty;
    }
}