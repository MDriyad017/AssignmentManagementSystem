using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IRepositories
{
    public interface ISubjectRepository
    {
        Task<Subject?> GetByIdAsync(Guid id);
        Task<IEnumerable<Subject>> GetAllAsync();
        Task<IEnumerable<Subject>> GetByClassIdAsync(Guid classId);
        Task<Subject?> GetByNameAsync(string name);
        Task<Subject?> GetByCodeAsync(string code);
        Task<bool> ExistsByNameAsync(string name);
        Task<bool> ExistsByCodeAsync(string code);
        Task<bool> ExistsByNameInClassAsync(string name, Guid classId);
        Task<bool> ExistsByCodeInClassAsync(string code, Guid classId);
        Task AddAsync(Subject subject);
        void Update(Subject subject);
        void Delete(Subject subject);
        Task SaveChangesAsync();
    }
}
