using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartInventoryManagementSystem.Domain.Enums;

namespace SmartInventoryManagementSystem.Domain.Entities
{
    public class Supplier
    {
        public int SupplierID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public int LeadTime { get; set; }
        public decimal OnTimeDeliveryRate { get; set; }
        public decimal QualityScore { get; set; }
        public decimal FulfillmentRate { get; set; }
        public SupplierClassification Classification { get; set; } = SupplierClassification.ACCEPTABLE;
        public bool IsActive { get; set; } = true;
        public DateTime? LastEvaluatedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property
        public ICollection<PurchaseOrder> PurchaseOrders { get; set; } = new List<PurchaseOrder>();
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}