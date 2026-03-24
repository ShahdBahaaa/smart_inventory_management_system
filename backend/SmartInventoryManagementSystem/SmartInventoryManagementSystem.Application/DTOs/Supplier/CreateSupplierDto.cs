using System.ComponentModel.DataAnnotations;

namespace SmartInventoryManagementSystem.Application.DTOs.Supplier
{
    public class CreateSupplierDto
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(200, ErrorMessage = "Name must not exceed 200 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Phone is required")]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;

        [StringLength(200)]
        public string ContactPerson { get; set; } = string.Empty;

        [StringLength(500)]
        public string Address { get; set; } = string.Empty;

        [Range(1, 365, ErrorMessage = "Lead time must be between 1 and 365 days")]
        public int LeadTime { get; set; }
    }
}