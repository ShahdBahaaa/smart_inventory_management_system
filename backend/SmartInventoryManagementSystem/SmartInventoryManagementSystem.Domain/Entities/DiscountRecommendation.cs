namespace SmartInventoryManagementSystem.Domain.Entities
{
    public class DiscountRecommendation
    {
        public int RecommendationID { get; set; }
        public int ProductID { get; set; }
        public int StrategyID { get; set; }
        public decimal SuggestedDiscountPercent { get; set; }
        public decimal ConfidenceScore { get; set; }
        public string Reason { get; set; } = string.Empty;
        public bool IsApproved { get; set; } = false;
        public bool IsRejected { get; set; } = false;
        public int? ReviewedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public Product Product { get; set; } = null!;
        public DiscountStrategy Strategy { get; set; } = null!;
        public User? ReviewedByUser { get; set; }
        public ActiveDiscount? ActiveDiscount { get; set; }
    }
}