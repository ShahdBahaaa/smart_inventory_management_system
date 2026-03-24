namespace SmartInventoryManagementSystem.Application.DTOs.Supplier
{
    public class UpdateSupplierDto
    {
        public string? Name { get; set; }
        public string? ContactPerson { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public int? LeadTime { get; set; }
        public bool? IsActive { get; set; }
    }
}
