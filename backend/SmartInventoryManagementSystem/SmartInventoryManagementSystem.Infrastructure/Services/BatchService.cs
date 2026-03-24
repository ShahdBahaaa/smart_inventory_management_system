using Microsoft.EntityFrameworkCore;
using SmartInventoryManagementSystem.Application.DTOs.Batch;
using SmartInventoryManagementSystem.Application.Interfaces;
using SmartInventoryManagementSystem.Domain.Entities;
using SmartInventoryManagementSystem.Infrastructure.Data;

namespace SmartInventoryManagementSystem.Infrastructure.Services
{
    public class BatchService : IBatchService
    {
        private readonly AppDbContext _context;

        public BatchService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProductBatch>> GetBatchesByProduct(int productId)
        {
            return await _context.ProductBatches
                .Where(b => b.ProductID == productId)
                .OrderBy(b => b.ExpiryDate)
                .ToListAsync();
        }

        public async Task<ProductBatch> CreateBatch(int productId, CreateBatchDto dto)
        {
            var product = await _context.Products.FindAsync(productId);

            if (product == null)
                throw new KeyNotFoundException("Product not found");

            var batch = new ProductBatch
            {
                ProductID = productId,
                LotNumber = dto.LotNumber,
                ExpiryDate = dto.ExpiryDate,
                Quantity = dto.Quantity,
                ReceivedDate = dto.ReceivedDate
            };

            _context.ProductBatches.Add(batch);
            await _context.SaveChangesAsync();
            return batch;
        }
    }
}