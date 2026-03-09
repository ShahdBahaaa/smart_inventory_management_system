using Xunit;
using Microsoft.EntityFrameworkCore;
using SmartInventoryManagementSystem.Infrastructure.Data;
using SmartInventoryManagementSystem.Infrastructure.Services;
using SmartInventoryManagementSystem.API.Controllers;
using SmartInventoryManagementSystem.Application.DTOs.User;
using SmartInventoryManagementSystem.Domain.Entities;
using SmartInventoryManagementSystem.Domain.Enums;

namespace SmartInventoryManagementSystem.Tests
{
    public class UsersControllerTests
    {
        private AppDbContext GetInMemoryDb()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new AppDbContext(options);
        }

        [Fact]
        public async Task GetUsers_ReturnsAllActiveUsers()
        {
            // Arrange
            var db = GetInMemoryDb();
            db.Users.AddRange(
                new User { UserID = 1, Name = "User1", Email = "user1@test.com", PasswordHash = "hash", Role = UserRole.ADMIN, IsDeleted = false },
                new User { UserID = 2, Name = "User2", Email = "user2@test.com", PasswordHash = "hash", Role = UserRole.INVENTORY_MANAGER, IsDeleted = true }
            );
            await db.SaveChangesAsync();

            var service = new UserService(db);
            var controller = new UsersController(service);

            // Act
            var result = await controller.GetUsers();

            // Assert
            var okResult = Assert.IsType<Microsoft.AspNetCore.Mvc.OkObjectResult>(result);
            var users = Assert.IsType<List<User>>(okResult.Value);
            Assert.Single(users);
        }

        [Fact]
        public async Task GetUser_ExistingId_ReturnsUser()
        {
            // Arrange
            var db = GetInMemoryDb();
            db.Users.Add(new User { UserID = 1, Name = "User1", Email = "user1@test.com", PasswordHash = "hash", Role = UserRole.ADMIN, IsDeleted = false });
            await db.SaveChangesAsync();

            var service = new UserService(db);
            var controller = new UsersController(service);

            // Act
            var result = await controller.GetUser(1);

            // Assert
            var okResult = Assert.IsType<Microsoft.AspNetCore.Mvc.OkObjectResult>(result);
            var user = Assert.IsType<User>(okResult.Value);
            Assert.Equal("User1", user.Name);
        }

        [Fact]
        public async Task GetUser_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            var db = GetInMemoryDb();
            var service = new UserService(db);
            var controller = new UsersController(service);

            // Act
            var result = await controller.GetUser(999);

            // Assert
            Assert.IsType<Microsoft.AspNetCore.Mvc.NotFoundResult>(result);
        }

        [Fact]
        public async Task CreateUser_ValidData_ReturnsUser()
        {
            // Arrange
            var db = GetInMemoryDb();
            var service = new UserService(db);
            var controller = new UsersController(service);

            // Act
            var result = await controller.CreateUser(new CreateUserDto
            {
                Name = "New User",
                Email = "newuser@test.com",
                Password = "password123",
                Role = UserRole.INVENTORY_MANAGER
            });

            // Assert
            var okResult = Assert.IsType<Microsoft.AspNetCore.Mvc.OkObjectResult>(result);
            var user = Assert.IsType<User>(okResult.Value);
            Assert.Equal("New User", user.Name);
        }

        [Fact]
        public async Task DeleteUser_ExistingId_SoftDeletes()
        {
            // Arrange
            var db = GetInMemoryDb();
            db.Users.Add(new User { UserID = 1, Name = "User1", Email = "user1@test.com", PasswordHash = "hash", Role = UserRole.ADMIN, IsDeleted = false });
            await db.SaveChangesAsync();

            var service = new UserService(db);
            var controller = new UsersController(service);

            // Act
            var result = await controller.DeleteUser(1);

            // Assert
            Assert.IsType<Microsoft.AspNetCore.Mvc.NoContentResult>(result);
            var user = await db.Users.FindAsync(1);
            Assert.True(user!.IsDeleted);
        }
    }
}
