using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace SmartInventoryManagementSystem.Domain.Entities
{
    public class EOQResult
    {
        public int EOQResultID { get; set; }
        public int ProductID { get; set; }
        public decimal OptimalQuantity { get; set; }
        public decimal ReorderPoint { get; set; }
        public decimal SafetyStock { get; set; }
        public decimal AnnualSavings { get; set; }
        public DateTime CalculatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property
        public Product Product { get; set; } = null!;
    }
}