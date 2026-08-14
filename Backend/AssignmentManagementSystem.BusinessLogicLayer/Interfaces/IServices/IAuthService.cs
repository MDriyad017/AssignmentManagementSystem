using AssignmentManagementSystem.BusinessLogicLayer.DTOs.Auth;
using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices
{
    public interface IAuthService
    {
        Task<LoginResponseDto?> LoginAsync(LoginRequestDto dto);
        Task<User?> GetUserFromTokenAsync(string token);
        Task<User?> GetUserByIdAsync(Guid id);
    }
}
