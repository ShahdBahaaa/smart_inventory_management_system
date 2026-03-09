using SmartInventoryManagementSystem.Application.DTOs.User;
using SmartInventoryManagementSystem.Domain.Entities;

namespace SmartInventoryManagementSystem.Application.Interfaces
{
    public interface IUserService
    {
        Task<List<User>> GetAllUsers();

        Task<User?> GetUserById(int id);

        Task<User> CreateUser(CreateUserDto dto);

        Task<User> UpdateUser(int id, UpdateUserDto dto);

        Task DeleteUser(int id);

        Task<User?> GetCurrentUser(int id);

        Task<User> UpdateProfile(int id, UpdateProfileDto dto);   // ⭐ دي اللي ناقصة

        Task ChangePassword(int id, ChangePasswordDto dto);
    }
}