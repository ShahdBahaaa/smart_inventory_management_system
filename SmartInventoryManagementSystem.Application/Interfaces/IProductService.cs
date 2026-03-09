using SmartInventoryManagementSystem.Application.DTOs.Product;
using SmartInventoryManagementSystem.Domain.Entities;

namespace SmartInventoryManagementSystem.Application.Interfaces
{
    public interface IProductService
    {
        Task<List<Product>> GetAllProducts(string? category, string? status, string? search);
        Task<Product?> GetProductById(int id);
        Task<Product> CreateProduct(CreateProductDto dto, int createdBy);
        Task<Product> UpdateProduct(int id, UpdateProductDto dto);
        Task DeleteProduct(int id);
    }
}