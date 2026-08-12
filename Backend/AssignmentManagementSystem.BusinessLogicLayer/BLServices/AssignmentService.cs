using AssignmentManagementSystem.BusinessLogicLayer.DTOs.Assignment;
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
    public class AssignmentService : IAssignmentService
    {
        private readonly IAssignmentRepository _repository;
        private readonly IUserRepository _userRepository;
        private readonly ISubjectRepository _subjectRepository;
        private readonly IClassRepository _classRepository;
        private readonly ITeacherSubjectAssignRepository _teacherSubjectRepository;

        public AssignmentService(IAssignmentRepository repository, IUserRepository userRepository, ISubjectRepository subjectRepository, IClassRepository classRepository, ITeacherSubjectAssignRepository teacherSubjectRepository)
        {
            _repository = repository;
            _userRepository = userRepository;
            _subjectRepository = subjectRepository;
            _classRepository = classRepository;
            _teacherSubjectRepository = teacherSubjectRepository;
        }

        public async Task<AssignmentResponseDto?> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return entity == null ? null : MapToResponseDto(entity);
        }

        public async Task<IEnumerable<AssignmentResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return entities.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<AssignmentResponseDto>> GetByTeacherIdAsync(Guid teacherId)
        {
            var entities = await _repository.GetByTeacherIdAsync(teacherId);
            return entities.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<AssignmentResponseDto>> GetByClassIdAsync(Guid classId)
        {
            var entities = await _repository.GetByClassIdAsync(classId);
            return entities.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<AssignmentResponseDto>> GetPublishedAsync()
        {
            var entities = await _repository.GetPublishedAssignmentsAsync();
            return entities.Select(MapToResponseDto);
        }

        public async Task<AssignmentResponseDto> CreateAsync(AssignmentCreateDto dto)
        {
            var teacher = await _userRepository.GetByIdAsync(dto.TeacherId);
            if (teacher == null)
                throw new Exception("Teacher not found.");

            if (teacher.Role != "Teacher")
                throw new Exception("Only teachers can create assignments.");

            var subject = await _subjectRepository.GetByIdAsync(dto.SubjectId);
            if (subject == null)
                throw new Exception("Subject not found.");

            var classEntity = await _classRepository.GetByIdAsync(dto.ClassId);
            if (classEntity == null)
                throw new Exception("Class not found.");

            var isAssigned = await _teacherSubjectRepository.ExistsAsync(dto.TeacherId, dto.SubjectId);
            if (!isAssigned)
                throw new Exception("You are not assigned to teach this subject.");

            if (dto.DueDate < DateTime.Now.Date)
                throw new Exception("Due date cannot be in the past.");

            if (dto.Status != "Draft" && dto.Status != "Published" && dto.Status != "Closed")
                throw new Exception("Invalid status. Must be Draft, Published, or Closed.");

            bool isActive = dto.Status == "Closed" ? false : dto.IsActive;

            var entity = new Assignment
            {
                Id = Guid.NewGuid(),
                TeacherId = dto.TeacherId,
                SubjectId = dto.SubjectId,
                ClassId = dto.ClassId,
                Title = dto.Title,
                Description = dto.Description,
                TotalMarks = dto.TotalMarks,
                Duedate = dto.DueDate,
                Status = dto.Status,
                IsActive = isActive,
                AttachmentUrl = dto.AttachmentUrl,
                CreatedAt = DateTime.Now
            };

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            var created = await _repository.GetByIdAsync(entity.Id);
            return MapToResponseDto(created!);
        }

        public async Task<AssignmentResponseDto> UpdateAsync(AssignmentUpdateDto dto)
        {
            var existing = await _repository.GetByIdAsync(dto.Id);
            if (existing == null)
                throw new Exception("Assignment not found.");

            var subject = await _subjectRepository.GetByIdAsync(dto.SubjectId);
            if (subject == null)
                throw new Exception("Subject not found.");

            var classEntity = await _classRepository.GetByIdAsync(dto.ClassId);
            if (classEntity == null)
                throw new Exception("Class not found.");

            if (dto.DueDate < DateTime.Now.Date)
                throw new Exception("Due date cannot be in the past.");

            if (dto.Status != "Draft" && dto.Status != "Published" && dto.Status != "Closed")
                throw new Exception("Invalid status. Must be Draft, Published, or Closed.");

            bool isActive = dto.Status == "Closed" ? false : dto.IsActive;

            existing.SubjectId = dto.SubjectId;
            existing.ClassId = dto.ClassId;
            existing.Title = dto.Title;
            existing.Description = dto.Description;
            existing.TotalMarks = dto.TotalMarks;
            existing.Duedate = dto.DueDate;
            existing.Status = dto.Status;
            existing.IsActive = isActive;
            existing.AttachmentUrl = dto.AttachmentUrl;
            existing.UpdatedAt = DateTime.Now;

            _repository.Update(existing);
            await _repository.SaveChangesAsync();

            var updated = await _repository.GetByIdAsync(existing.Id);
            return MapToResponseDto(updated!);
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                throw new Exception("Assignment not found.");

            _repository.Delete(entity);
            await _repository.SaveChangesAsync();
        }

        public async Task UpdateStatusBasedOnDueDateAsync()
        {
            var assignments = await _repository.GetAllAsync();
            var now = DateTime.Now;

            foreach (var assignment in assignments)
            {
                if (assignment.Duedate < now && assignment.Status != "Closed")
                {
                    assignment.Status = "Closed";
                    assignment.IsActive = false;
                    assignment.UpdatedAt = now;
                    _repository.Update(assignment);
                }
            }

            await _repository.SaveChangesAsync();
        }

        private static AssignmentResponseDto MapToResponseDto(Assignment entity)
        {
            return new AssignmentResponseDto
            {
                Id = entity.Id,
                TeacherId = entity.TeacherId,
                TeacherName = $"{entity.Teacher.FirstName} {entity.Teacher.LastName}",
                SubjectId = entity.SubjectId,
                SubjectName = entity.Subject.Name,
                ClassId = entity.ClassId,
                ClassName = entity.Class.Name,
                Title = entity.Title,
                Description = entity.Description,
                TotalMarks = entity.TotalMarks,
                DueDate = entity.Duedate,
                Status = entity.Status,
                IsActive = entity.IsActive,
                AttachmentUrl = entity.AttachmentUrl,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }
    }
}
