using System.ComponentModel.DataAnnotations;

namespace SmartInventoryManagementSystem.Application.DTOs.User
{
    public class UpdateProfileDto
    {
        [MinLength(2, ErrorMessage = "Name must be at least 2 characters")]
        public string? Name { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string? Email { get; set; }
    }
}