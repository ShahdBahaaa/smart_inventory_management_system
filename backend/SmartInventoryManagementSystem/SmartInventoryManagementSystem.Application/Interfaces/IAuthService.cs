using SmartInventoryManagementSystem.Application.DTOs;

namespace SmartInventoryManagementSystem.Application.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto> Login(LoginRequestDto request);
        Task<int> Register(RegisterRequestDto request);
        Task<RefreshTokenResponseDto> RefreshToken(RefreshTokenRequestDto request);
        Task Logout(int userId);
    }
}