using AssignmentManagementSystem.BusinessLogicLayer.DTOs.AuditLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices
{
    public interface IAuditLogService
    {
        Task<AuditLogResponseDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<AuditLogResponseDto>> GetAllAsync();
        Task<IEnumerable<AuditLogResponseDto>> GetByUserIdAsync(Guid userId);
        Task LogAsync(AuditLogCreateDto dto);
    }
}
