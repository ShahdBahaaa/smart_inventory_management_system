using SmartInventoryManagementSystem.Domain.Enums;

namespace SmartInventoryManagementSystem.Application.DTOs.StockMovement
{
    public class CreateStockMovementDto
    {
        public int ProductID { get; set; }
        public MovementType MovementType { get; set; }
        public int Quantity { get; set; }
        public string Remarks { get; set; } = string.Empty;
    }
} 
