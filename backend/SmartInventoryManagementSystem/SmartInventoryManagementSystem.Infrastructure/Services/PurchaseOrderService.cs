using Microsoft.EntityFrameworkCore;
using SmartInventoryManagementSystem.Application.DTOs.PurchaseOrder;
using SmartInventoryManagementSystem.Application.Interfaces;
using SmartInventoryManagementSystem.Domain.Entities;
using SmartInventoryManagementSystem.Domain.Enums;
using SmartInventoryManagementSystem.Infrastructure.Data;

namespace SmartInventoryManagementSystem.Infrastructure.Services
{
    public class PurchaseOrderService : IPurchaseOrderService
    {
        private readonly AppDbContext _context;

        public PurchaseOrderService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<PurchaseOrder>> GetAllPurchaseOrders(string? status, int? supplierID)
        {
            var query = _context.PurchaseOrders
                .Include(p => p.Supplier)
                .Include(p => p.Items)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(p => p.Status.ToString() == status);

            if (supplierID.HasValue)
                query = query.Where(p => p.SupplierID == supplierID);

            return await query.OrderByDescending(p => p.OrderDate).ToListAsync();
        }

        public async Task<PurchaseOrder?> GetPurchaseOrderById(int id)
        {
            return await _context.PurchaseOrders
                .Include(p => p.Supplier)
                .Include(p => p.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(p => p.POID == id);
        }

        public async Task<PurchaseOrder> CreatePurchaseOrder(CreatePurchaseOrderDto dto, int createdByUserID)
        {
            var po = new PurchaseOrder
            {
                SupplierID = dto.SupplierID,
                OrderDate = DateTime.UtcNow,
                ExpectedDeliveryDate = dto.ExpectedDeliveryDate,
                Status = POStatus.DRAFT,
                CreatedBy = createdByUserID
            };

            _context.PurchaseOrders.Add(po);
            await _context.SaveChangesAsync();
            return po;
        }

        public async Task<PurchaseOrderItem> AddItem(int poid, AddPurchaseOrderItemDto dto)
        {
            var po = await _context.PurchaseOrders.FindAsync(poid);
            if (po == null) throw new KeyNotFoundException("Purchase Order not found");
            if (po.Status != POStatus.DRAFT) throw new InvalidOperationException("Can only add items to DRAFT orders");

            var item = new PurchaseOrderItem
            {
                POID = poid,
                ProductID = dto.ProductID,
                QuantityOrdered = dto.OrderedQuantity,
                UnitPrice = dto.UnitPrice
            };

            _context.PurchaseOrderItems.Add(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<PurchaseOrder> ApprovePurchaseOrder(int id)
        {
            var po = await _context.PurchaseOrders.FindAsync(id);
            if (po == null) throw new KeyNotFoundException("Purchase Order not found");
            if (po.Status != POStatus.DRAFT) throw new InvalidOperationException("Only DRAFT orders can be approved");

            po.Status = POStatus.CONFIRMED;
            await _context.SaveChangesAsync();
            return po;
        }

        public async Task<PurchaseOrder> SendPurchaseOrder(int id)
        {
            var po = await _context.PurchaseOrders.FindAsync(id);
            if (po == null) throw new KeyNotFoundException("Purchase Order not found");
            if (po.Status != POStatus.CONFIRMED) throw new InvalidOperationException("Only CONFIRMED orders can be sent");

            po.Status = POStatus.SENT;
            await _context.SaveChangesAsync();
            return po;
        }

        public async Task<PurchaseOrder> ReceivePurchaseOrder(int id, ReceivePurchaseOrderDto dto)
        {
            var po = await _context.PurchaseOrders
                .Include(p => p.Items)
                .FirstOrDefaultAsync(p => p.POID == id);

            if (po == null) throw new KeyNotFoundException("Purchase Order not found");
            if (po.Status != POStatus.SENT) throw new InvalidOperationException("Only SENT orders can be received");

            // جيبي كل الـ products مرة واحدة بدل N+1
            var productIds = po.Items.Select(i => i.ProductID).Distinct().ToList();
            var products = await _context.Products
                .Where(p => productIds.Contains(p.ProductID))
                .ToDictionaryAsync(p => p.ProductID);

            foreach (var receiveItem in dto.Items)
            {
                var item = po.Items.FirstOrDefault(i => i.ItemID == receiveItem.PurchaseOrderItemID);
                if (item == null) continue;

                item.ReceivedQuantity = receiveItem.ReceivedQuantity;
                item.Status = POItemStatus.COMPLETED;

                if (!products.TryGetValue(item.ProductID, out var product)) continue;

                var previousQty = product.CurrentStock;
                product.CurrentStock += receiveItem.ReceivedQuantity;

                _context.StockMovements.Add(new StockMovement
                {
                    ProductID = item.ProductID,
                    MovementType = MovementType.IN,
                    Quantity = receiveItem.ReceivedQuantity,
                    PreviousQuantity = previousQty,
                    NewQuantity = product.CurrentStock,
                    Date = DateTime.UtcNow,
                    Remarks = $"PO-{id}"
                });

                if (receiveItem.ExpiryDate.HasValue || receiveItem.LotNumber != null)
                {
                    _context.ProductBatches.Add(new ProductBatch
                    {
                        ProductID = item.ProductID,
                        LotNumber = receiveItem.LotNumber ?? $"LOT-{DateTime.UtcNow:yyyyMMdd}",
                        Quantity = receiveItem.ReceivedQuantity,
                        ExpiryDate = receiveItem.ExpiryDate ?? DateTime.UtcNow.AddYears(1),
                        ReceivedDate = DateTime.UtcNow
                    });
                }
            }

            po.Status = POStatus.RECEIVED;
            po.ActualDeliveryDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return po;
        }

        public async Task<PurchaseOrder> ClosePurchaseOrder(int id)
        {
            var po = await _context.PurchaseOrders.FindAsync(id);
            if (po == null) throw new KeyNotFoundException("Purchase Order not found");
            if (po.Status != POStatus.RECEIVED) throw new InvalidOperationException("Only RECEIVED orders can be closed");

            po.Status = POStatus.CLOSED;
            await _context.SaveChangesAsync();
            return po;
        }

        public async Task<object> GetDeliveryStatus(int id)
        {
            var po = await _context.PurchaseOrders
                .Include(p => p.Supplier)
                .FirstOrDefaultAsync(p => p.POID == id);

            if (po == null) throw new KeyNotFoundException("Purchase Order not found");

            var daysOverdue = po.ExpectedDeliveryDate < DateTime.UtcNow &&
                              po.Status != POStatus.RECEIVED &&
                              po.Status != POStatus.CLOSED
                ? (int)(DateTime.UtcNow - po.ExpectedDeliveryDate).TotalDays
                : 0;

            return new
            {
                POID = po.POID,
                Status = po.Status.ToString(),
                OrderDate = po.OrderDate,
                ExpectedDeliveryDate = po.ExpectedDeliveryDate,
                ActualDeliveryDate = po.ActualDeliveryDate,
                DaysOverdue = daysOverdue,
                SupplierName = po.Supplier?.Name
            };
        }
    }
}