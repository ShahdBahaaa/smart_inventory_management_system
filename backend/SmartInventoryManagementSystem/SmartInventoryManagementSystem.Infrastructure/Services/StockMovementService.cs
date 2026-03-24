using Microsoft.EntityFrameworkCore;
using SmartInventoryManagementSystem.Application.DTOs.StockMovement;
using SmartInventoryManagementSystem.Application.Interfaces;
using SmartInventoryManagementSystem.Domain.Entities;
using SmartInventoryManagementSystem.Domain.Enums;
using SmartInventoryManagementSystem.Infrastructure.Data;

namespace SmartInventoryManagementSystem.Infrastructure.Services
{
    public class StockMovementService : IStockMovementService
    {
        private readonly AppDbContext _context;

        public StockMovementService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<StockMovement>> GetMovementsByProduct(int productId)
        {
            return await _context.StockMovements
                .Where(sm => sm.ProductID == productId)
                .OrderByDescending(sm => sm.Date)
                .ToListAsync();
        }

        public async Task<StockMovement> CreateMovement(CreateStockMovementDto dto, int userId)
        {
            var product = await _context.Products.FindAsync(dto.ProductID);

            if (product == null)
                throw new KeyNotFoundException("Product not found");

            var lastMovement = await _context.StockMovements
                .Where(sm => sm.ProductID == dto.ProductID)
                .OrderByDescending(sm => sm.Date)
                .FirstOrDefaultAsync();

            var previousQty = lastMovement?.NewQuantity ?? 0;

            var newQty = dto.MovementType switch
            {
                MovementType.IN => previousQty + dto.Quantity,
                MovementType.OUT => previousQty - dto.Quantity,
                MovementType.ADJUSTMENT => dto.Quantity,
                _ => previousQty
            };

            var movement = new StockMovement
            {
                ProductID = dto.ProductID,
                MovementType = dto.MovementType,
                Quantity = dto.Quantity,
                PreviousQuantity = previousQty,
                NewQuantity = newQty,
                UserID = userId,
                Remarks = dto.Remarks
            };

            _context.StockMovements.Add(movement);
            await _context.SaveChangesAsync();
            return movement;
        }
    }
}