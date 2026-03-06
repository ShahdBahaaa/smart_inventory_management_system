using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartInventoryManagementSystem.Domain.Enums;

namespace SmartInventoryManagementSystem.Domain.Entities
{
    public class ProductBatch
    {
        public int BatchID { get; set; }
        public int ProductID { get; set; }
        public string LotNumber { get; set; } = string.Empty;
        public DateTime ExpiryDate { get; set; }
        public int Quantity { get; set; }
        public DateTime ReceivedDate { get; set; }
        public BatchStatus Status { get; set; } = BatchStatus.ACTIVE;

        // Navigation Property
        public Product Product { get; set; } = null!;
    }
}
