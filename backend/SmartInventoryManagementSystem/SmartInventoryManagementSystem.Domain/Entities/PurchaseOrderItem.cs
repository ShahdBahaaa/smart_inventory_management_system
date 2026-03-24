using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartInventoryManagementSystem.Domain.Enums;

namespace SmartInventoryManagementSystem.Domain.Entities
{
    public class PurchaseOrderItem
    {
        public int ItemID { get; set; }
        public int POID { get; set; }
        public int ProductID { get; set; }
        public int QuantityOrdered { get; set; }
        public int ReceivedQuantity { get; set; }
        public decimal UnitPrice { get; set; }
        public POItemStatus Status { get; set; } = POItemStatus.PENDING;

        // Navigation Properties
        public PurchaseOrder PurchaseOrder { get; set; } = null!;
        public Product Product { get; set; } = null!;
    }
}
