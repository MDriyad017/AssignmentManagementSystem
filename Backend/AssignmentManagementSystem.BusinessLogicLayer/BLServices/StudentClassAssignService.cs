using AssignmentManagementSystem.BusinessLogicLayer.DTOs.StudentClassAssign;
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
    public class StudentClassAssignService : IStudentClassAssignService
    {
        private readonly IStudentClassAssignRepository _repository;
        private readonly IUserRepository _userRepository;
        private readonly IClassRepository _classRepository;
        private readonly ITeacherSubjectAssignRepository _teacherSubjectRepository;
        private readonly ISubjectRepository _subjectRepository;

        public StudentClassAssignService(
            IStudentClassAssignRepository repository,
            IUserRepository userRepository,
            IClassRepository classRepository,
            ITeacherSubjectAssignRepository teacherSubjectRepository,
            ISubjectRepository subjectRepository)
        {
            _repository = repository;
            _userRepository = userRepository;
            _classRepository = classRepository;
            _teacherSubjectRepository = teacherSubjectRepository;
            _subjectRepository = subjectRepository;
        }

        public async Task<StudentClassAssignResponseDto?> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return entity == null ? null : MapToResponseDto(entity);
        }

        public async Task<IEnumerable<StudentGroupResponseDto>> GetAllGroupedAsync()
        {
            var entities = await _repository.GetAllAsync();

            var grouped = entities
                .GroupBy(x => x.StudentId)
                .Select(g => new StudentGroupResponseDto
                {
                    StudentId = g.Key,
                    StudentName = $"{g.First().Student.FirstName} {g.First().Student.LastName}",
                    StudentEmail = g.First().Student.Email,
                    Class = g.Select(MapToResponseDto).FirstOrDefault()
                })
                .OrderBy(x => x.StudentName)
                .ToList();

            return grouped;
        }

        public async Task<StudentClassDetailDto> GetStudentClassDetailAsync(Guid studentId)
        {
            var student = await _userRepository.GetByIdAsync(studentId);
            if (student == null)
                throw new Exception("Student not found.");

            var studentClass = await _repository.GetByStudentIdAsync(studentId);
            var classEntity = studentClass.FirstOrDefault()?.Class;
            if (classEntity == null)
                throw new Exception("Student is not assigned to any class.");

            // ✅ Get all teachers for this class
            var teacherSubjects = await _teacherSubjectRepository.GetByClassIdAsync(classEntity.Id);

            // ✅ Group by TeacherId and collect all subjects
            var teacherDetails = teacherSubjects
                .GroupBy(ts => ts.TeacherId)
                .Select(g => new TeacherSubjectDetailDto
                {
                    TeacherId = g.Key,
                    TeacherName = $"{g.First().Teacher.FirstName} {g.First().Teacher.LastName}",
                    Subjects = g.Select(ts => new SubjectDetailDto
                    {
                        SubjectId = ts.SubjectId,
                        SubjectName = ts.Subject.Name
                    })
                    .ToList()
                })
                .ToList();

            return new StudentClassDetailDto
            {
                StudentId = student.Id,
                StudentName = $"{student.FirstName} {student.LastName}",
                StudentEmail = student.Email,
                ClassId = classEntity.Id,
                ClassName = classEntity.Name,
                Teachers = teacherDetails
            };
        }

        public async Task<StudentClassAssignResponseDto> AssignAsync(StudentClassAssignCreateDto dto)
        {
            var student = await _userRepository.GetByIdAsync(dto.StudentId);
            if (student == null)
                throw new Exception("Student not found.");

            if (student.Role != "Student")
                throw new Exception("Selected user is not a student.");

            var classEntity = await _classRepository.GetByIdAsync(dto.ClassId);
            if (classEntity == null)
                throw new Exception($"Class not found.");

            // ✅ Check if student already has a class
            var existing = await _repository.ExistsAsync(dto.StudentId, dto.ClassId);
            if (existing)
                throw new Exception($"Student already assigned to Class: {classEntity.Name}");

            // ✅ Check if student already has ANY class
            var existingClasses = await _repository.GetByStudentIdAsync(dto.StudentId);
            if (existingClasses.Any())
                throw new Exception($"Student is already assigned to Class: {existingClasses.First().Class.Name}. Please remove existing assignment first.");

            var studentClass = new StudentClass
            {
                Id = Guid.NewGuid(),
                StudentId = dto.StudentId,
                ClassId = dto.ClassId,
                EnrolledAt = DateTime.Now,
                CreatedAt = DateTime.Now,
            };

            await _repository.AddAsync(studentClass);
            await _repository.SaveChangesAsync();

            var created = await _repository.GetByIdAsync(studentClass.Id);
            return MapToResponseDto(created!);
        }

        public async Task<StudentClassAssignResponseDto> UpdateAsync(StudentClassAssignUpdateDto dto)
        {
            var existing = await _repository.GetByIdAsync(dto.Id);
            if (existing == null)
                throw new Exception("Assignment not found.");

            var student = await _userRepository.GetByIdAsync(dto.StudentId);
            if (student == null)
                throw new Exception("Student not found.");

            if (student.Role != "Student")
                throw new Exception("Selected user is not a student.");

            var classEntity = await _classRepository.GetByIdAsync(dto.ClassId);
            if (classEntity == null)
                throw new Exception($"Class not found.");

            // ✅ Check if student already has this class (excluding current)
            if (existing.ClassId != dto.ClassId)
            {
                var exists = await _repository.ExistsAsync(dto.StudentId, dto.ClassId);
                if (exists)
                    throw new Exception($"Student already assigned to Class: {classEntity.Name}");
            }

            existing.ClassId = dto.ClassId;
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

        private static StudentClassAssignResponseDto MapToResponseDto(StudentClass entity)
        {
            return new StudentClassAssignResponseDto
            {
                Id = entity.Id,
                StudentId = entity.StudentId,
                StudentName = $"{entity.Student.FirstName} {entity.Student.LastName}",
                StudentEmail = entity.Student.Email,
                ClassId = entity.ClassId,
                ClassName = entity.Class.Name,
                ClassCode = entity.Class.Code,
                EnrolledAt = entity.EnrolledAt
            };
        }
    }
}
