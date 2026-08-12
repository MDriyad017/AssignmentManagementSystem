using AssignmentManagementSystem.BusinessLogicLayer.BLServices;
using AssignmentManagementSystem.BusinessLogicLayer.DTOs.User;
using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IRepositories;
using AssignmentManagementSystem.Tests.Unit.Helpers;
using AutoFixture;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.Tests.Unit.Services
{
    public class UserServiceTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly UserService _userService;

        public UserServiceTests()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _userService = new UserService(_userRepositoryMock.Object);
        }

        [Fact]
        public async Task GetUserByIdAsync_WhenUserExists_ReturnsUser()
        {
            var userId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var expectedUser = TestDataHelper.GetTestUsers().First(u => u.Id == userId);

            _userRepositoryMock.Setup(x => x.GetByIdAsync(userId))
                .ReturnsAsync(expectedUser);

            var result = await _userService.GetUserByIdAsync(userId);

            result.Should().NotBeNull();
            result.Id.Should().Be(userId);
            result.Email.Should().Be(expectedUser.Email);
            _userRepositoryMock.Verify(x => x.GetByIdAsync(userId), Times.Once);
        }

        [Fact]
        public async Task GetUserByIdAsync_WhenUserDoesNotExist_ReturnsNull()
        {
            var userId = Guid.NewGuid();
            _userRepositoryMock.Setup(x => x.GetByIdAsync(userId))
                .ReturnsAsync((User?)null);

            var result = await _userService.GetUserByIdAsync(userId);

            result.Should().BeNull();
            _userRepositoryMock.Verify(x => x.GetByIdAsync(userId), Times.Once);
        }

        [Fact]
        public async Task GetAllUsersAsync_ReturnsAllUsers()
        {
            var users = TestDataHelper.GetTestUsers();
            _userRepositoryMock.Setup(x => x.GetAllAsync())
                .ReturnsAsync(users);

            var result = await _userService.GetAllUsersAsync();

            result.Should().NotBeNull();
            result.Count().Should().Be(2);
            result.Should().NotContain(x => x.Role == "Admin");
            _userRepositoryMock.Verify(x => x.GetAllAsync(), Times.Once);
        }

        [Fact]
        public async Task CreateUserAsync_WhenEmailAlreadyExists_ThrowsException()
        {
            var existingUser = TestDataHelper.GetTestUsers().First();
            var createDto = new UserCreateDto
            {
                FirstName = "New",
                LastName = "User",
                Email = existingUser.Email,
                Password = "Password123",
                Role = "Student"
            };

            _userRepositoryMock.Setup(x => x.ExistsByEmailAsync(createDto.Email))
                .ReturnsAsync(true);

            await Assert.ThrowsAsync<Exception>(() => _userService.CreateUserAsync(createDto));
            _userRepositoryMock.Verify(x => x.ExistsByEmailAsync(createDto.Email), Times.Once);
            _userRepositoryMock.Verify(x => x.AddAsync(It.IsAny<User>()), Times.Never);
        }

        [Fact]
        public async Task CreateUserAsync_WhenValid_AddsUser()
        {
            var createDto = new UserCreateDto
            {
                FirstName = "New",
                LastName = "User",
                Email = "newuser@test.com",
                Password = "Password123",
                Role = "Student"
            };

            _userRepositoryMock.Setup(x => x.ExistsByEmailAsync(createDto.Email))
                .ReturnsAsync(false);
            _userRepositoryMock.Setup(x => x.AddAsync(It.IsAny<User>()))
                .Returns(Task.CompletedTask);
            _userRepositoryMock.Setup(x => x.SaveChangesAsync())
                .Returns(Task.CompletedTask);

            await _userService.CreateUserAsync(createDto);

            _userRepositoryMock.Verify(x => x.AddAsync(It.IsAny<User>()), Times.Once);
            _userRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
        }
    }
}
