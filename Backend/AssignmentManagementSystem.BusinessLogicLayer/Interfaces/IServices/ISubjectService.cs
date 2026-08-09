using AssignmentManagementSystem.BusinessLogicLayer.DTOs.Subject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices
{
    public interface ISubjectService
    {
        Task<SubjectResponseDto?> GetSubjectByIdAsync(Guid id);
        Task<IEnumerable<SubjectResponseDto>> GetAllSubjectsAsync();
        Task<IEnumerable<SubjectResponseDto>> GetSubjectsByClassIdAsync(Guid classId);
        Task CreateSubjectAsync(SubjectCreateDto dto);
        Task UpdateSubjectAsync(Guid id, SubjectCreateDto dto);
        Task DeleteSubjectAsync(Guid id);
    }
}
