using SmartInventoryManagementSystem.Application.DTOs.Batch;
using SmartInventoryManagementSystem.Domain.Entities;

namespace SmartInventoryManagementSystem.Application.Interfaces
{
    public interface IBatchService
    {
        Task<List<ProductBatch>> GetBatchesByProduct(int productId);
        Task<ProductBatch> CreateBatch(int productId, CreateBatchDto dto);
    }
}
