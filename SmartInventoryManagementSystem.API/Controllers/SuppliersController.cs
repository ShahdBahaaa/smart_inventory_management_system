using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartInventoryManagementSystem.Application.DTOs.Supplier;
using SmartInventoryManagementSystem.Application.Interfaces;

namespace SmartInventoryManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/suppliers")]
    [Authorize]
    public class SuppliersController : ControllerBase
    {
        private readonly ISupplierService _service;

        public SuppliersController(ISupplierService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetSuppliers()
        {
            var suppliers = await _service.GetAllSuppliers();
            return Ok(suppliers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSupplier(int id)
        {
            var supplier = await _service.GetSupplierById(id);
            if (supplier == null) return NotFound();
            return Ok(supplier);
        }

        [HttpPost]
        [Authorize(Roles = "ADMIN,INVENTORY_MANAGER")]
        public async Task<IActionResult> CreateSupplier(CreateSupplierDto dto)
        {
            var supplier = await _service.CreateSupplier(dto);
            return Ok(supplier);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN,INVENTORY_MANAGER")]
        public async Task<IActionResult> UpdateSupplier(int id, UpdateSupplierDto dto)
        {
            var supplier = await _service.UpdateSupplier(id, dto);
            return Ok(supplier);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteSupplier(int id)
        {
            await _service.DeleteSupplier(id);
            return NoContent();
        }

        [HttpGet("{id}/score")]
        public async Task<IActionResult> GetSupplierScore(int id)
        {
            var score = await _service.GetSupplierScore(id);
            return Ok(score);
        }
    }
}