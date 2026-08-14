using AssignmentManagementSystem.BusinessLogicLayer.DTOs.AuditLog;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.Helpers
{
    public static class AuditLogHelper
    {
        public static async Task LogAsync(IAuditLogService auditLogService, Guid userId, string action, string entityName, Guid? entityId = null, object? oldValues = null, 
            object? newValues = null, HttpContext? httpContext = null)
        {
            try
            {
                var dto = new AuditLogCreateDto
                {
                    UserId = userId,
                    Action = action,
                    EntityName = entityName,
                    EntityId = entityId,
                    OldValues = oldValues != null ? JsonSerializer.Serialize(oldValues, new JsonSerializerOptions { WriteIndented = true }) : null,
                    NewValues = newValues != null ? JsonSerializer.Serialize(newValues, new JsonSerializerOptions { WriteIndented = true }) : null,
                    IpAddress = httpContext?.Connection?.RemoteIpAddress?.ToString(),
                    UserAgent = httpContext?.Request?.Headers["User-Agent"].ToString()
                };

                await auditLogService.LogAsync(dto);
            }
            catch
            {
            }
        }
    }
}
