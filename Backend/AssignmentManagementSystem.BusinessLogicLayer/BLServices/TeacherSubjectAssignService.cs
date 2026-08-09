using AssignmentManagementSystem.BusinessLogicLayer.DTOs.TeacherSubjectsAssign;
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
    public class TeacherSubjectAssignService : ITeacherSubjectAssignService
    {
        private readonly ITeacherSubjectAssignRepository _repository;
        private readonly IUserRepository _userRepository;
        private readonly IClassRepository _classRepository;
        private readonly ISubjectRepository _subjectRepository;

        public TeacherSubjectAssignService(ITeacherSubjectAssignRepository repository, IUserRepository userRepository, IClassRepository classRepository, ISubjectRepository subjectRepository)
        {
            _repository = repository;
            _userRepository = userRepository;
            _classRepository = classRepository;
            _subjectRepository = subjectRepository;
        }

        public async Task<TeacherSubjectAssignResponseDto?> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return entity == null ? null : MapToResponseDto(entity);
        }

        public async Task<IEnumerable<TeacherSubjectAssignResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return entities.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<TeacherGroupResponseDto>> GetAllGroupedAsync()
        {
            var entities = await _repository.GetAllAsync();

            var grouped = entities
                .GroupBy(x => x.TeacherId)
                .Select(g => new TeacherGroupResponseDto
                {
                    TeacherId = g.Key,
                    TeacherName = $"{g.First().Teacher.FirstName} {g.First().Teacher.LastName}",
                    TeacherEmail = g.First().Teacher.Email,
                    Assigns = g.Select(MapToResponseDto).OrderBy(o => o.SubjectName).ToList()
                })
                .OrderBy(x => x.TeacherName)
                .ToList();

            return grouped;
        }

        public async Task<IEnumerable<TeacherSubjectAssignResponseDto>> GetByTeacherIdAsync(Guid teacherId)
        {
            var entities = await _repository.GetByTeacherIdAsync(teacherId);
            return entities.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<TeacherSubjectAssignResponseDto>> GetBySubjectIdAsync(Guid subjectId)
        {
            var entities = await _repository.GetBySubjectIdAsync(subjectId);
            return entities.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<TeacherSubjectAssignResponseDto>> GetByClassIdAsync(Guid classId)
        {
            var entities = await _repository.GetByClassIdAsync(classId);
            return entities.Select(MapToResponseDto);
        }

        public async Task<TeacherSubjectAssignBulkResponseDto> BulkAssignAsync(TeacherSubjectAssignBulkCreateDTO dto)
        {
            var teacher = await _userRepository.GetByIdAsync(dto.TeacherId);
            if (teacher == null)
                throw new Exception("Teacher not found.");

            if (teacher.Role != "Teacher")
                throw new Exception("Selected user is not a teacher.");

            var assignedList = new List<TeacherSubject>();

            foreach (var assignment in dto.TeacherSubjectAssigns)
            {
                var classEntity = await _classRepository.GetByIdAsync(assignment.ClassId);
                if (classEntity == null)
                    throw new Exception($"Class not found for ID: {assignment.ClassId}");

                var subjectEntity = await _subjectRepository.GetByIdAsync(assignment.SubjectId);
                if (subjectEntity == null)
                    throw new Exception($"Subject not found for ID: {assignment.SubjectId}");

                if (subjectEntity.ClassId != assignment.ClassId)
                    throw new Exception($"Subject '{subjectEntity.Name}' does not belong to Class '{classEntity.Name}'.");

                var exists = await _repository.ExistsAsync(dto.TeacherId, assignment.SubjectId);
                if (exists)
                    throw new Exception($"Teacher already assigned to Subject: {subjectEntity.Name}");

                var teacherSubject = new TeacherSubject
                {
                    Id = Guid.NewGuid(),
                    TeacherId = dto.TeacherId,
                    SubjectId = assignment.SubjectId,
                    AssignedAt = DateTime.Now,
                    CreatedAt = DateTime.Now,
                };

                assignedList.Add(teacherSubject);
            }

            await _repository.AddRangeAsync(assignedList);
            await _repository.SaveChangesAsync();

            return new TeacherSubjectAssignBulkResponseDto
            {
                TotalAssigned = assignedList.Count,
                TeacherSubjectAssigns = assignedList.Select(ts => new TeacherSubjectAssignResponseDto
                {
                    Id = ts.Id,
                    TeacherId = ts.TeacherId,
                    TeacherName = $"{teacher.FirstName} {teacher.LastName}",
                    TeacherEmail = teacher.Email,
                    ClassId = ts.Subject.ClassId,
                    ClassName = ts.Subject.Class.Name,
                    SubjectId = ts.SubjectId,
                    SubjectName = ts.Subject.Name,
                    AssignedAt = ts.AssignedAt
                }).ToList()
            };
        }

        public async Task<TeacherSubjectAssignResponseDto> UpdateAsync(TeacherSubjectAssignUpdateDto dto)
        {
            var existing = await _repository.GetByIdAsync(dto.Id);
            if (existing == null)
                throw new Exception("Assignment not found.");

            var teacher = await _userRepository.GetByIdAsync(dto.TeacherId);
            if (teacher == null)
                throw new Exception("Teacher not found.");

            if (teacher.Role != "Teacher")
                throw new Exception("Selected user is not a teacher.");

            var classEntity = await _classRepository.GetByIdAsync(dto.ClassId);
            if (classEntity == null)
                throw new Exception($"Class not found for ID: {dto.ClassId}");

            var subjectEntity = await _subjectRepository.GetByIdAsync(dto.SubjectId);
            if (subjectEntity == null)
                throw new Exception($"Subject not found for ID: {dto.SubjectId}");

            if (subjectEntity.ClassId != dto.ClassId)
                throw new Exception($"Subject '{subjectEntity.Name}' does not belong to Class '{classEntity.Name}'.");

            if (existing.TeacherId != dto.TeacherId || existing.SubjectId != dto.SubjectId)
            {
                var exists = await _repository.ExistsAsync(dto.TeacherId, dto.SubjectId);
                if (exists)
                    throw new Exception($"Teacher already assigned to Subject: {subjectEntity.Name}");
            }

            existing.TeacherId = dto.TeacherId;
            existing.SubjectId = dto.SubjectId;
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

        public async Task DeleteByTeacherIdAsync(Guid teacherId)
        {
            var entities = await _repository.GetByTeacherIdAsync(teacherId);
            if (!entities.Any())
                throw new Exception("No assignments found for this teacher.");

            _repository.DeleteRange(entities);
            await _repository.SaveChangesAsync();
        }

        private static TeacherSubjectAssignResponseDto MapToResponseDto(TeacherSubject entity)
        {
            return new TeacherSubjectAssignResponseDto
            {
                Id = entity.Id,
                TeacherId = entity.TeacherId,
                TeacherName = $"{entity.Teacher.FirstName} {entity.Teacher.LastName}",
                TeacherEmail = entity.Teacher.Email,
                ClassId = entity.Subject.ClassId,
                ClassName = entity.Subject.Class.Name,
                SubjectId = entity.SubjectId,
                SubjectName = entity.Subject.Name,
                AssignedAt = entity.AssignedAt
            };
        }
    }
}
