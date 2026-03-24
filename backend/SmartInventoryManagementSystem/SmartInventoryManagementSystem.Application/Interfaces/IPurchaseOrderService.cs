using SmartInventoryManagementSystem.Application.DTOs.PurchaseOrder;
using SmartInventoryManagementSystem.Domain.Entities;

namespace SmartInventoryManagementSystem.Application.Interfaces
{
    public interface IPurchaseOrderService
    {
        Task<List<PurchaseOrder>> GetAllPurchaseOrders(string? status, int? supplierID);
        Task<PurchaseOrder?> GetPurchaseOrderById(int id);
        Task<PurchaseOrder> CreatePurchaseOrder(CreatePurchaseOrderDto dto, int createdByUserID);
        Task<PurchaseOrderItem> AddItem(int purchaseOrderID, AddPurchaseOrderItemDto dto);
        Task<PurchaseOrder> ApprovePurchaseOrder(int id);
        Task<PurchaseOrder> SendPurchaseOrder(int id);
        Task<PurchaseOrder> ReceivePurchaseOrder(int id, ReceivePurchaseOrderDto dto);
        Task<PurchaseOrder> ClosePurchaseOrder(int id);
        Task<object> GetDeliveryStatus(int id);
    }
}