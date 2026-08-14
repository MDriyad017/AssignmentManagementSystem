using AssignmentManagementSystem.BusinessLogicLayer.BLServices;
using AssignmentManagementSystem.BusinessLogicLayer.DTOs.Submission;
using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IRepositories;
using AssignmentManagementSystem.Tests.Unit.Helpers;
using FluentAssertions;
using Moq;
using Microsoft.AspNetCore.Hosting;

namespace AssignmentManagementSystem.Tests.Unit.Services
{
    public class SubmissionServiceTests
    {
        private readonly Mock<ISubmissionRepository> _submissionRepositoryMock;
        private readonly Mock<IAssignmentRepository> _assignmentRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IWebHostEnvironment> _webHostEnvironmentMock;
        private readonly SubmissionService _submissionService;

        public SubmissionServiceTests()
        {
            _submissionRepositoryMock = new Mock<ISubmissionRepository>();
            _assignmentRepositoryMock = new Mock<IAssignmentRepository>();
            _userRepositoryMock = new Mock<IUserRepository>();
            _webHostEnvironmentMock = new Mock<IWebHostEnvironment>();
            _submissionService = new SubmissionService(
                _submissionRepositoryMock.Object,
                _assignmentRepositoryMock.Object,
                _userRepositoryMock.Object,
                _webHostEnvironmentMock.Object
            );
        }

        [Fact]
        public async Task SubmitAsync_WithValidData_ReturnsSuccess()
        {
            var assignment = new Assignment
            {
                Id = Guid.NewGuid(),
                Title = "Test Assignment",
                Status = "Published",
                Duedate = DateTime.Now.AddDays(7)
            };
            var student = TestDataHelper.GetTestUsers().First(u => u.Role == "Student");

            var createDto = new SubmissionCreateDto
            {
                AssignmentId = assignment.Id,
                StudentId = student.Id,
                SubmissionText = "Test submission",
                SubmissionFileUrl = "/uploads/test.pdf"
            };

            var createdSubmission = new Submission
            {
                Id = Guid.NewGuid(),
                AssignmentId = assignment.Id,
                StudentId = student.Id,
                SubmissionText = createDto.SubmissionText,
                SubmissionFileUrl = createDto.SubmissionFileUrl,
                SubmittedAt = DateTime.Now,
                Status = "Submitted",
                CreatedAt = DateTime.Now,
                IsActive = true,
                Assignment = assignment,
                Student = student
            };

            _assignmentRepositoryMock.Setup(x => x.GetByIdAsync(assignment.Id))
                .ReturnsAsync(assignment);
            _userRepositoryMock.Setup(x => x.GetByIdAsync(student.Id))
                .ReturnsAsync(student);
            _submissionRepositoryMock.Setup(x => x.GetByAssignmentAndStudentAsync(assignment.Id, student.Id))
                .ReturnsAsync((Submission?)null);
            _submissionRepositoryMock.Setup(x => x.AddAsync(It.IsAny<Submission>()))
                .Returns(Task.CompletedTask);
            _submissionRepositoryMock.Setup(x => x.SaveChangesAsync())
                .Returns(Task.CompletedTask);
            _submissionRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<Guid>()))
                .ReturnsAsync(createdSubmission);

            var result = await _submissionService.SubmitAsync(createDto);

            result.Should().NotBeNull();
            result.Status.Should().Be("Submitted");
            _submissionRepositoryMock.Verify(x => x.AddAsync(It.IsAny<Submission>()), Times.Once);
            _submissionRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task SubmitAsync_WhenAssignmentNotPublished_ThrowsException()
        {
            var assignment = new Assignment
            {
                Id = Guid.NewGuid(),
                Title = "Test Assignment",
                Status = "Draft"
            };
            var student = TestDataHelper.GetTestUsers().First(u => u.Role == "Student");
            var createDto = new SubmissionCreateDto
            {
                AssignmentId = assignment.Id,
                StudentId = student.Id,
                SubmissionText = "Test submission"
            };

            _assignmentRepositoryMock.Setup(x => x.GetByIdAsync(assignment.Id))
                .ReturnsAsync(assignment);

            await Assert.ThrowsAsync<Exception>(() => _submissionService.SubmitAsync(createDto));
        }

        [Fact]
        public async Task SubmitAsync_WhenAlreadySubmitted_ThrowsException()
        {
            var assignment = new Assignment
            {
                Id = Guid.NewGuid(),
                Title = "Test Assignment",
                Status = "Published",
                Duedate = DateTime.Now.AddDays(7)
            };
            var student = TestDataHelper.GetTestUsers().First(u => u.Role == "Student");
            var existingSubmission = new Submission
            {
                Id = Guid.NewGuid(),
                AssignmentId = assignment.Id,
                StudentId = student.Id
            };
            var createDto = new SubmissionCreateDto
            {
                AssignmentId = assignment.Id,
                StudentId = student.Id,
                SubmissionText = "Test submission"
            };

            _assignmentRepositoryMock.Setup(x => x.GetByIdAsync(assignment.Id))
                .ReturnsAsync(assignment);
            _userRepositoryMock.Setup(x => x.GetByIdAsync(student.Id))
                .ReturnsAsync(student);
            _submissionRepositoryMock.Setup(x => x.GetByAssignmentAndStudentAsync(assignment.Id, student.Id))
                .ReturnsAsync(existingSubmission);

            await Assert.ThrowsAsync<Exception>(() => _submissionService.SubmitAsync(createDto));
        }

