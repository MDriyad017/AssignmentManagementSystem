using AssignmentManagementSystem.BusinessLogicLayer.BLServices;
using AssignmentManagementSystem.BusinessLogicLayer.DTOs.Auth;
using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IRepositories;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices;
using AssignmentManagementSystem.Shared.Helpers;
using FluentAssertions;
using Moq;

namespace AssignmentManagementSystem.Tests.Unit.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IJwtService> _jwtServiceMock;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _jwtServiceMock = new Mock<IJwtService>();
            _authService = new AuthService(_userRepositoryMock.Object, _jwtServiceMock.Object);
        }

        private string CreatePasswordHash(string password)
        {
            return PasswordHasher.Hash(password);
        }

        [Fact]
        public async Task LoginAsync_WithValidCredentials_ReturnsLoginResponse()
        {
            var password = "Password123";
            var passwordHash = CreatePasswordHash(password);

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@test.com",
                FirstName = "Test",
                LastName = "User",
                PasswordHash = passwordHash,
                Role = "Student",
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            var loginDto = new LoginRequestDto
            {
                Email = user.Email,
                Password = password
            };

            _userRepositoryMock.Setup(x => x.GetByEmailAsync(loginDto.Email))
                .ReturnsAsync(user);
            _jwtServiceMock.Setup(x => x.GenerateToken(user))
                .Returns("test_token_123");

            var result = await _authService.LoginAsync(loginDto);

            result.Should().NotBeNull();
            result.Email.Should().Be(user.Email);
            result.Token.Should().Be("test_token_123");
            _userRepositoryMock.Verify(x => x.GetByEmailAsync(loginDto.Email), Times.Once);
        }

        [Fact]
        public async Task LoginAsync_WithInvalidEmail_ThrowsException()
        {
            var loginDto = new LoginRequestDto
            {
                Email = "notfound@test.com",
                Password = "Password123"
            };

            _userRepositoryMock.Setup(x => x.GetByEmailAsync(loginDto.Email))
                .ReturnsAsync((User?)null);

            await Assert.ThrowsAsync<Exception>(() => _authService.LoginAsync(loginDto));
        }

        [Fact]
        public async Task LoginAsync_WithWrongPassword_ThrowsException()
        {
            var password = "Password123";
            var passwordHash = CreatePasswordHash(password);

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@test.com",
                FirstName = "Test",
                LastName = "User",
                PasswordHash = passwordHash,
                Role = "Student",
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            var loginDto = new LoginRequestDto
            {
                Email = user.Email,
                Password = "WrongPassword"
            };

            _userRepositoryMock.Setup(x => x.GetByEmailAsync(loginDto.Email))
                .ReturnsAsync(user);

            await Assert.ThrowsAsync<Exception>(() => _authService.LoginAsync(loginDto));
        }

        [Fact]
        public async Task LoginAsync_WithInactiveUser_ThrowsException()
        {
            var password = "Password123";
            var passwordHash = CreatePasswordHash(password);

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@test.com",
                FirstName = "Test",
                LastName = "User",
                PasswordHash = passwordHash,
                Role = "Student",
                IsActive = false,
                CreatedAt = DateTime.Now
            };

            var loginDto = new LoginRequestDto
            {
                Email = user.Email,
                Password = password
            };

            _userRepositoryMock.Setup(x => x.GetByEmailAsync(loginDto.Email))
                .ReturnsAsync(user);

            await Assert.ThrowsAsync<Exception>(() => _authService.LoginAsync(loginDto));
        }

        [Fact]
        public async Task GetUserByIdAsync_WhenUserExists_ReturnsUser()
        {
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@test.com",
                FirstName = "Test",
                LastName = "User",
                Role = "Student",
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            _userRepositoryMock.Setup(x => x.GetByIdAsync(user.Id))
                .ReturnsAsync(user);

            var result = await _authService.GetUserByIdAsync(user.Id);

            result.Should().NotBeNull();
            result.Id.Should().Be(user.Id);
            _userRepositoryMock.Verify(x => x.GetByIdAsync(user.Id), Times.Once);
        }

        [Fact]
        public async Task GetUserByIdAsync_WhenUserDoesNotExist_ReturnsNull()
        {
            var userId = Guid.NewGuid();
            _userRepositoryMock.Setup(x => x.GetByIdAsync(userId))
                .ReturnsAsync((User?)null);
            var result = await _authService.GetUserByIdAsync(userId);

            result.Should().BeNull();
            _userRepositoryMock.Verify(x => x.GetByIdAsync(userId), Times.Once);
        }
    }
}