using SmartInventoryManagementSystem.Domain.Enums;

namespace SmartInventoryManagementSystem.Domain.Entities
{
    public class User
    {
        public int UserID { get; set; }
        public string Name { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public UserStatus Status { get; set; } = UserStatus.ACTIVE;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLogin { get; set; }

        public bool IsDeleted { get; set; }

        // Navigation Properties
        public ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
        public ICollection<PurchaseOrder> PurchaseOrders { get; set; } = new List<PurchaseOrder>();
    }
}