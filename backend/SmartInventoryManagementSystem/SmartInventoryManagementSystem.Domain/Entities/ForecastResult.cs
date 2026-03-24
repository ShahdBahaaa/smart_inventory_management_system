using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace SmartInventoryManagementSystem.Domain.Entities
{
    public class ForecastResult
    {
        public int ForecastID { get; set; }
        public int ProductID { get; set; }
        public DateTime ForecastDate { get; set; } = DateTime.UtcNow;
        public decimal PredictedDemand { get; set; }
        public decimal ConfidenceScore { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
        public DateTime? CachedUntil { get; set; }

        // Navigation Property
        public Product Product { get; set; } = null!;
    }
}
