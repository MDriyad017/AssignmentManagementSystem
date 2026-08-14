using AssignmentManagementSystem.BusinessLogicLayer.DTOs.User;
using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using AssignmentManagementSystem.BusinessLogicLayer.Helpers;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IRepositories;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices;
using AssignmentManagementSystem.Shared.Helpers;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Formats.Asn1.AsnWriter;

namespace AssignmentManagementSystem.BusinessLogicLayer.BLServices
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuditLogService _auditLogService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(IUserRepository userRepository, IAuditLogService auditLogService, IHttpContextAccessor httpContextAccessor)
        {
            _userRepository = userRepository;
            _auditLogService = auditLogService;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<UserResponseDto?> GetUserByIdAsync(Guid id)
        {
            try
            {
                User? user = await _userRepository.GetByIdAsync(id);

                if (user == null)
                    return null;

                return MapToResponseDto(user);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();

            return users.Where(x => x.Role != "Admin")
                .Select(MapToResponseDto);
        }

        public async Task CreateUserAsync(UserCreateDto dto)
        {
            try
            {
                bool emailExists = await _userRepository.ExistsByEmailAsync(dto.Email);

                if (emailExists)
                {
                    throw new Exception("Email already exists.");
                }

                User user = new User
                {
                    Id = Guid.NewGuid(),
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Email = dto.Email,
                    PasswordHash = PasswordHasher.Hash(dto.Password),
                    Role = dto.Role,
                    ProfilePictureUrl = dto.ProfilePictureUrl,
                    IsActive = true,
                    CreatedAt = DateTime.Now
                };

                await _userRepository.AddAsync(user);
                await _userRepository.SaveChangesAsync();

                // AuditLog: Create User
                await AuditLogHelper.LogAsync(_auditLogService, user.Id, "Create User", "User", user.Id, null,
                    new { user.FirstName, user.LastName, user.Email, user.Role },
                    _httpContextAccessor.HttpContext
                );
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task UpdateUserAsync(Guid id, UserUpdateDto dto)
        {

            try
            {
                User? user = await _userRepository.GetByIdAsync(id);

                if (user == null)
                {
                    throw new Exception("User not found.");
                }

                if (user.Email != dto.Email)
                {
                    bool emailExists = await _userRepository.ExistsByEmailAsync(dto.Email);

                    if (emailExists)
                    {
                        throw new Exception("Email already exists.");
                    }

                    user.Email = dto.Email;
                }

                // Store old values for audit
                var oldValues = new { user.FirstName, user.LastName, user.Email, user.IsActive };

                user.FirstName = dto.FirstName;
                user.LastName = dto.LastName;
                user.Email = dto.Email;
                user.ProfilePictureUrl = dto.ProfilePictureUrl;
                user.IsActive = dto.IsActive;
                user.UpdatedAt = DateTime.Now;

                _userRepository.Update(user);
                await _userRepository.SaveChangesAsync();

                // AuditLog: Update User
                await AuditLogHelper.LogAsync(_auditLogService, user.Id, "Update User", "User", user.Id, oldValues, new { user.FirstName, user.LastName, user.Email, user.IsActive },
                    _httpContextAccessor.HttpContext
                );
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task DeleteUserAsync(Guid id)
        {
            try
            {
                User? user = await _userRepository.GetByIdAsync(id);

                if (user == null)
                {
                    throw new Exception("User not found.");
                }

                // Store user info before delete for audit
                var userInfo = new { user.FirstName, user.LastName, user.Email, user.Role };

                _userRepository.Delete(user);
                await _userRepository.SaveChangesAsync();

                // AuditLog: Delete User
                await AuditLogHelper.LogAsync(_auditLogService, user.Id, "Delete User", "User", user.Id, userInfo, null, _httpContextAccessor.HttpContext);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private static UserResponseDto MapToResponseDto(User user)
        {
            return new UserResponseDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                ProfilePictureUrl = user.ProfilePictureUrl,
                IsActive = user.IsActive
            };
        }
    }
}
