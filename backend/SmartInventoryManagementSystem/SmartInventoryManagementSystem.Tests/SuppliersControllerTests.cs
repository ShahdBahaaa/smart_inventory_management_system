using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using SmartInventoryManagementSystem.Application.Interfaces;
using SmartInventoryManagementSystem.API.Controllers;
using SmartInventoryManagementSystem.Application.DTOs.Supplier;
using SmartInventoryManagementSystem.Domain.Entities;

namespace SmartInventoryManagementSystem.Tests
{
    public class SuppliersControllerTests
    {
        private readonly Mock<ISupplierService> _serviceMock;
        private readonly SuppliersController _controller;

        public SuppliersControllerTests()
        {
            _serviceMock = new Mock<ISupplierService>();
            _controller = new SuppliersController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetSuppliers_ReturnsActiveSuppliers()
        {
            // Arrange
            var suppliers = new List<Supplier>
            {
                new Supplier { SupplierID = 1, Name = "Supplier1", Email = "s1@test.com", IsActive = true },
                new Supplier { SupplierID = 2, Name = "Supplier2", Email = "s2@test.com", IsActive = true }
            };

            _serviceMock
                .Setup(s => s.GetAllSuppliers())
                .ReturnsAsync(suppliers);

            // Act
            var result = await _controller.GetSuppliers();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedSuppliers = Assert.IsType<List<Supplier>>(okResult.Value);
            Assert.Equal(2, returnedSuppliers.Count);
        }

        [Fact]
        public async Task GetSupplier_ExistingId_ReturnsSupplier()
        {
            // Arrange
            var supplier = new Supplier
            {
                SupplierID = 1,
                Name = "Supplier1",
                Email = "s1@test.com",
                IsActive = true
            };

            _serviceMock
                .Setup(s => s.GetSupplierById(1))
                .ReturnsAsync(supplier);

            // Act
            var result = await _controller.GetSupplier(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedSupplier = Assert.IsType<Supplier>(okResult.Value);
            Assert.Equal("Supplier1", returnedSupplier.Name);
        }

        [Fact]
        public async Task GetSupplier_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            _serviceMock
                .Setup(s => s.GetSupplierById(999))
                .ReturnsAsync((Supplier?)null);

            // Act
            var result = await _controller.GetSupplier(999);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task CreateSupplier_ValidData_ReturnsSupplier()
        {
            // Arrange
            var dto = new CreateSupplierDto
            {
                Name = "New Supplier",
                Email = "new@test.com",
                Phone = "0123456789",
                ContactPerson = "John",
                Address = "Cairo",
                LeadTime = 7
            };

            var supplier = new Supplier
            {
                SupplierID = 1,
                Name = "New Supplier",
                Email = "new@test.com",
                IsActive = true
            };

            _serviceMock
                .Setup(s => s.CreateSupplier(It.IsAny<CreateSupplierDto>()))
                .ReturnsAsync(supplier);

            // Act
            var result = await _controller.CreateSupplier(dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedSupplier = Assert.IsType<Supplier>(okResult.Value);
            Assert.Equal("New Supplier", returnedSupplier.Name);
        }

        [Fact]
        public async Task DeleteSupplier_ExistingId_ReturnsNoContent()
        {
            // Arrange
            _serviceMock
                .Setup(s => s.DeleteSupplier(1))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DeleteSupplier(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteSupplier_NonExistingId_ThrowsException()
        {
            // Arrange
            _serviceMock
                .Setup(s => s.DeleteSupplier(999))
                .ThrowsAsync(new KeyNotFoundException("Supplier not found"));

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() =>
                _controller.DeleteSupplier(999));
        }

        [Fact]
        public async Task GetSupplierScore_ReturnsScore()
        {
            // Arrange
            var score = new
            {
                SupplierID = 1,
                Name = "Supplier1",
                OverallScore = 88.5,
                Classification = "RELIABLE"
            };

            _serviceMock
                .Setup(s => s.GetSupplierScore(1))
                .ReturnsAsync(score);

            // Act
            var result = await _controller.GetSupplierScore(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }
    }
}