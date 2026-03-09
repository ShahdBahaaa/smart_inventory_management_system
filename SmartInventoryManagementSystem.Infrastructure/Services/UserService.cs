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

        public async Task<List<User>> GetAllUsers()
        {
            return await _context.Users
                .Where(u => !u.IsDeleted)
                .ToListAsync();
        }

        public async Task<User?> GetUserById(int id)
        {
            return await _context.Users
                .FirstOrDefaultAsync(x => x.UserID == id && !x.IsDeleted);
        }

        public async Task<User> CreateUser(CreateUserDto dto)
        {
            var user = new User
            {
                Name = dto.Name ?? "",
                Email = dto.Email ?? "",
                Role = dto.Role,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password ?? "")
            };

            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<User> UpdateUser(int id, UpdateUserDto dto)
        {
            var user = await GetUserById(id);

            if (user == null)
                throw new Exception("User not found");

            user.Name = dto.Name ?? user.Name;
            user.Email = dto.Email ?? user.Email;

            user.Role = Enum.TryParse<UserRole>(dto.Role, true, out var role)
                ? role
                : user.Role;

            await _context.SaveChangesAsync();

            return user;
        }

        public async Task DeleteUser(int id)
        {
            var user = await GetUserById(id);

            if (user == null)
                throw new Exception("User not found");

            user.IsDeleted = true;

            await _context.SaveChangesAsync();
        }

        public async Task<User?> GetCurrentUser(int id)
        {
            return await GetUserById(id);
        }

        public async Task<User> UpdateProfile(int id, UpdateProfileDto dto)
        {
            var user = await GetUserById(id);

            if (user == null)
                throw new Exception("User not found");

            user.Name = dto.Name ?? user.Name;
            user.Email = dto.Email ?? user.Email;

            await _context.SaveChangesAsync();

            return user;
        }

        public async Task ChangePassword(int id, ChangePasswordDto dto)
        {
            var user = await GetUserById(id);

            if (user == null)
                throw new Exception("User not found");

            var valid = BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.PasswordHash);

            if (!valid)
                throw new Exception("Wrong password");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            await _context.SaveChangesAsync();
        }
    }
}