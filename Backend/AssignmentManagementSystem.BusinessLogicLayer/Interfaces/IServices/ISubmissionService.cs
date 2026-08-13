using AssignmentManagementSystem.BusinessLogicLayer.DTOs.Submission;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices
{
    public interface ISubmissionService
    {
        Task<SubmissionResponseDto?> GetByIdAsync(Guid id);
        Task<SubmissionResponseDto?> GetByAssignmentAndStudentAsync(Guid assignmentId, Guid studentId);
        Task<IEnumerable<SubmissionResponseDto>> GetAllAsync();
        Task<IEnumerable<SubmissionResponseDto>> GetByAssignmentIdAsync(Guid assignmentId);
        Task<IEnumerable<SubmissionResponseDto>> GetByStudentIdAsync(Guid studentId);
        Task<IEnumerable<SubmissionGroupDto>> GetByTeacherIdAsync(Guid teacherId);
        Task<SubmissionResponseDto> SubmitAsync(SubmissionCreateDto dto);
        Task<SubmissionResponseDto> GradeAsync(SubmissionGradeDto dto);
        Task DeleteAsync(Guid id);
    }
}
