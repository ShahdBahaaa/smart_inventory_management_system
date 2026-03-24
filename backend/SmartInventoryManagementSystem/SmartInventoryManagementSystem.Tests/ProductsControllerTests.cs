using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using SmartInventoryManagementSystem.Application.Interfaces;
using SmartInventoryManagementSystem.API.Controllers;
using SmartInventoryManagementSystem.Application.DTOs.Product;

namespace SmartInventoryManagementSystem.Tests
{
    public class ProductsControllerTests
    {
        private readonly Mock<IProductService> _serviceMock;
        private readonly Mock<IBatchService> _batchServiceMock;
        private readonly Mock<IStockMovementService> _stockMovementServiceMock;
        private readonly ProductsController _controller;

        public ProductsControllerTests()
        {
            _serviceMock = new Mock<IProductService>();
            _batchServiceMock = new Mock<IBatchService>();
            _stockMovementServiceMock = new Mock<IStockMovementService>();

            _controller = new ProductsController(
                _serviceMock.Object,
                _batchServiceMock.Object,
                _stockMovementServiceMock.Object);
        }

        [Fact]
        public async Task GetProducts_ReturnsAllProducts()
        {
            var products = new List<ProductResponseDto>
            {
                new ProductResponseDto { ProductID = 1, Name = "Product1", SKU = "SKU001" },
                new ProductResponseDto { ProductID = 2, Name = "Product2", SKU = "SKU002" }
            };

            _serviceMock
                .Setup(s => s.GetAllProducts(null, null, null))
                .ReturnsAsync(products);

            var result = await _controller.GetProducts(null, null, null);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returned = Assert.IsType<List<ProductResponseDto>>(okResult.Value);
            Assert.Equal(2, returned.Count);
        }

        [Fact]
        public async Task GetProduct_ExistingId_ReturnsProduct()
        {
            var product = new ProductResponseDto
            {
                ProductID = 1,
                Name = "Product1",
                SKU = "SKU001"
            };

            _serviceMock
                .Setup(s => s.GetProductById(1))
                .ReturnsAsync(product);

            var result = await _controller.GetProduct(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returned = Assert.IsType<ProductResponseDto>(okResult.Value);
            Assert.Equal("Product1", returned.Name);
        }

        [Fact]
        public async Task GetProduct_NonExistingId_ReturnsNotFound()
        {
            _serviceMock
                .Setup(s => s.GetProductById(999))
                .ReturnsAsync((ProductResponseDto?)null);

            var result = await _controller.GetProduct(999);

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task UpdateProduct_ExistingId_ReturnsUpdated()
        {
            var dto = new UpdateProductDto { Name = "Updated" };
            var updated = new ProductResponseDto { ProductID = 1, Name = "Updated", SKU = "SKU001" };

            _serviceMock
                .Setup(s => s.UpdateProduct(1, dto))
                .ReturnsAsync(updated);

            var result = await _controller.UpdateProduct(1, dto);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returned = Assert.IsType<ProductResponseDto>(okResult.Value);
            Assert.Equal("Updated", returned.Name);
        }

        [Fact]
        public async Task DeleteProduct_ExistingId_ReturnsNoContent()
        {
            _serviceMock
                .Setup(s => s.DeleteProduct(1))
                .Returns(Task.CompletedTask);

            var result = await _controller.DeleteProduct(1);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task UpdateProduct_NotFound_ThrowsException()
        {
            _serviceMock
                .Setup(s => s.UpdateProduct(999, It.IsAny<UpdateProductDto>()))
                .ThrowsAsync(new KeyNotFoundException("Product not found"));

            await Assert.ThrowsAsync<KeyNotFoundException>(() =>
                _controller.UpdateProduct(999, new UpdateProductDto()));
        }
    }
}