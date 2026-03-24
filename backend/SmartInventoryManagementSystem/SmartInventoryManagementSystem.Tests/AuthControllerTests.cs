using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using SmartInventoryManagementSystem.Application.Interfaces;
using SmartInventoryManagementSystem.API.Controllers;
using SmartInventoryManagementSystem.Application.DTOs;

namespace SmartInventoryManagementSystem.Tests
{
    public class AuthControllerTests
    {
        private readonly Mock<IAuthService> _authServiceMock;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            _authServiceMock = new Mock<IAuthService>();
            _controller = new AuthController(_authServiceMock.Object);
        }

        [Fact]
        public async Task Login_ValidCredentials_ReturnsOk()
        {
            // Arrange
            var loginResponse = new LoginResponseDto
            {
                AccessToken = "fake-access-token",
                RefreshToken = "fake-refresh-token",
                ExpiresAt = DateTime.UtcNow.AddMinutes(60),
                User = new UserDto { UserID = 1, Name = "Admin", Email = "admin@test.com", Role = "ADMIN" }
            };

            _authServiceMock
                .Setup(s => s.Login(It.IsAny<LoginRequestDto>()))
                .ReturnsAsync(loginResponse);

            // Act
            var result = await _controller.Login(new LoginRequestDto
            {
                Email = "admin@test.com",
                Password = "Admin1234!"
            });

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task Login_InvalidPassword_ReturnsUnauthorized()
        {
            // Arrange
            _authServiceMock
                .Setup(s => s.Login(It.IsAny<LoginRequestDto>()))
                .ThrowsAsync(new UnauthorizedAccessException("Invalid email or password"));

            // Act
            var result = await _controller.Login(new LoginRequestDto
            {
                Email = "admin@test.com",
                Password = "wrongpassword"
            });

            // Assert
            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async Task Login_InactiveUser_ReturnsUnauthorized()
        {
            // Arrange
            _authServiceMock
                .Setup(s => s.Login(It.IsAny<LoginRequestDto>()))
                .ThrowsAsync(new UnauthorizedAccessException("Account is inactive"));

            // Act
            var result = await _controller.Login(new LoginRequestDto
            {
                Email = "admin@test.com",
                Password = "Admin1234!"
            });

            // Assert
            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async Task Login_PendingUser_ReturnsUnauthorized()
        {
            // Arrange
            _authServiceMock
                .Setup(s => s.Login(It.IsAny<LoginRequestDto>()))
                .ThrowsAsync(new UnauthorizedAccessException("Account is pending approval"));

            // Act
            var result = await _controller.Login(new LoginRequestDto
            {
                Email = "pending@test.com",
                Password = "Admin1234!"
            });

            // Assert
            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async Task Register_ValidRequest_ReturnsOk()
        {
            // Arrange
            _authServiceMock
                .Setup(s => s.Register(It.IsAny<RegisterRequestDto>()))
                .ReturnsAsync(1);

            // Act
            var result = await _controller.Register(new RegisterRequestDto
            {
                Name = "Test User",
                Email = "test@test.com",
                Password = "Test1234!",
                Role = "INVENTORY_MANAGER"
            });

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task Register_DuplicateEmail_ReturnsBadRequest()
        {
            // Arrange
            _authServiceMock
                .Setup(s => s.Register(It.IsAny<RegisterRequestDto>()))
                .ThrowsAsync(new InvalidOperationException("Email already exists"));

            // Act
            var result = await _controller.Register(new RegisterRequestDto
            {
                Name = "Test User",
                Email = "existing@test.com",
                Password = "Test1234!",
                Role = "INVENTORY_MANAGER"
            });

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task RefreshToken_ValidToken_ReturnsOk()
        {
            // Arrange
            var refreshResponse = new RefreshTokenResponseDto
            {
                AccessToken = "new-access-token",
                RefreshToken = "new-refresh-token",
                ExpiresAt = DateTime.UtcNow.AddMinutes(60)
            };

            _authServiceMock
                .Setup(s => s.RefreshToken(It.IsAny<RefreshTokenRequestDto>()))
                .ReturnsAsync(refreshResponse);

            // Act
            var result = await _controller.Refresh(new RefreshTokenRequestDto
            {
                RefreshToken = "valid-refresh-token"
            });

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task RefreshToken_ExpiredToken_ReturnsUnauthorized()
        {
            // Arrange
            _authServiceMock
                .Setup(s => s.RefreshToken(It.IsAny<RefreshTokenRequestDto>()))
                .ThrowsAsync(new UnauthorizedAccessException("Refresh token has expired"));

            // Act
            var result = await _controller.Refresh(new RefreshTokenRequestDto
            {
                RefreshToken = "expired-token"
            });

            // Assert
            Assert.IsType<UnauthorizedObjectResult>(result);
        }
    }
}