using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartInventoryManagementSystem.API.Filters;
using SmartInventoryManagementSystem.Application.DTOs.Batch;
using SmartInventoryManagementSystem.Application.DTOs.Product;
using SmartInventoryManagementSystem.Application.Interfaces;
using SmartInventoryManagementSystem.Domain.Enums;

namespace SmartInventoryManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/products")]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _service;
        private readonly IBatchService _batchService;
        private readonly IStockMovementService _stockMovementService;

        public ProductsController(
            IProductService service,
            IBatchService batchService,
            IStockMovementService stockMovementService)
        {
            _service = service;
            _batchService = batchService;
            _stockMovementService = stockMovementService;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts(
            [FromQuery] string? category,
            [FromQuery] string? status,
            [FromQuery] string? search)
        {
            var products = await _service.GetAllProducts(category, status, search);
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await _service.GetProductById(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpPost]
        [AuthorizeRoles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)]
        public async Task<IActionResult> CreateProduct(CreateProductDto dto)
        {
            var claim = User.FindFirst("id");
            if (claim == null || !int.TryParse(claim.Value, out var userId))
                return Unauthorized();

            var product = await _service.CreateProduct(dto, userId);
            return CreatedAtAction(nameof(GetProduct), new { id = product.ProductID }, product);
        }

        [HttpPut("{id}")]
        [AuthorizeRoles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)]
        public async Task<IActionResult> UpdateProduct(int id, UpdateProductDto dto)
        {
            var product = await _service.UpdateProduct(id, dto);
            return Ok(product);
        }

        [HttpDelete("{id}")]
        [AuthorizeRoles(UserRole.ADMIN)]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            await _service.DeleteProduct(id);
            return NoContent();
        }

        [HttpGet("{id}/batches")]
        public async Task<IActionResult> GetBatches(int id)
        {
            var batches = await _batchService.GetBatchesByProduct(id);
            return Ok(batches);
        }

        [HttpPost("{id}/batches")]
        [AuthorizeRoles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)]
        public async Task<IActionResult> CreateBatch(int id, [FromBody] CreateBatchDto dto)
        {
            var batch = await _batchService.CreateBatch(id, dto);
            return Ok(batch);
        }

        [HttpGet("{id}/stock-movements")]
        public async Task<IActionResult> GetStockMovements(int id)
        {
            var movements = await _stockMovementService.GetMovementsByProduct(id);
            return Ok(movements);
        }
    }
}