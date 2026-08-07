using AssignmentManagementSystem.BusinessLogicLayer.DTOs.User;
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
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;


        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserResponseDto?> GetUserByIdAsync(int id)
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

            return users.Select(MapToResponseDto);
        }

        public async Task CreateUserAsync(UserCreateDto entity)
        {

            try
            {
                bool emailExists = await _userRepository.ExistsByEmailAsync(entity.Email);

                if (emailExists)
                {
                    throw new Exception("Email already exists.");
                }

                User user = new User
                {
                    FirstName = entity.FirstName,
                    LastName = entity.LastName,
                    Email = entity.Email,
                    PasswordHash = PasswordHasher.Hash(entity.Password),
                    Role = entity.Role,
                    ProfilePictureUrl = entity.ProfilePictureUrl,
                    IsActive = true,
                    CreatedAt = DateTime.Now
                };

                await _userRepository.AddAsync(user);
                await _userRepository.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task UpdateUserAsync(int id, UserUpdateDto entity)
        {

            try
            {
                User? user = await _userRepository.GetByIdAsync(id);

                if (user == null)
                {
                    throw new Exception("User not found.");
                }

                if (user.Email != entity.Email)
                {
                    bool emailExists = await _userRepository.ExistsByEmailAsync(entity.Email);

                    if (emailExists)
                    {
                        throw new Exception("Email already exists.");
                    }

                    user.Email = entity.Email;
                }

                user.FirstName = entity.FirstName;
                user.LastName = entity.LastName;
                user.Email = entity.Email;
                user.ProfilePictureUrl = entity.ProfilePictureUrl;
                user.UpdatedAt = DateTime.Now;

                _userRepository.Update(user);
                await _userRepository.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task DeleteUserAsync(int id)
        {
            try
            {
                User? user = await _userRepository.GetByIdAsync(id);

                if (user == null)
                {
                    throw new Exception("User not found.");
                }

                _userRepository.Delete(user);
                await _userRepository.SaveChangesAsync();
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
