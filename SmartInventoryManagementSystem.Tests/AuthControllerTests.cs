using Xunit;
using Moq;
using Microsoft.EntityFrameworkCore;
using SmartInventoryManagementSystem.Infrastructure.Data;
using SmartInventoryManagementSystem.Application.Interfaces;
using SmartInventoryManagementSystem.API.Controllers;
using SmartInventoryManagementSystem.Application.DTOs;
using SmartInventoryManagementSystem.Domain.Entities;
using SmartInventoryManagementSystem.Domain.Enums;

namespace SmartInventoryManagementSystem.Tests
{
    public class AuthControllerTests
    {
        private AppDbContext GetInMemoryDb()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new AppDbContext(options);
        }

        [Fact]
        public async Task Login_ValidCredentials_ReturnsOk()
        {
            // Arrange
            var db = GetInMemoryDb();
            var jwtMock = new Mock<IJwtService>();
            jwtMock.Setup(j => j.GenerateAccessToken(It.IsAny<User>())).Returns("fake-token");
            jwtMock.Setup(j => j.GenerateRefreshToken()).Returns("fake-refresh");

            db.Users.Add(new User
            {
                UserID = 1,
                Name = "Admin",
                Email = "admin@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin1234"),
                Role = UserRole.ADMIN,
                Status = UserStatus.ACTIVE
            });
            await db.SaveChangesAsync();

            var controller = new AuthController(db, jwtMock.Object);

            // Act
            var result = await controller.Login(new LoginRequestDto
            {
                Email = "admin@test.com",
                Password = "admin1234"
            });

            // Assert
            var okResult = Assert.IsType<Microsoft.AspNetCore.Mvc.OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task Login_InvalidPassword_ReturnsUnauthorized()
        {
            // Arrange
            var db = GetInMemoryDb();
            var jwtMock = new Mock<IJwtService>();

            db.Users.Add(new User
            {
                UserID = 1,
                Name = "Admin",
                Email = "admin@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin1234"),
                Role = UserRole.ADMIN,
                Status = UserStatus.ACTIVE
            });
            await db.SaveChangesAsync();

            var controller = new AuthController(db, jwtMock.Object);

            // Act
            var result = await controller.Login(new LoginRequestDto
            {
                Email = "admin@test.com",
                Password = "wrongpassword"
            });

            // Assert
            Assert.IsType<Microsoft.AspNetCore.Mvc.UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async Task Login_InactiveUser_ReturnsUnauthorized()
        {
            // Arrange
            var db = GetInMemoryDb();
            var jwtMock = new Mock<IJwtService>();

            db.Users.Add(new User
            {
                UserID = 1,
                Name = "Admin",
                Email = "admin@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin1234"),
                Role = UserRole.ADMIN,
                Status = UserStatus.INACTIVE
            });
            await db.SaveChangesAsync();

            var controller = new AuthController(db, jwtMock.Object);

            // Act
            var result = await controller.Login(new LoginRequestDto
            {
                Email = "admin@test.com",
                Password = "admin1234"
            });

            // Assert
            Assert.IsType<Microsoft.AspNetCore.Mvc.UnauthorizedObjectResult>(result);
        }
    }
}