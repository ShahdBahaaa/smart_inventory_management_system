using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartInventoryManagementSystem.Domain.Enums;

namespace SmartInventoryManagementSystem.Domain.Entities
{
    public class StockMovement
    {
        public int MovementID { get; set; }
        public int ProductID { get; set; }
        public MovementType MovementType { get; set; }
        public int Quantity { get; set; }
        public int PreviousQuantity { get; set; }
        public int NewQuantity { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public int UserID { get; set; }
        public string Remarks { get; set; } = string.Empty;

        // Navigation Properties
        public Product Product { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}