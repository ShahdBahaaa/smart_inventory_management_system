using Microsoft.AspNetCore.Mvc;
using SmartInventoryManagementSystem.API.Filters;
using SmartInventoryManagementSystem.Application.DTOs.PurchaseOrder;
using SmartInventoryManagementSystem.Application.Interfaces;
using SmartInventoryManagementSystem.Domain.Enums;

namespace SmartInventoryManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/purchase-orders")]
    public class PurchaseOrdersController : ControllerBase
    {
        private readonly IPurchaseOrderService _service;

        public PurchaseOrdersController(IPurchaseOrderService service)
        {
            _service = service;
        }

        [HttpGet]
        [AuthorizeRoles(UserRole.ADMIN, UserRole.BUSINESS_OWNER, UserRole.INVENTORY_MANAGER)]
        public async Task<IActionResult> GetPurchaseOrders([FromQuery] string? status, [FromQuery] int? supplierID)
        {
            var orders = await _service.GetAllPurchaseOrders(status, supplierID);
            return Ok(orders);
        }

        [HttpGet("{id}")]
        [AuthorizeRoles(UserRole.ADMIN, UserRole.BUSINESS_OWNER, UserRole.INVENTORY_MANAGER, UserRole.WAREHOUSE_STAFF)]
        public async Task<IActionResult> GetPurchaseOrder(int id)
        {
            var order = await _service.GetPurchaseOrderById(id);
            if (order == null) return NotFound();
            return CreatedAtAction(nameof(GetPurchaseOrder), new { id = order.POID }, order);
        }

        [HttpPost]
        [AuthorizeRoles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)]
        public async Task<IActionResult> CreatePurchaseOrder([FromBody] CreatePurchaseOrderDto dto)
        {
            var userIdClaim = User.FindFirst("id")?.Value;
            if (userIdClaim == null) return Unauthorized();

            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized(new { message = "Invalid token claims" });

            var order = await _service.CreatePurchaseOrder(dto, userId);
            return CreatedAtAction(nameof(GetPurchaseOrder), new { id = order.POID }, order);
        }

        [HttpPost("{id}/items")]
        [AuthorizeRoles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)]
        public async Task<IActionResult> AddItem(int id, [FromBody] AddPurchaseOrderItemDto dto)
        {
            var item = await _service.AddItem(id, dto);
            return Ok(item);
        }

        [HttpPut("{id}/approve")]
        [AuthorizeRoles(UserRole.ADMIN, UserRole.BUSINESS_OWNER)]
        public async Task<IActionResult> ApprovePurchaseOrder(int id)
        {
            var order = await _service.ApprovePurchaseOrder(id);
            return CreatedAtAction(nameof(GetPurchaseOrder), new { id = order.POID }, order);
        }

        [HttpPut("{id}/send")]
        [AuthorizeRoles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)]
        public async Task<IActionResult> SendPurchaseOrder(int id)
        {
            var order = await _service.SendPurchaseOrder(id);
            return CreatedAtAction(nameof(GetPurchaseOrder), new { id = order.POID }, order);
        }

        [HttpPut("{id}/receive")]
        [AuthorizeRoles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER, UserRole.WAREHOUSE_STAFF)]
        public async Task<IActionResult> ReceivePurchaseOrder(int id, [FromBody] ReceivePurchaseOrderDto dto)
        {
            var order = await _service.ReceivePurchaseOrder(id, dto);
            return CreatedAtAction(nameof(GetPurchaseOrder), new { id = order.POID }, order);
        }

        [HttpPut("{id}/close")]
        [AuthorizeRoles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)]
        public async Task<IActionResult> ClosePurchaseOrder(int id)
        {
            var order = await _service.ClosePurchaseOrder(id);
            return CreatedAtAction(nameof(GetPurchaseOrder), new { id = order.POID }, order);
        }

        [HttpGet("{id}/delivery-status")]
        [AuthorizeRoles(UserRole.ADMIN, UserRole.BUSINESS_OWNER, UserRole.INVENTORY_MANAGER)]
        public async Task<IActionResult> GetDeliveryStatus(int id)
        {
            var status = await _service.GetDeliveryStatus(id);
            return Ok(status);
        }
    }
}