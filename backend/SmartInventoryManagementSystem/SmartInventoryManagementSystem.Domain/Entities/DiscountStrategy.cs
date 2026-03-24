using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartInventoryManagementSystem.Domain.Entities
{
    public class DiscountStrategy
    {
        public int StrategyID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string TriggerConditions { get; set; } = string.Empty; // JSON
        public decimal MaxDiscountPercent { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property
        public ICollection<DiscountRecommendation> Recommendations { get; set; } = new List<DiscountRecommendation>();
    }
}
