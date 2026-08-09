using AssignmentManagementSystem.BusinessLogicLayer.DTOs.Subject;
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
    public class SubjectService : ISubjectService
    {
        private readonly ISubjectRepository _subjectRepository;
        private readonly IClassRepository _classRepository;

        public SubjectService(ISubjectRepository subjectRepository, IClassRepository classRepository)
        {
            _subjectRepository = subjectRepository;
            _classRepository = classRepository;
        }

        public async Task<SubjectResponseDto?> GetSubjectByIdAsync(Guid id)
        {
            var subject = await _subjectRepository.GetByIdAsync(id);
            if (subject == null) return null;
            return MapToResponseDto(subject);
        }

        public async Task<IEnumerable<SubjectResponseDto>> GetAllSubjectsAsync()
        {
            var subjects = await _subjectRepository.GetAllAsync();
            return subjects.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<SubjectResponseDto>> GetSubjectsByClassIdAsync(Guid classId)
        {
            var subjects = await _subjectRepository.GetByClassIdAsync(classId);
            return subjects.Select(MapToResponseDto);
        }

        public async Task CreateSubjectAsync(SubjectCreateDto dto)
        {
            var classExists = await _classRepository.GetByIdAsync(dto.ClassId);
            if (classExists == null)
                throw new Exception("Class not found.");

            if (await _subjectRepository.ExistsByNameInClassAsync(dto.Name, dto.ClassId))
                throw new Exception("Subject with this name already exists in the class.");

            if (!string.IsNullOrEmpty(dto.Code))
            {
                if (await _subjectRepository.ExistsByCodeInClassAsync(dto.Code, dto.ClassId))
                    throw new Exception("Subject with this code already exists in the class.");
            }

            var subject = new Subject
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Code = dto.Code,
                ClassId = dto.ClassId,
                CreatedAt = DateTime.Now
            };

            await _subjectRepository.AddAsync(subject);
            await _subjectRepository.SaveChangesAsync();
        }

        public async Task UpdateSubjectAsync(Guid id, SubjectCreateDto dto)
        {
            var subject = await _subjectRepository.GetByIdAsync(id);
            if (subject == null)
                throw new Exception("Subject not found.");

            var classExists = await _classRepository.GetByIdAsync(dto.ClassId);
            if (classExists == null)
                throw new Exception("Class not found.");

            if (subject.Name != dto.Name)
            {
                if (await _subjectRepository.ExistsByNameInClassAsync(dto.Name, dto.ClassId))
                    throw new Exception("Subject with this name already exists in the class.");
            }

            if (!string.IsNullOrEmpty(dto.Code) && subject.Code != dto.Code)
            {
                if (await _subjectRepository.ExistsByCodeInClassAsync(dto.Code, dto.ClassId))
                    throw new Exception("Subject with this code already exists in the class.");
            }

            subject.Name = dto.Name;
            subject.Code = dto.Code;
            subject.ClassId = dto.ClassId;
            subject.UpdatedAt = DateTime.Now;

            _subjectRepository.Update(subject);
            await _subjectRepository.SaveChangesAsync();
        }

        public async Task DeleteSubjectAsync(Guid id)
        {
            var subject = await _subjectRepository.GetByIdAsync(id);
            if (subject == null)
                throw new Exception("Subject not found.");

            _subjectRepository.Delete(subject);
            await _subjectRepository.SaveChangesAsync();
        }

        private static SubjectResponseDto MapToResponseDto(Subject subject)
        {
            return new SubjectResponseDto
            {
                Id = subject.Id,
                Name = subject.Name,
                Code = subject.Code,
                ClassId = subject.ClassId,
                ClassName = subject.Class?.Name,
                CreatedAt = subject.CreatedAt,
                UpdatedAt = subject.UpdatedAt
            };
        }
    }
}
