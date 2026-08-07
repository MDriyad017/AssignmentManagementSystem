using AssignmentManagementSystem.BusinessLogicLayer.DTOs.Class;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices
{
    public interface IClassService
    {
        Task<ClassResponseDto?> GetClassByIdAsync(int id);
        Task<IEnumerable<ClassResponseDto>> GetAllClassesAsync();
        Task CreateClassAsync(ClassCreateDto entity);
        Task UpdateClassAsync(int id, ClassUpdateDto entity);
        Task DeleteClassAsync(int id);
    }
}
