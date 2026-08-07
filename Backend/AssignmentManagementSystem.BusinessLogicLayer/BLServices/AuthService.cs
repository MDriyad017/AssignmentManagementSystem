using AssignmentManagementSystem.BusinessLogicLayer.DTOs.Auth;
using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IRepositories;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices;
using AssignmentManagementSystem.Shared.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
            try
            {
                User? user = await _userRepository.GetByEmailAsync(dto.Email);

                if (user == null)
                    throw new Exception("Invalid email or password.");

                bool isPasswordValid = PasswordHasher.Verify(dto.Password, user.PasswordHash);

                if (!isPasswordValid)
                    throw new Exception("Invalid email or password.");

                if (!user.IsActive)
                    throw new Exception("Your account is inactive.");

                string token = _jwtService.GenerateToken(user);

                return new LoginResponseDto
                {
                    Id = user.Id,
                    FullName = $"{user.FirstName} {user.LastName}",
                    Email = user.Email,
                    Role = user.Role,
                    Token = token
                };
            }
            catch
            {
                throw;
            }
        }
    }
}
