using SmartInventoryManagementSystem.Application.DTOs.Product;

namespace SmartInventoryManagementSystem.Application.Interfaces
{
    public interface IProductService
    {
        Task<List<ProductResponseDto>> GetAllProducts(string? category, string? status, string? search);
        Task<ProductResponseDto?> GetProductById(int id);
        Task<ProductResponseDto> CreateProduct(CreateProductDto dto, int createdBy);
        Task<ProductResponseDto> UpdateProduct(int id, UpdateProductDto dto);
        Task DeleteProduct(int id);
    }
}