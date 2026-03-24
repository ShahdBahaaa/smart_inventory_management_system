using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace SmartInventoryManagementSystem.Domain.Entities
{
    public class Alert
    {
        public int AlertID { get; set; }
        public string Type { get; set; } = string.Empty; // LOW_STOCK / EXPIRY / OVERSTOCK
        public string Severity { get; set; } = string.Empty; // HIGH / MEDIUM / LOW
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? ProductID { get; set; }
        public int? SupplierID { get; set; }
        public int? POID { get; set; }

        // Navigation Properties
        public Product? Product { get; set; }
        public Supplier? Supplier { get; set; }
        public PurchaseOrder? PurchaseOrder { get; set; }
    }
}