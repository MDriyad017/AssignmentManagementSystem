using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IRepositories
{
    public interface ISubmissionRepository
    {
        Task<Submission?> GetByIdAsync(Guid id);
        Task<Submission?> GetByAssignmentAndStudentAsync(Guid assignmentId, Guid studentId);
        Task<IEnumerable<Submission>> GetAllAsync();
        Task<IEnumerable<Submission>> GetByAssignmentIdAsync(Guid assignmentId);
        Task<IEnumerable<Submission>> GetByStudentIdAsync(Guid studentId);
        Task<IEnumerable<Submission>> GetByTeacherIdAsync(Guid teacherId);
        Task<IEnumerable<Submission>> GetPendingSubmissionsAsync();
        Task AddAsync(Submission entity);
        void Update(Submission entity);
        void Delete(Submission entity);
        Task SaveChangesAsync();
    }
}
