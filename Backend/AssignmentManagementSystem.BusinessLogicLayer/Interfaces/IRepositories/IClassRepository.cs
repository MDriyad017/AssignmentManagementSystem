using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IRepositories
{
    public interface IClassRepository
    {
        Task<Class?> GetByIdAsync(Guid id);
        Task<IEnumerable<Class>> GetAllAsync();
        Task<Class?> GetByNameAsync(string name);
        Task<Class?> GetByCodeAsync(string code);
        Task<bool> ExistsByNameAsync(string name);
        Task<bool> ExistsByCodeAsync(string code);
        Task AddAsync(Class classEntity);
        void Update(Class classEntity);
        void Delete(Class classEntity);
        Task SaveChangesAsync();
    }
}
