using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace SmartInventoryManagementSystem.Domain.Entities
{
    public class ActiveDiscount
    {
        public int ActiveDiscountID { get; set; }
        public int RecommendationID { get; set; }
        public int ProductID { get; set; }
        public decimal DiscountPercent { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public DateTime EndDate { get; set; }
        public int ApprovedBy { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation Properties
        public DiscountRecommendation Recommendation { get; set; } = null!;
        public Product Product { get; set; } = null!;
        public User ApprovedByUser { get; set; } = null!;
    }
}