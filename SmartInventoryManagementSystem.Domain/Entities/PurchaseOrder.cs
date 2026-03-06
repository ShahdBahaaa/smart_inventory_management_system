using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartInventoryManagementSystem.Domain.Enums;

namespace SmartInventoryManagementSystem.Domain.Entities
{
    public class PurchaseOrder
    {
        public int POID { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public DateTime ExpectedDeliveryDate { get; set; }
        public DateTime? ActualDeliveryDate { get; set; }
        public int SupplierID { get; set; }
        public POStatus Status { get; set; } = POStatus.DRAFT;
        public int CreatedBy { get; set; }
        public int? ApprovedBy { get; set; }

        // Navigation Properties
        public Supplier Supplier { get; set; } = null!;
        public User CreatedByUser { get; set; } = null!;
        public User? ApprovedByUser { get; set; }
        public ICollection<PurchaseOrderItem> Items { get; set; } = new List<PurchaseOrderItem>();
    }
}