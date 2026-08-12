using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IRepositories
{
    public interface IAssignmentRepository
    {
        Task<Assignment?> GetByIdAsync(Guid id);
        Task<IEnumerable<Assignment>> GetAllAsync();
        Task<IEnumerable<Assignment>> GetByTeacherIdAsync(Guid teacherId);
        Task<IEnumerable<Assignment>> GetByClassIdAsync(Guid classId);
        Task<IEnumerable<Assignment>> GetBySubjectIdAsync(Guid subjectId);
        Task<IEnumerable<Assignment>> GetPublishedAssignmentsAsync();
        Task AddAsync(Assignment entity);
        void Update(Assignment entity);
        void Delete(Assignment entity);
        Task SaveChangesAsync();
    }
}
