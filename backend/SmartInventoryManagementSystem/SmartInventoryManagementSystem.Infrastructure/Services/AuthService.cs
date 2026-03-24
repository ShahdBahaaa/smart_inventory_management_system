using Microsoft.EntityFrameworkCore;
using SmartInventoryManagementSystem.Application.DTOs;
using SmartInventoryManagementSystem.Application.Interfaces;
using SmartInventoryManagementSystem.Domain.Entities;
using SmartInventoryManagementSystem.Domain.Enums;
using SmartInventoryManagementSystem.Infrastructure.Data;

namespace SmartInventoryManagementSystem.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IJwtService _jwtService;

        public AuthService(AppDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task<LoginResponseDto> Login(LoginRequestDto request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email && !u.IsDeleted);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Invalid email or password");

            if (user.Status == UserStatus.INACTIVE)
                throw new UnauthorizedAccessException("Account is inactive");

            if (user.Status == UserStatus.PENDING)
                throw new UnauthorizedAccessException("Account is pending approval");

            var accessToken = _jwtService.GenerateAccessToken(user);
            var refreshToken = _jwtService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(7);
            user.LastLogin = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new LoginResponseDto
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
            };
        }

        public async Task<int> Register(RegisterRequestDto request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                throw new InvalidOperationException("Email already exists");

            if (request.Role != "BUSINESS_OWNER" &&
                request.Role != "INVENTORY_MANAGER" &&
                request.Role != "WAREHOUSE_STAFF")
                throw new InvalidOperationException("Invalid role for registration");

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = Enum.Parse<UserRole>(request.Role),
                Status = UserStatus.PENDING,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user.UserID;
        }

        public async Task<RefreshTokenResponseDto> RefreshToken(RefreshTokenRequestDto request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.RefreshToken == request.RefreshToken && !u.IsDeleted);

            if (user == null)
                throw new UnauthorizedAccessException("Invalid refresh token");

            if (user.RefreshTokenExpiresAt < DateTime.UtcNow)
                throw new UnauthorizedAccessException("Refresh token has expired");

            var newAccessToken = _jwtService.GenerateAccessToken(user);
            var newRefreshToken = _jwtService.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(7);

            await _context.SaveChangesAsync();

            return new RefreshTokenResponseDto
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(60)
            };
        }

        public async Task Logout(int userId)
        {
            var user = await _context.Users.FindAsync(userId)
                ?? throw new KeyNotFoundException("User not found");

            user.RefreshToken = null;
            user.RefreshTokenExpiresAt = null;

            await _context.SaveChangesAsync();
        }
    }
}