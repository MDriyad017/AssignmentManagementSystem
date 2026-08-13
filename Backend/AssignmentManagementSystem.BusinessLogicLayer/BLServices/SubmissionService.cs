using AssignmentManagementSystem.BusinessLogicLayer.DTOs.Submission;
using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IRepositories;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.BLServices
{
    public class SubmissionService : ISubmissionService
    {
        private readonly ISubmissionRepository _repository;
        private readonly IAssignmentRepository _assignmentRepository;
        private readonly IUserRepository _userRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public SubmissionService(ISubmissionRepository repository, IAssignmentRepository assignmentRepository, IUserRepository userRepository, IWebHostEnvironment webHostEnvironment)
        {
            _repository = repository;
            _assignmentRepository = assignmentRepository;
            _userRepository = userRepository;
            _webHostEnvironment = webHostEnvironment;
        }

        private void DeleteSubmissionFile(string? fileUrl)
        {
            if (string.IsNullOrEmpty(fileUrl)) return;
            var fileName = Path.GetFileName(fileUrl);
            var folderPath = Path.Combine("Submission", "StudentSubmission");
            var fullPath = Path.Combine(_webHostEnvironment.WebRootPath ?? "wwwroot", folderPath, fileName);
            if (File.Exists(fullPath)) File.Delete(fullPath);
        }

        public async Task<SubmissionResponseDto?> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return entity == null ? null : MapToResponseDto(entity);
        }

        public async Task<SubmissionResponseDto?> GetByAssignmentAndStudentAsync(Guid assignmentId, Guid studentId)
        {
            var entity = await _repository.GetByAssignmentAndStudentAsync(assignmentId, studentId);
            return entity == null ? null : MapToResponseDto(entity);
        }

        public async Task<IEnumerable<SubmissionResponseDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return entities.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<SubmissionResponseDto>> GetByAssignmentIdAsync(Guid assignmentId)
        {
            var entities = await _repository.GetByAssignmentIdAsync(assignmentId);
            return entities.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<SubmissionResponseDto>> GetByStudentIdAsync(Guid studentId)
        {
            var entities = await _repository.GetByStudentIdAsync(studentId);
            return entities.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<SubmissionGroupDto>> GetByTeacherIdAsync(Guid teacherId)
        {
            var entities = await _repository.GetByTeacherIdAsync(teacherId);

            var assignmentIds = entities.Select(x => x.AssignmentId).Distinct().ToList();

            var assignments = new List<Assignment>();
            foreach (var id in assignmentIds)
            {
                var assignment = await _assignmentRepository.GetByIdAsync(id);
                if (assignment != null)
                    assignments.Add(assignment);
            }

            var grouped = assignments.Select(assignment => new SubmissionGroupDto
            {
                AssignmentId = assignment.Id,
                AssignmentTitle = assignment.Title,
                TeacherId = assignment.TeacherId,
                TeacherName = $"{assignment.Teacher.FirstName} {assignment.Teacher.LastName}",
                ClassId = assignment.ClassId,
                ClassName = assignment.Class.Name,
                SubjectId = assignment.SubjectId,
                SubjectName = assignment.Subject.Name,
                DueDate = assignment.Duedate,
                TotalMarks = assignment.TotalMarks,
                Submissions = entities.Where(x => x.AssignmentId == assignment.Id)
                    .Select(MapToResponseDto)
                    .ToList()
            }).OrderBy(x => x.DueDate);

            return grouped;
        }

        public async Task<SubmissionResponseDto> SubmitAsync(SubmissionCreateDto dto)
        {
            var assignment = await _assignmentRepository.GetByIdAsync(dto.AssignmentId);
            if (assignment == null)
                throw new Exception("Assignment not found.");

            var student = await _userRepository.GetByIdAsync(dto.StudentId);
            if (student == null)
                throw new Exception("Student not found.");
            if (student.Role != "Student")
                throw new Exception("Only students can submit assignments.");

            if (assignment.Status != "Published")
                throw new Exception("This assignment is not available for submission.");

            var existing = await _repository.GetByAssignmentAndStudentAsync(dto.AssignmentId, dto.StudentId);
            if (existing != null)
                throw new Exception("You have already submitted this assignment.");

            var now = DateTime.Now;
            var status = assignment.Duedate.HasValue && assignment.Duedate.Value < now ? "Late" : "Submitted";

            var submission = new Submission
            {
                Id = Guid.NewGuid(),
                AssignmentId = dto.AssignmentId,
                StudentId = dto.StudentId,
                SubmissionText = dto.SubmissionText,
                SubmissionFileUrl = dto.SubmissionFileUrl,
                SubmittedAt = now,
                Status = status,
                CreatedAt = now,
                IsActive = true
            };

            await _repository.AddAsync(submission);
            await _repository.SaveChangesAsync();

            var created = await _repository.GetByIdAsync(submission.Id);
            return MapToResponseDto(created!);
        }

        public async Task<SubmissionResponseDto> GradeAsync(SubmissionGradeDto dto)
        {
            var submission = await _repository.GetByIdAsync(dto.SubmissionId);
            if (submission == null)
                throw new Exception("Submission not found.");

            var grader = await _userRepository.GetByIdAsync(dto.GradedBy);
            if (grader == null)
                throw new Exception("Grader not found.");

            submission.MarksObtained = dto.MarksObtained;
            submission.FeedBack = dto.Feedback;
            submission.GradedAt = DateTime.Now;
            submission.GradedBy = dto.GradedBy;
            submission.Status = dto.Status;
            submission.UpdatedAt = DateTime.Now;

            _repository.Update(submission);
            await _repository.SaveChangesAsync();

            var updated = await _repository.GetByIdAsync(submission.Id);
            return MapToResponseDto(updated!);
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                throw new Exception("Submission not found.");

            DeleteSubmissionFile(entity.SubmissionFileUrl);

            _repository.Delete(entity);
            await _repository.SaveChangesAsync();
        }

        private static SubmissionResponseDto MapToResponseDto(Submission entity)
        {
            return new SubmissionResponseDto
            {
                Id = entity.Id,
                AssignmentId = entity.AssignmentId,
                AssignmentTitle = entity.Assignment?.Title ?? string.Empty,
                StudentId = entity.StudentId,
                StudentName = entity.Student != null ? $"{entity.Student.FirstName} {entity.Student.LastName ?? string.Empty}" : string.Empty,
                StudentEmail = entity.Student?.Email ?? string.Empty,
                SubmissionText = entity.SubmissionText,
                SubmissionFileUrl = entity.SubmissionFileUrl,
                SubmittedAt = entity.SubmittedAt,
                Status = entity.Status,
                MarksObtained = entity.MarksObtained,
                Feedback = entity.FeedBack,
                GradedAt = entity.GradedAt,
                GradedBy = entity.GradedBy,
                IsActive = entity.IsActive,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }
    }
}
