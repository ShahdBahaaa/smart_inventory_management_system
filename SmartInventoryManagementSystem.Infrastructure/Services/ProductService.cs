using Microsoft.EntityFrameworkCore;
using SmartInventoryManagementSystem.Application.DTOs.Product;
using SmartInventoryManagementSystem.Application.Interfaces;
using SmartInventoryManagementSystem.Domain.Entities;
using SmartInventoryManagementSystem.Domain.Enums;
using SmartInventoryManagementSystem.Infrastructure.Data;

namespace SmartInventoryManagementSystem.Infrastructure.Services
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Product>> GetAllProducts(string? category, string? status, string? search)
        {
            var query = _context.Products
                .Include(p => p.Supplier)
                .AsQueryable();

            if (!string.IsNullOrEmpty(category))
                query = query.Where(p => p.Category == category);

            if (!string.IsNullOrEmpty(status) && Enum.TryParse<ProductStatus>(status, true, out var productStatus))
                query = query.Where(p => p.Status == productStatus);

            if (!string.IsNullOrEmpty(search))
                query = query.Where(p => p.Name.Contains(search) || p.SKU.Contains(search));

            return await query.ToListAsync();
        }

        public async Task<Product?> GetProductById(int id)
        {
            return await _context.Products
                .Include(p => p.Supplier)
                .Include(p => p.Batches)
                .FirstOrDefaultAsync(p => p.ProductID == id);
        }

        public async Task<Product> CreateProduct(CreateProductDto dto, int createdBy)
        {
            var product = new Product
            {
                SKU = dto.SKU,
                Name = dto.Name,
                Description = dto.Description,
                Category = dto.Category,
                Brand = dto.Brand,
                Unit = dto.Unit,
                CostPrice = dto.CostPrice,
                SellingPrice = dto.SellingPrice,
                ReorderPoint = dto.ReorderPoint,
                SafetyStock = dto.SafetyStock,
                LeadTime = dto.LeadTime,
                SupplierID = dto.SupplierID,
                ExpiryTracking = dto.ExpiryTracking,
                WarehouseLocation = dto.WarehouseLocation,
                CreatedBy = createdBy
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Product> UpdateProduct(int id, UpdateProductDto dto)
        {
            var product = await GetProductById(id);

            if (product == null)
                throw new Exception("Product not found");

            product.Name = dto.Name ?? product.Name;
            product.Description = dto.Description ?? product.Description;
            product.Category = dto.Category ?? product.Category;
            product.Brand = dto.Brand ?? product.Brand;
            product.CostPrice = dto.CostPrice ?? product.CostPrice;
            product.SellingPrice = dto.SellingPrice ?? product.SellingPrice;
            product.ReorderPoint = dto.ReorderPoint ?? product.ReorderPoint;
            product.SafetyStock = dto.SafetyStock ?? product.SafetyStock;
            product.LeadTime = dto.LeadTime ?? product.LeadTime;
            product.SupplierID = dto.SupplierID ?? product.SupplierID;
            product.ExpiryTracking = dto.ExpiryTracking ?? product.ExpiryTracking;
            product.WarehouseLocation = dto.WarehouseLocation ?? product.WarehouseLocation;
            product.Status = dto.Status ?? product.Status;
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return product;
        }

        public async Task DeleteProduct(int id)
        {
            var product = await GetProductById(id);

            if (product == null)
                throw new Exception("Product not found");

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }
    }
}