        [Fact]
        public async Task SubmitAsync_WhenLateSubmission_StatusIsLate()
        {
            var assignment = new Assignment
            {
                Id = Guid.NewGuid(),
                Title = "Test Assignment",
                Status = "Published",
                Duedate = DateTime.Now.AddDays(-1)
            };
            var student = TestDataHelper.GetTestUsers().First(u => u.Role == "Student");

            var createDto = new SubmissionCreateDto
            {
                AssignmentId = assignment.Id,
                StudentId = student.Id,
                SubmissionText = "Late submission",
                SubmissionFileUrl = "/uploads/test.pdf"
            };

            var createdSubmission = new Submission
            {
                Id = Guid.NewGuid(),
                AssignmentId = assignment.Id,
                StudentId = student.Id,
                SubmissionText = createDto.SubmissionText,
                SubmissionFileUrl = createDto.SubmissionFileUrl,
                SubmittedAt = DateTime.Now,
                Status = "Late",
                CreatedAt = DateTime.Now,
                IsActive = true,
                Assignment = assignment,
                Student = student
            };

            _assignmentRepositoryMock.Setup(x => x.GetByIdAsync(assignment.Id))
                .ReturnsAsync(assignment);
            _userRepositoryMock.Setup(x => x.GetByIdAsync(student.Id))
                .ReturnsAsync(student);
            _submissionRepositoryMock.Setup(x => x.GetByAssignmentAndStudentAsync(assignment.Id, student.Id))
                .ReturnsAsync((Submission?)null);
            _submissionRepositoryMock.Setup(x => x.AddAsync(It.IsAny<Submission>()))
                .Returns(Task.CompletedTask);
            _submissionRepositoryMock.Setup(x => x.SaveChangesAsync())
                .Returns(Task.CompletedTask);
            _submissionRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<Guid>()))
                .ReturnsAsync(createdSubmission);

            var result = await _submissionService.SubmitAsync(createDto);

            result.Should().NotBeNull();
            result.Status.Should().Be("Late");
        }

        [Fact]
        public async Task GradeAsync_WithValidData_ReturnsSuccess()
        {
            var submission = new Submission
            {
                Id = Guid.NewGuid(),
                AssignmentId = Guid.NewGuid(),
                StudentId = Guid.NewGuid(),
                Status = "Submitted"
            };
            var teacher = TestDataHelper.GetTestUsers().First(u => u.Role == "Teacher");
            var gradeDto = new SubmissionGradeDto
            {
                SubmissionId = submission.Id,
                MarksObtained = 85,
                Feedback = "Great work!",
                GradedBy = teacher.Id,
                Status = "Graded"
            };

            _submissionRepositoryMock.Setup(x => x.GetByIdAsync(submission.Id))
                .ReturnsAsync(submission);
            _userRepositoryMock.Setup(x => x.GetByIdAsync(teacher.Id))
                .ReturnsAsync(teacher);
            _submissionRepositoryMock.Setup(x => x.SaveChangesAsync())
                .Returns(Task.CompletedTask);

            var result = await _submissionService.GradeAsync(gradeDto);

            result.Should().NotBeNull();
            result.Status.Should().Be("Graded");
            result.MarksObtained.Should().Be(85);
            _submissionRepositoryMock.Verify(x => x.Update(submission), Times.Once);
            _submissionRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task GradeAsync_WhenSubmissionNotFound_ThrowsException()
        {
            var gradeDto = new SubmissionGradeDto
            {
                SubmissionId = Guid.NewGuid(),
                MarksObtained = 85,
                Feedback = "Great work!",
                GradedBy = Guid.NewGuid(),
                Status = "Graded"
            };

            _submissionRepositoryMock.Setup(x => x.GetByIdAsync(gradeDto.SubmissionId))
                .ReturnsAsync((Submission?)null);

            await Assert.ThrowsAsync<Exception>(() => _submissionService.GradeAsync(gradeDto));
        }

        [Fact]
        public async Task DeleteAsync_WhenExists_DeletesSubmission()
        {
            var submissionId = Guid.NewGuid();
            var submission = new Submission { Id = submissionId };

            _submissionRepositoryMock.Setup(x => x.GetByIdAsync(submissionId))
                .ReturnsAsync(submission);

            await _submissionService.DeleteAsync(submissionId);

            _submissionRepositoryMock.Verify(x => x.Delete(submission), Times.Once);
            _submissionRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
        }
    }
}