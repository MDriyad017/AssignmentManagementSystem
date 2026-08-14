using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IRepositories
{
    public interface IAuditLogRepository
    {
        Task<AuditLog?> GetByIdAsync(Guid id);
        Task<IEnumerable<AuditLog>> GetAllAsync();
        Task<IEnumerable<AuditLog>> GetByUserIdAsync(Guid userId);
        Task<IEnumerable<AuditLog>> GetByEntityAsync(string entityName, Guid entityId);
        Task AddAsync(AuditLog entity);
        Task SaveChangesAsync();
    }
}
