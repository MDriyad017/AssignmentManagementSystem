using AssignmentManagementSystem.BusinessLogicLayer.DTOs.Auth;
using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IRepositories;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices;
using AssignmentManagementSystem.Shared.Helpers;

namespace AssignmentManagementSystem.BusinessLogicLayer.BLServices
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtService _jwtService;

        public AuthService(IUserRepository userRepository, IJwtService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);

            if (user == null)
            {
                throw new Exception("Invalid email or password.");
            }

            var isPasswordValid = PasswordHasher.Verify(dto.Password, user.PasswordHash);

            if (!isPasswordValid)
            {
                throw new Exception("Invalid email or password.");
            }

            if (!user.IsActive)
            {
                throw new Exception("Your account is inactive.");
            }

            var token = _jwtService.GenerateToken(user);

            return new LoginResponseDto
            {
                Id = user.Id,
                FullName = $"{user.FirstName} {user.LastName}".Trim(),
                Email = user.Email,
                Role = user.Role,
                Token = token
            };
        }

        public async Task<User?> GetUserFromTokenAsync(string token)
        {
            try
            {
                var principal = _jwtService.GetPrincipalFromToken(token);

                if (principal == null)
                {
                    return null;
                }

                var userIdClaim = principal.FindFirst(
                    System.Security.Claims.ClaimTypes.NameIdentifier
                );

                if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                {
                    return null;
                }

                return await _userRepository.GetByIdAsync(userId);
            }
            catch
            {
                return null;
            }
        }

        public async Task<User?> GetUserByIdAsync(Guid id)
        {
            return await _userRepository.GetByIdAsync(id);
        }
    }
}