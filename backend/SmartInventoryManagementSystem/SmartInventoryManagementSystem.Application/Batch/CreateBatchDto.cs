namespace SmartInventoryManagementSystem.Application.DTOs.Batch
{
    public class CreateBatchDto
    {
        public string LotNumber { get; set; } = string.Empty;
        public DateTime ExpiryDate { get; set; }
        public int Quantity { get; set; }
        public DateTime ReceivedDate { get; set; }
    }
}