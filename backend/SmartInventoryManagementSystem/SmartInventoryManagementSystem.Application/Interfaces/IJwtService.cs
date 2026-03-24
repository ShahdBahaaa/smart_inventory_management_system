using SmartInventoryManagementSystem.Domain.Entities;

namespace SmartInventoryManagementSystem.Application.Interfaces
{
    public interface IJwtService
    {
        string GenerateAccessToken(User user);
        string GenerateRefreshToken();
        bool ValidateRefreshToken(string refreshToken);
    }
}