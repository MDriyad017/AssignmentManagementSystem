using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.DTOs.AuditLog
{
    public class AuditLogCreateDto
    {
        public Guid UserId { get; set; }
        public string Action { get; set; } = null!;
        public string EntityName { get; set; } = null!;
        public Guid? EntityId { get; set; }
        public string? OldValues { get; set; }
        public string? NewValues { get; set; }
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }
    }
}
