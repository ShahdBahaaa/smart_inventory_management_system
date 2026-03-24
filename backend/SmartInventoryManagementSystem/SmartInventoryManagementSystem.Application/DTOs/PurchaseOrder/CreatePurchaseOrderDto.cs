namespace SmartInventoryManagementSystem.Application.DTOs.PurchaseOrder
{
    public class CreatePurchaseOrderDto
    {
        public int SupplierID { get; set; }
        public DateTime ExpectedDeliveryDate { get; set; }
        public string? Notes { get; set; }
    }

    public class AddPurchaseOrderItemDto
    {
        public int ProductID { get; set; }
        public int OrderedQuantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    public class ReceivePurchaseOrderDto
    {
        public List<ReceiveItemDto> Items { get; set; } = new();
    }

    public class ReceiveItemDto
    {
        public int PurchaseOrderItemID { get; set; }
        public int ReceivedQuantity { get; set; }
        public string? LotNumber { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }
}