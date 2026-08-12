using AssignmentManagementSystem.BusinessLogicLayer.DTOs.Assignment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices
{
    public interface IAssignmentService
    {
        Task<AssignmentResponseDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<AssignmentResponseDto>> GetAllAsync();
        Task<IEnumerable<AssignmentResponseDto>> GetByTeacherIdAsync(Guid teacherId);
        Task<IEnumerable<AssignmentResponseDto>> GetByClassIdAsync(Guid classId);
        Task<IEnumerable<AssignmentResponseDto>> GetPublishedAsync();
        Task<AssignmentResponseDto> CreateAsync(AssignmentCreateDto dto);
        Task<AssignmentResponseDto> UpdateAsync(AssignmentUpdateDto dto);
        Task DeleteAsync(Guid id);
        Task UpdateStatusBasedOnDueDateAsync();
    }
}
