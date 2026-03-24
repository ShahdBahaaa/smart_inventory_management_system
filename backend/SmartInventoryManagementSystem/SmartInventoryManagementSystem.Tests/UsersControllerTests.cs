using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using SmartInventoryManagementSystem.API.Controllers;
using SmartInventoryManagementSystem.Application.DTOs.User;
using SmartInventoryManagementSystem.Application.Interfaces;
using SmartInventoryManagementSystem.Domain.Enums;
using System.Security.Claims;
using Xunit;

namespace SmartInventoryManagementSystem.Tests
{
    public class UsersControllerTests
    {
        private readonly Mock<IUserService> _serviceMock;
        private readonly UsersController _controller;

        public UsersControllerTests()
        {
            _serviceMock = new Mock<IUserService>();
            _controller = new UsersController(_serviceMock.Object);

            // simulate logged in BUSINESS_OWNER
            var claims = new List<Claim>
            {
                new Claim("id", "1"),
                new Claim(ClaimTypes.Role, "BUSINESS_OWNER")
            };
            var identity = new ClaimsIdentity(claims, "Test");
            var principal = new ClaimsPrincipal(identity);
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principal }
            };
        }

        [Fact]
        public async Task GetUser_ExistingId_ReturnsUser()
        {
            var userDto = new UserResponseDto
            {
                UserID = 1,
                Name = "User1",
                Email = "user1@test.com",
                Role = "ADMIN",
                Status = "ACTIVE"
            };

            _serviceMock.Setup(s => s.GetUserById(1)).ReturnsAsync(userDto);

            var result = await _controller.GetUser(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var user = Assert.IsType<UserResponseDto>(okResult.Value);
            Assert.Equal("User1", user.Name);
        }

        [Fact]
        public async Task GetUser_NonExistingId_ReturnsNotFound()
        {
            _serviceMock.Setup(s => s.GetUserById(999)).ReturnsAsync((UserResponseDto?)null);

            var result = await _controller.GetUser(999);

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task CreateUser_ValidData_ReturnsUser()
        {
            var dto = new CreateUserDto
            {
                Name = "New User",
                Email = "newuser@test.com",
                Password = "Password1!",
                Role = UserRole.INVENTORY_MANAGER
            };

            var userDto = new UserResponseDto
            {
                UserID = 1,
                Name = "New User",
                Email = "newuser@test.com",
                Role = "INVENTORY_MANAGER",
                Status = "ACTIVE"
            };

            _serviceMock.Setup(s => s.CreateUser(It.IsAny<CreateUserDto>())).ReturnsAsync(userDto);

            var result = await _controller.CreateUser(dto);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var user = Assert.IsType<UserResponseDto>(okResult.Value);
            Assert.Equal("New User", user.Name);
        }

        [Fact]
        public async Task CreateUser_DuplicateEmail_ThrowsException()
        {
            _serviceMock
                .Setup(s => s.CreateUser(It.IsAny<CreateUserDto>()))
                .ThrowsAsync(new InvalidOperationException("Email already exists"));

            await Assert.ThrowsAsync<InvalidOperationException>(() =>
                _controller.CreateUser(new CreateUserDto
                {
                    Name = "User",
                    Email = "existing@test.com",
                    Password = "Password1!",
                    Role = UserRole.INVENTORY_MANAGER
                }));
        }

        [Fact]
        public async Task DeleteUser_ExistingId_ReturnsNoContent()
        {
            _serviceMock.Setup(s => s.DeleteUser(1)).Returns(Task.CompletedTask);

            var result = await _controller.DeleteUser(1);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteUser_NonExistingId_ThrowsException()
        {
            _serviceMock.Setup(s => s.DeleteUser(999))
                .ThrowsAsync(new KeyNotFoundException("User not found"));

            await Assert.ThrowsAsync<KeyNotFoundException>(() =>
                _controller.DeleteUser(999));
        }

        [Fact]
        public async Task ApproveUser_PendingUser_ReturnsOk()
        {
            var pendingUser = new UserResponseDto
            {
                UserID = 2,
                Name = "Pending User",
                Email = "pending@test.com",
                Role = UserRole.INVENTORY_MANAGER.ToString(),
                Status = UserStatus.PENDING.ToString()
            };

            _serviceMock.Setup(s => s.GetUserById(2)).ReturnsAsync(pendingUser);
            _serviceMock.Setup(s => s.ApproveUser(2)).Returns(Task.CompletedTask);

            var result = await _controller.ApproveUser(2);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task ApproveUser_NonPendingUser_ReturnsBadRequest()
        {
            var activeUser = new UserResponseDto
            {
                UserID = 1,
                Name = "Active User",
                Email = "active@test.com",
                Role = UserRole.INVENTORY_MANAGER.ToString(),
                Status = UserStatus.ACTIVE.ToString()
            };

            _serviceMock.Setup(s => s.GetUserById(1)).ReturnsAsync(activeUser);

            var result = await _controller.ApproveUser(1);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task RejectUser_PendingUser_ReturnsOk()
        {
            var pendingUser = new UserResponseDto
            {
                UserID = 3,
                Name = "Pending User",
                Email = "pending2@test.com",
                Role = UserRole.WAREHOUSE_STAFF.ToString(),
                Status = UserStatus.PENDING.ToString()
            };

            _serviceMock.Setup(s => s.GetUserById(3)).ReturnsAsync(pendingUser);
            _serviceMock.Setup(s => s.RejectUser(3)).Returns(Task.CompletedTask);

            var result = await _controller.RejectUser(3);

            Assert.IsType<OkObjectResult>(result);
        }
    }
}