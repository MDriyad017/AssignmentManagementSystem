using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IRepositories;
using AssignmentManagementSystem.DataAccessLayer.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.DataAccessLayer.Repositories
{
    public class AuditLogRepository : IAuditLogRepository
    {
        private readonly ApplicationDbContext _context;

        public AuditLogRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AuditLog?> GetByIdAsync(Guid id)
        {
            return await _context.AuditLogs
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<AuditLog>> GetAllAsync()
        {
            return await _context.AuditLogs
                .Include(x => x.User)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<AuditLog>> GetByUserIdAsync(Guid userId)
        {
            return await _context.AuditLogs
                .Include(x => x.User)
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<AuditLog>> GetByEntityAsync(string entityName, Guid entityId)
        {
            return await _context.AuditLogs
                .Include(x => x.User)
                .Where(x => x.EntityName == entityName && x.EntityId == entityId)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        public async Task AddAsync(AuditLog entity)
        {
            await _context.AuditLogs.AddAsync(entity);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
