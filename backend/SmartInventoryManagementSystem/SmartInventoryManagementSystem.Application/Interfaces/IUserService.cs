using SmartInventoryManagementSystem.Application.DTOs.User;
using SmartInventoryManagementSystem.Domain.Enums;

namespace SmartInventoryManagementSystem.Application.Interfaces
{
    public interface IUserService
    {
        Task<List<UserResponseDto>> GetAllUsers(UserRole? role = null, UserStatus? status = null);
        Task<UserResponseDto?> GetUserById(int id);
        Task<UserResponseDto> CreateUser(CreateUserDto dto);
        Task<UserResponseDto> UpdateUser(int id, UpdateUserDto dto);
        Task DeleteUser(int id);
        Task<UserResponseDto?> GetCurrentUser(int id);
        Task<UserResponseDto> UpdateProfile(int id, UpdateProfileDto dto);
        Task ChangePassword(int id, ChangePasswordDto dto);
        Task ApproveUser(int id);
        Task RejectUser(int id);
    }
}