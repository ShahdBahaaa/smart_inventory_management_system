using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartInventoryManagementSystem.Application.DTOs.StockMovement;
using SmartInventoryManagementSystem.Application.Interfaces;

namespace SmartInventoryManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/stock-movements")]
    [Authorize]
    public class StockMovementsController : ControllerBase
    {
        private readonly IStockMovementService _service;

        public StockMovementsController(IStockMovementService service)
        {
            _service = service;
        }

        [HttpPost]
        [Authorize(Roles = "ADMIN,INVENTORY_MANAGER,WAREHOUSE_STAFF")]
        public async Task<IActionResult> CreateMovement(CreateStockMovementDto dto)
        {
            var claim = User.FindFirst("id");
            if (claim == null || !int.TryParse(claim.Value, out var userId))
                return Unauthorized();

            var movement = await _service.CreateMovement(dto, userId);
            return Ok(movement);
        }
    }
}
