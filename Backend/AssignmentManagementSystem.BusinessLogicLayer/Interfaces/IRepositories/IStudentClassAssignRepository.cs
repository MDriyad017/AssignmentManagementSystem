using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IRepositories
{
    public interface IStudentClassAssignRepository
    {
        Task<StudentClass?> GetByIdAsync(Guid id);
        Task<IEnumerable<StudentClass>> GetAllAsync();
        Task<IEnumerable<StudentClass>> GetByStudentIdAsync(Guid studentId);
        Task<IEnumerable<StudentClass>> GetByClassIdAsync(Guid classId);
        Task<bool> ExistsAsync(Guid studentId, Guid classId);
        Task AddAsync(StudentClass entity);
        void Update(StudentClass entity);
        void Delete(StudentClass entity);
        Task SaveChangesAsync();
    }
}
