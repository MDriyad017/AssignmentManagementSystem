using AssignmentManagementSystem.BusinessLogicLayer.DTOs.AuditLog;
using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IRepositories;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.BLServices
{
    public class AuditLogService : IAuditLogService
    {
        private readonly IAuditLogRepository _repository;
        private readonly IUserRepository _userRepository;

        public AuditLogService(IAuditLogRepository repository, IUserRepository userRepository)
        {
            _repository = repository;
            _userRepository = userRepository;
        }

        public async Task<AuditLogResponseDto?> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return entity == null ? null : MapToResponseDto(entity);
        }

        public async Task<IEnumerable<AuditLogResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return entities.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<AuditLogResponseDto>> GetByUserIdAsync(Guid userId)
        {
            var entities = await _repository.GetByUserIdAsync(userId);
            return entities.Select(MapToResponseDto);
        }

        public async Task LogAsync(AuditLogCreateDto dto)
        {
            var user = await _userRepository.GetByIdAsync(dto.UserId);
            if (user == null)
                throw new Exception("User not found.");

            var auditLog = new AuditLog
            {
                Id = Guid.NewGuid(),
                UserId = dto.UserId,
                Action = dto.Action,
                EntityName = dto.EntityName,
                EntityId = dto.EntityId,
                OldValues = dto.OldValues,
                NewValues = dto.NewValues,
                IpAddress = dto.IpAddress,
                UserAgent = dto.UserAgent,
                CreatedAt = DateTime.Now
            };

            await _repository.AddAsync(auditLog);
            await _repository.SaveChangesAsync();
        }

        private static AuditLogResponseDto MapToResponseDto(AuditLog entity)
        {
            return new AuditLogResponseDto
            {
                Id = entity.Id,
                UserId = entity.UserId,
                UserName = entity.User != null ? $"{entity.User.FirstName} {entity.User.LastName}" : "Unknown",
                UserEmail = entity.User?.Email ?? "Unknown",
                Action = entity.Action ?? "Unknown",
                EntityName = entity.EntityName ?? "Unknown",
                EntityId = entity.EntityId,
                OldValues = entity.OldValues,
                NewValues = entity.NewValues,
                IpAddress = entity.IpAddress,
                UserAgent = entity.UserAgent,
                CreatedAt = entity.CreatedAt
            };
        }
    }
}
