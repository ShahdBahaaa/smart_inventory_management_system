using SmartInventoryManagementSystem.Application.DTOs.StockMovement;
using SmartInventoryManagementSystem.Domain.Entities;

namespace SmartInventoryManagementSystem.Application.Interfaces
{
    public interface IStockMovementService
    {
        Task<List<StockMovement>> GetMovementsByProduct(int productId);
        Task<StockMovement> CreateMovement(CreateStockMovementDto dto, int userId);
    }
}
