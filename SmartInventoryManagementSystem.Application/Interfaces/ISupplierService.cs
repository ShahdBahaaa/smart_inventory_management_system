using SmartInventoryManagementSystem.Application.DTOs.Supplier;
using SmartInventoryManagementSystem.Domain.Entities;

namespace SmartInventoryManagementSystem.Application.Interfaces
{
    public interface ISupplierService
    {
        Task<List<Supplier>> GetAllSuppliers();
        Task<Supplier?> GetSupplierById(int id);
        Task<Supplier> CreateSupplier(CreateSupplierDto dto);
        Task<Supplier> UpdateSupplier(int id, UpdateSupplierDto dto);
        Task DeleteSupplier(int id);
        Task<object> GetSupplierScore(int id);
    }
}