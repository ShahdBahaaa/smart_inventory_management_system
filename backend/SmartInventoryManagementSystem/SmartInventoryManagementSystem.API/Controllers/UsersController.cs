using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartInventoryManagementSystem.API.Filters;
using SmartInventoryManagementSystem.Application.DTOs.User;
using SmartInventoryManagementSystem.Application.Interfaces;
using SmartInventoryManagementSystem.Domain.Enums;
using System.Security.Claims;

namespace SmartInventoryManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _service;

        public UsersController(IUserService service)
        {
            _service = service;
        }

        [HttpGet]
        [AuthorizeRoles(UserRole.ADMIN, UserRole.BUSINESS_OWNER)]
        public async Task<IActionResult> GetUsers()
        {
            var callerRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (callerRole == "ADMIN")
                return Ok(await _service.GetAllUsers(role: UserRole.BUSINESS_OWNER));

            return Ok(await _service.GetAllUsers(role: UserRole.INVENTORY_MANAGER));
        }

        [HttpGet("pending")]
        [AuthorizeRoles(UserRole.ADMIN, UserRole.BUSINESS_OWNER)]
        public async Task<IActionResult> GetPendingUsers()
        {
            var callerRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (callerRole == "ADMIN")
                return Ok(await _service.GetAllUsers(role: UserRole.BUSINESS_OWNER, status: UserStatus.PENDING));

            return Ok(await _service.GetAllUsers(role: UserRole.INVENTORY_MANAGER, status: UserStatus.PENDING));
        }

        [HttpGet("my-profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var user = await _service.GetCurrentUser(userId.Value);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpGet("{id}")]
        [AuthorizeRoles(UserRole.ADMIN, UserRole.BUSINESS_OWNER)]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _service.GetUserById(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPost]
        [AuthorizeRoles(UserRole.ADMIN, UserRole.BUSINESS_OWNER)]
        public async Task<IActionResult> CreateUser(CreateUserDto dto)
        {
            var callerRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (callerRole == "ADMIN" && dto.Role != UserRole.BUSINESS_OWNER)
                return Forbid();

            if (callerRole == "BUSINESS_OWNER" &&
                dto.Role != UserRole.INVENTORY_MANAGER &&
                dto.Role != UserRole.WAREHOUSE_STAFF)
                return Forbid();

            var user = await _service.CreateUser(dto);
            return CreatedAtAction(nameof(GetUser), new { id = user.UserID }, user);
        }

        [HttpPut("my-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var user = await _service.UpdateProfile(userId.Value, dto);
            return Ok(user);
        }

        [HttpPut("my-profile/password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            await _service.ChangePassword(userId.Value, dto);
            return Ok(new { message = "Password changed successfully" });
        }

        [HttpPut("{id}")]
        [AuthorizeRoles(UserRole.BUSINESS_OWNER)]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto dto)
        {
            if (dto.Role == UserRole.ADMIN.ToString() ||
                dto.Role == UserRole.BUSINESS_OWNER.ToString())
                return Forbid();

            var user = await _service.UpdateUser(id, dto);
            return Ok(user);
        }

        [HttpPut("{id}/approve")]
        [AuthorizeRoles(UserRole.ADMIN, UserRole.BUSINESS_OWNER)]
        public async Task<IActionResult> ApproveUser(int id)
        {
            var callerRole = User.FindFirst(ClaimTypes.Role)?.Value;

            var user = await _service.GetUserById(id);
            if (user == null) return NotFound(new { message = "User not found" });

            if (user.Status != UserStatus.PENDING.ToString())
                return BadRequest(new { message = "User is not pending approval" });

            if (callerRole == "ADMIN" && user.Role != UserRole.BUSINESS_OWNER.ToString())
                return Forbid();

            if (callerRole == "BUSINESS_OWNER" &&
                user.Role != UserRole.INVENTORY_MANAGER.ToString() &&
                user.Role != UserRole.WAREHOUSE_STAFF.ToString())
                return Forbid();

            await _service.ApproveUser(id);
            return Ok(new { message = "User approved successfully" });
        }

        [HttpPut("{id}/reject")]
        [AuthorizeRoles(UserRole.ADMIN, UserRole.BUSINESS_OWNER)]
        public async Task<IActionResult> RejectUser(int id)
        {
            var callerRole = User.FindFirst(ClaimTypes.Role)?.Value;

            var user = await _service.GetUserById(id);
            if (user == null) return NotFound(new { message = "User not found" });

            if (user.Status != UserStatus.PENDING.ToString())
                return BadRequest(new { message = "User is not pending approval" });

            if (callerRole == "ADMIN" && user.Role != UserRole.BUSINESS_OWNER.ToString())
                return Forbid();

            if (callerRole == "BUSINESS_OWNER" &&
                user.Role != UserRole.INVENTORY_MANAGER.ToString() &&
                user.Role != UserRole.WAREHOUSE_STAFF.ToString())
                return Forbid();

            await _service.RejectUser(id);
            return Ok(new { message = "User rejected successfully" });
        }

        [HttpDelete("{id}")]
        [AuthorizeRoles(UserRole.BUSINESS_OWNER)]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _service.DeleteUser(id);
            return NoContent();
        }

        // helper خاص — بيجيب الـ userId من الـ token
        private int? GetUserId()
        {
            var claim = User.FindFirst("id");
            if (claim == null || !int.TryParse(claim.Value, out var userId))
                return null;
            return userId;
        }
    }
}