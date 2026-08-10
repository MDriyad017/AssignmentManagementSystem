using AssignmentManagementSystem.BusinessLogicLayer.DTOs.StudentClassAssign;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices
{
    public interface IStudentClassAssignService
    {
        Task<StudentClassAssignResponseDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<StudentGroupResponseDto>> GetAllGroupedAsync();
        Task<StudentClassDetailDto> GetStudentClassDetailAsync(Guid studentId);
        Task<StudentClassAssignResponseDto> AssignAsync(StudentClassAssignCreateDto dto);
        Task<StudentClassAssignResponseDto> UpdateAsync(StudentClassAssignUpdateDto dto);
        Task DeleteAsync(Guid id);
    }
}
