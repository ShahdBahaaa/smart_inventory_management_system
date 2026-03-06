using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartInventoryManagementSystem.API.Filters;
using SmartInventoryManagementSystem.Application.DTOs;
using SmartInventoryManagementSystem.Application.Services;
using SmartInventoryManagementSystem.Domain.Entities;
using SmartInventoryManagementSystem.Domain.Enums;
using SmartInventoryManagementSystem.Infrastructure.Data;

namespace SmartInventoryManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IJwtService _jwtService;

        public AuthController(AppDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password" });

            if (user.Status == UserStatus.INACTIVE)
                return Unauthorized(new { message = "Account is inactive" });

            var accessToken = _jwtService.GenerateAccessToken(user);
            var refreshToken = _jwtService.GenerateRefreshToken();

            user.LastLogin = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new LoginResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(60),
                User = new UserDto
                {
                    UserID = user.UserID,
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role.ToString()
                }
            });
        }

        [HttpPost("register")]
        [AuthorizeRoles(UserRole.ADMIN)]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest(new { message = "Email already exists" });

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = Enum.Parse<UserRole>(request.Role),
                Status = UserStatus.ACTIVE,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User created successfully", userId = user.UserID });
        }
    }
}