using Xunit;
using Microsoft.EntityFrameworkCore;
using SmartInventoryManagementSystem.Infrastructure.Data;
using SmartInventoryManagementSystem.Infrastructure.Services;
using SmartInventoryManagementSystem.API.Controllers;
using SmartInventoryManagementSystem.Application.DTOs.Supplier;
using SmartInventoryManagementSystem.Domain.Entities;

namespace SmartInventoryManagementSystem.Tests
{
    public class SuppliersControllerTests
    {
        private AppDbContext GetInMemoryDb()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new AppDbContext(options);
        }

        [Fact]
        public async Task GetSuppliers_ReturnsActiveSuppliers()
        {
            // Arrange
            var db = GetInMemoryDb();
            db.Suppliers.AddRange(
                new Supplier { SupplierID = 1, Name = "Supplier1", Email = "s1@test.com", IsActive = true },
                new Supplier { SupplierID = 2, Name = "Supplier2", Email = "s2@test.com", IsActive = false }
            );
            await db.SaveChangesAsync();

            var service = new SupplierService(db);
            var controller = new SuppliersController(service);

            // Act
            var result = await controller.GetSuppliers();

            // Assert
            var okResult = Assert.IsType<Microsoft.AspNetCore.Mvc.OkObjectResult>(result);
            var suppliers = Assert.IsType<List<Supplier>>(okResult.Value);
            Assert.Single(suppliers);
        }

        [Fact]
        public async Task GetSupplier_ExistingId_ReturnsSupplier()
        {
            // Arrange
            var db = GetInMemoryDb();
            db.Suppliers.Add(new Supplier { SupplierID = 1, Name = "Supplier1", Email = "s1@test.com", IsActive = true });
            await db.SaveChangesAsync();

            var service = new SupplierService(db);
            var controller = new SuppliersController(service);

            // Act
            var result = await controller.GetSupplier(1);

            // Assert
            var okResult = Assert.IsType<Microsoft.AspNetCore.Mvc.OkObjectResult>(result);
            var supplier = Assert.IsType<Supplier>(okResult.Value);
            Assert.Equal("Supplier1", supplier.Name);
        }

        [Fact]
        public async Task GetSupplier_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            var db = GetInMemoryDb();
            var service = new SupplierService(db);
            var controller = new SuppliersController(service);

            // Act
            var result = await controller.GetSupplier(999);

            // Assert
            Assert.IsType<Microsoft.AspNetCore.Mvc.NotFoundResult>(result);
        }

        [Fact]
        public async Task CreateSupplier_ValidData_ReturnsSupplier()
        {
            // Arrange
            var db = GetInMemoryDb();
            var service = new SupplierService(db);
            var controller = new SuppliersController(service);

            // Act
            var result = await controller.CreateSupplier(new CreateSupplierDto
            {
                Name = "New Supplier",
                Email = "new@test.com",
                Phone = "0123456789",
                ContactPerson = "John",
                Address = "Cairo",
                LeadTime = 7
            });

            // Assert
            var okResult = Assert.IsType<Microsoft.AspNetCore.Mvc.OkObjectResult>(result);
            var supplier = Assert.IsType<Supplier>(okResult.Value);
            Assert.Equal("New Supplier", supplier.Name);
        }

        [Fact]
        public async Task DeleteSupplier_ExistingId_SoftDeletes()
        {
            // Arrange
            var db = GetInMemoryDb();
            db.Suppliers.Add(new Supplier { SupplierID = 1, Name = "Supplier1", Email = "s1@test.com", IsActive = true });
            await db.SaveChangesAsync();

            var service = new SupplierService(db);
            var controller = new SuppliersController(service);

            // Act
            var result = await controller.DeleteSupplier(1);

            // Assert
            Assert.IsType<Microsoft.AspNetCore.Mvc.NoContentResult>(result);
            var supplier = await db.Suppliers.FindAsync(1);
            Assert.False(supplier!.IsActive);
        }

        [Fact]
        public async Task GetSupplierScore_ReturnsScore()
        {
            // Arrange
            var db = GetInMemoryDb();
            db.Suppliers.Add(new Supplier
            {
                SupplierID = 1,
                Name = "Supplier1",
                Email = "s1@test.com",
                IsActive = true,
                OnTimeDeliveryRate = 90,
                QualityScore = 85,
                FulfillmentRate = 95
            });
            await db.SaveChangesAsync();

            var service = new SupplierService(db);
            var controller = new SuppliersController(service);

            // Act
            var result = await controller.GetSupplierScore(1);

            // Assert
            var okResult = Assert.IsType<Microsoft.AspNetCore.Mvc.OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }
    }
}
