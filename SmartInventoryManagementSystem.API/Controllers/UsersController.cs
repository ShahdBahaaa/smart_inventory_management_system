using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartInventoryManagementSystem.Application.DTOs.User;
using SmartInventoryManagementSystem.Application.Interfaces;

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

        // GET /api/users
        [HttpGet]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _service.GetAllUsers();
            return Ok(users);
        }

        // GET /api/users/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _service.GetUserById(id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // POST /api/users
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> CreateUser(CreateUserDto dto)
        {
            var user = await _service.CreateUser(dto);
            return Ok(user);
        }

        // PUT /api/users/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto dto)
        {
            var user = await _service.UpdateUser(id, dto);
            return Ok(user);
        }

        // DELETE /api/users/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _service.DeleteUser(id);
            return NoContent();
        }

        // GET /api/users/me
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var claim = User.FindFirst("id");

            if (claim == null || !int.TryParse(claim.Value, out var userId))
                return Unauthorized();

            var user = await _service.GetCurrentUser(userId);

            return Ok(user);
        }

        // PUT /api/users/me
        [HttpPut("me")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
        {
            var claim = User.FindFirst("id");

            if (claim == null || !int.TryParse(claim.Value, out var userId))
                return Unauthorized();

            var user = await _service.UpdateProfile(userId, dto);

            return Ok(user);
        }

        // PUT /api/users/me/password
        [HttpPut("me/password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
        {
            var claim = User.FindFirst("id");

            if (claim == null || !int.TryParse(claim.Value, out var userId))
                return Unauthorized();

            await _service.ChangePassword(userId, dto);

            return Ok();
        }
    }
}