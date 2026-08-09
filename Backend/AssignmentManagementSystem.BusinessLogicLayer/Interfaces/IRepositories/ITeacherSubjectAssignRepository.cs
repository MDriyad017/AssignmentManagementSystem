using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IRepositories
{
    public interface ITeacherSubjectAssignRepository
    {
        Task<TeacherSubject?> GetByIdAsync(Guid id);
        Task<IEnumerable<TeacherSubject>> GetAllAsync();
        Task<IEnumerable<TeacherSubject>> GetByTeacherIdAsync(Guid teacherId);
        Task<IEnumerable<TeacherSubject>> GetBySubjectIdAsync(Guid subjectId);
        Task<IEnumerable<TeacherSubject>> GetByClassIdAsync(Guid classId);
        Task<bool> ExistsAsync(Guid teacherId, Guid subjectId);
        Task<bool> ExistsByTeacherClassSubjectAsync(Guid teacherId, Guid classId, Guid subjectId);
        Task AddAsync(TeacherSubject entity);
        Task AddRangeAsync(IEnumerable<TeacherSubject> entities);
        void Update(TeacherSubject entity);
        void Delete(TeacherSubject entity);
        void DeleteRange(IEnumerable<TeacherSubject> entities);
        Task SaveChangesAsync();
    }
}
