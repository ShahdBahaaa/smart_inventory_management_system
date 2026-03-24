using Microsoft.EntityFrameworkCore;
using SmartInventoryManagementSystem.Application.DTOs.User;
using SmartInventoryManagementSystem.Application.Interfaces;
using SmartInventoryManagementSystem.Domain.Entities;
using SmartInventoryManagementSystem.Domain.Enums;
using SmartInventoryManagementSystem.Infrastructure.Data;

namespace SmartInventoryManagementSystem.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        // mapping مرة واحدة بس — مش بنكررها
        private static UserResponseDto ToDto(User user) => new()
        {
            UserID = user.UserID,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role.ToString(),
            Status = user.Status.ToString(),
            CreatedAt = user.CreatedAt,
            LastLogin = user.LastLogin
        };

        public async Task<List<UserResponseDto>> GetAllUsers(UserRole? role = null, UserStatus? status = null)
        {
            var query = _context.Users.Where(u => !u.IsDeleted);

            if (role.HasValue)
                query = query.Where(u => u.Role == role);

            if (status.HasValue)
                query = query.Where(u => u.Status == status);

            return await query.Select(u => new UserResponseDto
            {
                UserID = u.UserID,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role.ToString(),
                Status = u.Status.ToString(),
                CreatedAt = u.CreatedAt,
                LastLogin = u.LastLogin
            }).ToListAsync();
        }

        public async Task<UserResponseDto?> GetUserById(int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserID == id && !x.IsDeleted);

            return user == null ? null : ToDto(user);
        }

        public async Task<UserResponseDto> CreateUser(CreateUserDto dto)
        {
            // التحقق من Email مكرر
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                throw new InvalidOperationException("Email already exists");

            var user = new User
            {
                Name = dto.Name!,
                Email = dto.Email!,
                Role = dto.Role,
                Status = UserStatus.ACTIVE,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password!)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return ToDto(user);
        }

        public async Task<UserResponseDto> UpdateUser(int id, UpdateUserDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserID == id && !x.IsDeleted)
                ?? throw new KeyNotFoundException("User not found");

            user.Name = dto.Name ?? user.Name;
            user.Email = dto.Email ?? user.Email;

            if (!string.IsNullOrEmpty(dto.Role) &&
                Enum.TryParse<UserRole>(dto.Role, true, out var role))
                user.Role = role;

            await _context.SaveChangesAsync();
            return ToDto(user);
        }

        public async Task DeleteUser(int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserID == id && !x.IsDeleted)
                ?? throw new KeyNotFoundException("User not found");

            user.IsDeleted = true;
            await _context.SaveChangesAsync();
        }

        public async Task<UserResponseDto?> GetCurrentUser(int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserID == id && !x.IsDeleted);

            return user == null ? null : ToDto(user);
        }

        public async Task<UserResponseDto> UpdateProfile(int id, UpdateProfileDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserID == id && !x.IsDeleted)
                ?? throw new KeyNotFoundException("User not found");

            if (dto.Email != null && dto.Email != user.Email)
            {
                if (await _context.Users.AnyAsync(u => u.Email == dto.Email && u.UserID != id))
                    throw new InvalidOperationException("Email already in use");

                user.Email = dto.Email;
            }

            user.Name = dto.Name ?? user.Name;

            await _context.SaveChangesAsync();
            return ToDto(user);
        }

        public async Task ChangePassword(int id, ChangePasswordDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserID == id && !x.IsDeleted)
                ?? throw new KeyNotFoundException("User not found");

            if (!BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.PasswordHash))
                throw new InvalidOperationException("Wrong password");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();
        }

        public async Task ApproveUser(int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserID == id && !x.IsDeleted)
                ?? throw new KeyNotFoundException("User not found");

            user.Status = UserStatus.ACTIVE;
            await _context.SaveChangesAsync();
        }

        public async Task RejectUser(int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserID == id && !x.IsDeleted)
                ?? throw new KeyNotFoundException("User not found");

            user.IsDeleted = true;
            await _context.SaveChangesAsync();
        }
    }
}