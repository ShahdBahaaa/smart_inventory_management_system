using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartInventoryManagementSystem.Application.DTOs.User
{
    
    public class UpdateUserDto
    {
        public string? Name { get; set; }

        public string? Email { get; set; }

        public string? Role { get; set; }
    }
}
