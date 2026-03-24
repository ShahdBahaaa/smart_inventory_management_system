using SmartInventoryManagementSystem.Domain.Enums;

namespace SmartInventoryManagementSystem.Application.DTOs.User
{
    public class UpdateUserDto
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; }
        public string? Status { get; set; }
    }
}