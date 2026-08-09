using AssignmentManagementSystem.BusinessLogicLayer.DTOs.User;
using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices
{
    public interface IUserService
    {
        Task<UserResponseDto?> GetUserByIdAsync(Guid id);
        Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
        Task CreateUserAsync(UserCreateDto entity);
        Task UpdateUserAsync(Guid id, UserUpdateDto entity);
        Task DeleteUserAsync(Guid id);
    }
}
