using AssignmentManagementSystem.BusinessLogicLayer.DTOs.TeacherSubjectsAssign;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices
{
    public interface ITeacherSubjectAssignService
    {
        Task<TeacherSubjectAssignResponseDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<TeacherSubjectAssignResponseDto>> GetAllAsync();
        Task<IEnumerable<TeacherGroupResponseDto>> GetAllGroupedAsync();
        Task<IEnumerable<TeacherSubjectAssignResponseDto>> GetByTeacherIdAsync(Guid teacherId);
        Task<IEnumerable<TeacherSubjectAssignResponseDto>> GetBySubjectIdAsync(Guid subjectId);
        Task<IEnumerable<TeacherSubjectAssignResponseDto>> GetByClassIdAsync(Guid classId);
        Task<TeacherSubjectAssignBulkResponseDto> BulkAssignAsync(TeacherSubjectAssignBulkCreateDTO dto);
        Task<TeacherSubjectAssignResponseDto> UpdateAsync(TeacherSubjectAssignUpdateDto dto);
        Task DeleteAsync(Guid id);
        Task DeleteByTeacherIdAsync(Guid teacherId);
    }
}
