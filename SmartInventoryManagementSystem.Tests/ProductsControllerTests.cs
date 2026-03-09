using Xunit;
using Microsoft.EntityFrameworkCore;
using SmartInventoryManagementSystem.Infrastructure.Data;
using SmartInventoryManagementSystem.Infrastructure.Services;
using SmartInventoryManagementSystem.API.Controllers;
using SmartInventoryManagementSystem.Application.DTOs.Product;
using SmartInventoryManagementSystem.Domain.Entities;
using SmartInventoryManagementSystem.Domain.Enums;

namespace SmartInventoryManagementSystem.Tests
{
    public class ProductsControllerTests
    {
        private AppDbContext GetInMemoryDb()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new AppDbContext(options);
        }

        [Fact]
        public async Task GetProducts_ReturnsAllProducts()
        {
            // Arrange
            var db = GetInMemoryDb();
            db.Suppliers.Add(new Supplier { SupplierID = 1, Name = "Supplier1", Email = "s@test.com" });
            db.Products.AddRange(
                new Product { ProductID = 1, SKU = "SKU001", Name = "Product1", Category = "Cat1", SupplierID = 1, CreatedBy = 1 },
                new Product { ProductID = 2, SKU = "SKU002", Name = "Product2", Category = "Cat2", SupplierID = 1, CreatedBy = 1 }
            );
            await db.SaveChangesAsync();

            var service = new ProductService(db);
            var controller = new ProductsController(service);

            // Act
            var result = await controller.GetProducts(null, null, null);

            // Assert
            var okResult = Assert.IsType<Microsoft.AspNetCore.Mvc.OkObjectResult>(result);
            var products = Assert.IsType<List<Product>>(okResult.Value);
            Assert.Equal(2, products.Count);
        }

        [Fact]
        public async Task GetProducts_WithCategoryFilter_ReturnsFiltered()
        {
            // Arrange
            var db = GetInMemoryDb();
            db.Suppliers.Add(new Supplier { SupplierID = 1, Name = "Supplier1", Email = "s@test.com" });
            db.Products.AddRange(
                new Product { ProductID = 1, SKU = "SKU001", Name = "Product1", Category = "Cat1", SupplierID = 1, CreatedBy = 1 },
                new Product { ProductID = 2, SKU = "SKU002", Name = "Product2", Category = "Cat2", SupplierID = 1, CreatedBy = 1 }
            );
            await db.SaveChangesAsync();

            var service = new ProductService(db);
            var controller = new ProductsController(service);

            // Act
            var result = await controller.GetProducts("Cat1", null, null);

            // Assert
            var okResult = Assert.IsType<Microsoft.AspNetCore.Mvc.OkObjectResult>(result);
            var products = Assert.IsType<List<Product>>(okResult.Value);
            Assert.Single(products);
        }

        [Fact]
        public async Task GetProduct_ExistingId_ReturnsProduct()
        {
            // Arrange
            var db = GetInMemoryDb();
            db.Suppliers.Add(new Supplier { SupplierID = 1, Name = "Supplier1", Email = "s@test.com" });
            db.Products.Add(new Product { ProductID = 1, SKU = "SKU001", Name = "Product1", Category = "Cat1", SupplierID = 1, CreatedBy = 1 });
            await db.SaveChangesAsync();

            var service = new ProductService(db);
            var controller = new ProductsController(service);

            // Act
            var result = await controller.GetProduct(1);

            // Assert
            var okResult = Assert.IsType<Microsoft.AspNetCore.Mvc.OkObjectResult>(result);
            var product = Assert.IsType<Product>(okResult.Value);
            Assert.Equal("Product1", product.Name);
        }

        [Fact]
        public async Task GetProduct_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            var db = GetInMemoryDb();
            var service = new ProductService(db);
            var controller = new ProductsController(service);

            // Act
            var result = await controller.GetProduct(999);

            // Assert
            Assert.IsType<Microsoft.AspNetCore.Mvc.NotFoundResult>(result);
        }

        [Fact]
        public async Task DeleteProduct_ExistingId_ReturnsNoContent()
        {
            // Arrange
            var db = GetInMemoryDb();
            db.Suppliers.Add(new Supplier { SupplierID = 1, Name = "Supplier1", Email = "s@test.com" });
            db.Products.Add(new Product { ProductID = 1, SKU = "SKU001", Name = "Product1", Category = "Cat1", SupplierID = 1, CreatedBy = 1 });
            await db.SaveChangesAsync();

            var service = new ProductService(db);
            var controller = new ProductsController(service);

            // Act
            var result = await controller.DeleteProduct(1);

            // Assert
            Assert.IsType<Microsoft.AspNetCore.Mvc.NoContentResult>(result);
            Assert.Null(await db.Products.FindAsync(1));
        }
    }
}