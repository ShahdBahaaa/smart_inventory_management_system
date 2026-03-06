using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartInventoryManagementSystem.API.Filters;
using SmartInventoryManagementSystem.Domain.Enums;
using SmartInventoryManagementSystem.Infrastructure.Data;

namespace SmartInventoryManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // ADMIN only
        [HttpGet]
        [AuthorizeRoles(UserRole.ADMIN)]
        public async Task<IActionResult> GetAll()
        {
            var users = await _context.Users
                .Select(u => new {
                    u.UserID,
                    u.Name,
                    u.Email,
                    Role = u.Role.ToString(),
                    Status = u.Status.ToString(),
                    u.CreatedAt,
                    u.LastLogin
                }).ToListAsync();
            return Ok(users);
        }

        // ADMIN only
        [HttpPut("{id}/deactivate")]
        [AuthorizeRoles(UserRole.ADMIN)]
        public async Task<IActionResult> Deactivate(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            user.Status = UserStatus.INACTIVE;
            await _context.SaveChangesAsync();
            return Ok(new { message = "User deactivated" });
        }

        // Any authenticated user
        [HttpGet("me")]
        [AuthorizeRoles(UserRole.ADMIN, UserRole.BUSINESS_OWNER,
                        UserRole.INVENTORY_MANAGER, UserRole.WAREHOUSE_STAFF)]
        public async Task<IActionResult> GetMe()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            var user = await _context.Users.FindAsync(int.Parse(userIdClaim.Value));
            if (user == null) return NotFound();

            return Ok(new
            {
                user.UserID,
                user.Name,
                user.Email,
                Role = user.Role.ToString(),
                Status = user.Status.ToString()
            });
        }
    }
}