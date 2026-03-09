using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartInventoryManagementSystem.Application.DTOs.Product;
using SmartInventoryManagementSystem.Application.Interfaces;
using System.Security.Claims;

namespace SmartInventoryManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/products")]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _service;

        public ProductsController(IProductService service)
        {
            _service = service;
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
        [Authorize(Roles = "ADMIN,INVENTORY_MANAGER")]
        public async Task<IActionResult> CreateProduct(CreateProductDto dto)
        {
            var claim = User.FindFirst("id");
            if (claim == null || !int.TryParse(claim.Value, out var userId))
                return Unauthorized();

            var product = await _service.CreateProduct(dto, userId);
            return Ok(product);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN,INVENTORY_MANAGER")]
        public async Task<IActionResult> UpdateProduct(int id, UpdateProductDto dto)
        {
            var product = await _service.UpdateProduct(id, dto);
            return Ok(product);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            await _service.DeleteProduct(id);
            return NoContent();
        }

        [HttpGet("{id}/batches")]
        public async Task<IActionResult> GetBatches(int id, [FromServices] IBatchService batchService)
        {
            var batches = await batchService.GetBatchesByProduct(id);
            return Ok(batches);
        }

        [HttpPost("{id}/batches")]
        [Authorize(Roles = "ADMIN,INVENTORY_MANAGER")]
        public async Task<IActionResult> CreateBatch(int id, [FromBody] Application.DTOs.Batch.CreateBatchDto dto, [FromServices] IBatchService batchService)
        {
            var batch = await batchService.CreateBatch(id, dto);
            return Ok(batch);
        }

        [HttpGet("{id}/stock-movements")]
        public async Task<IActionResult> GetStockMovements(int id, [FromServices] IStockMovementService stockMovementService)
        {
            var movements = await stockMovementService.GetMovementsByProduct(id);
            return Ok(movements);
        }
    }
}