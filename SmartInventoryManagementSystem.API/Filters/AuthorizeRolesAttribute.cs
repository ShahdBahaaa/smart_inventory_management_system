using Microsoft.AspNetCore.Authorization;
using SmartInventoryManagementSystem.Domain.Enums;

namespace SmartInventoryManagementSystem.API.Filters
{
    public class AuthorizeRolesAttribute : AuthorizeAttribute
    {
        public AuthorizeRolesAttribute(params UserRole[] roles)
        {
            Roles = string.Join(",", roles.Select(r => r.ToString()));
        }
    }
}