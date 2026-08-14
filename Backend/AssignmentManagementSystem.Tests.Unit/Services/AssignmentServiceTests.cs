using AssignmentManagementSystem.BusinessLogicLayer.BLServices;
using AssignmentManagementSystem.BusinessLogicLayer.DTOs.Assignment;
using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IRepositories;
using AssignmentManagementSystem.Tests.Unit.Helpers;
using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Moq;

namespace AssignmentManagementSystem.Tests.Unit.Services
{
    public class AssignmentServiceTests
    {
        private readonly Mock<IAssignmentRepository> _assignmentRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<ISubjectRepository> _subjectRepositoryMock;
        private readonly Mock<IClassRepository> _classRepositoryMock;
        private readonly Mock<ITeacherSubjectAssignRepository> _teacherSubjectRepositoryMock;
        private readonly Mock<IStudentClassAssignRepository> _studentClassRepositoryMock;  
        private readonly Mock<IWebHostEnvironment> _webHostEnvironmentMock;  
        private readonly AssignmentService _assignmentService;

        public AssignmentServiceTests()
        {
            _assignmentRepositoryMock = new Mock<IAssignmentRepository>();
            _userRepositoryMock = new Mock<IUserRepository>();
            _subjectRepositoryMock = new Mock<ISubjectRepository>();
            _classRepositoryMock = new Mock<IClassRepository>();
            _teacherSubjectRepositoryMock = new Mock<ITeacherSubjectAssignRepository>();
            _studentClassRepositoryMock = new Mock<IStudentClassAssignRepository>();  
            _webHostEnvironmentMock = new Mock<IWebHostEnvironment>(); 

            _assignmentService = new AssignmentService(
                _assignmentRepositoryMock.Object,
                _userRepositoryMock.Object,
                _subjectRepositoryMock.Object,
                _classRepositoryMock.Object,
                _teacherSubjectRepositoryMock.Object,
                _studentClassRepositoryMock.Object,  
                _webHostEnvironmentMock.Object      
            );
        }

        [Fact]
        public async Task GetAssignmentByIdAsync_WhenExists_ReturnsAssignment()
        {
            var assignment = new Assignment
            {
                Id = Guid.NewGuid(),
                Title = "Test Assignment",
                TeacherId = Guid.NewGuid(),
                SubjectId = Guid.NewGuid(),
                ClassId = Guid.NewGuid(),
                Status = "Published",
                IsActive = true,
                CreatedAt = DateTime.Now,
                Teacher = TestDataHelper.GetTestUsers().First(),
                Subject = TestDataHelper.GetTestSubjects().First(),
                Class = TestDataHelper.GetTestClasses().First()
            };

            _assignmentRepositoryMock.Setup(x => x.GetByIdAsync(assignment.Id))
                .ReturnsAsync(assignment);

            var result = await _assignmentService.GetByIdAsync(assignment.Id);

            result.Should().NotBeNull();
            result.Title.Should().Be(assignment.Title);
            _assignmentRepositoryMock.Verify(x => x.GetByIdAsync(assignment.Id), Times.Once);
        }

        [Fact]
        public async Task GetAssignmentByIdAsync_WhenNotExists_ReturnsNull()
        {
            var id = Guid.NewGuid();
            _assignmentRepositoryMock.Setup(x => x.GetByIdAsync(id))
                .ReturnsAsync((Assignment?)null);

            var result = await _assignmentService.GetByIdAsync(id);

            result.Should().BeNull();
            _assignmentRepositoryMock.Verify(x => x.GetByIdAsync(id), Times.Once);
        }

        [Fact]
        public async Task CreateAssignmentAsync_WithValidData_ReturnsSuccess()
        {
            var teacher = TestDataHelper.GetTestUsers().First(t => t.Role == "Teacher");
            var subject = TestDataHelper.GetTestSubjects().First();
            var classEntity = TestDataHelper.GetTestClasses().First();

            var createDto = new AssignmentCreateDto
            {
                TeacherId = teacher.Id,
                SubjectId = subject.Id,
                ClassId = classEntity.Id,
                Title = "New Assignment",
                Description = "Test Description",
                TotalMarks = 100,
                DueDate = DateTime.Now.AddDays(7),
                Status = "Published",
                IsActive = true
            };

            var createdAssignment = new Assignment
            {
                Id = Guid.NewGuid(),
                TeacherId = teacher.Id,
                SubjectId = subject.Id,
                ClassId = classEntity.Id,
                Title = createDto.Title,
                Description = createDto.Description,
                TotalMarks = createDto.TotalMarks,
                Duedate = createDto.DueDate,
                Status = createDto.Status,
                IsActive = createDto.IsActive,
                CreatedAt = DateTime.Now,
                Teacher = teacher,    
                Subject = subject,  
                Class = classEntity  
            };

            _userRepositoryMock.Setup(x => x.GetByIdAsync(teacher.Id))
                .ReturnsAsync(teacher);
            _subjectRepositoryMock.Setup(x => x.GetByIdAsync(subject.Id))
                .ReturnsAsync(subject);
            _classRepositoryMock.Setup(x => x.GetByIdAsync(classEntity.Id))
                .ReturnsAsync(classEntity);
            _teacherSubjectRepositoryMock.Setup(x => x.ExistsAsync(teacher.Id, subject.Id))
                .ReturnsAsync(true);

            _assignmentRepositoryMock.Setup(x => x.AddAsync(It.IsAny<Assignment>()))
                .Returns(Task.CompletedTask);
            _assignmentRepositoryMock.Setup(x => x.SaveChangesAsync())
                .Returns(Task.CompletedTask);

            _assignmentRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<Guid>()))
                .ReturnsAsync(createdAssignment);

            var result = await _assignmentService.CreateAsync(createDto);

            result.Should().NotBeNull();
            result.Title.Should().Be(createDto.Title);
            _assignmentRepositoryMock.Verify(x => x.AddAsync(It.IsAny<Assignment>()), Times.Once);
            _assignmentRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task CreateAssignmentAsync_WhenTeacherNotAssigned_ThrowsException()
        {
            var teacher = TestDataHelper.GetTestUsers().First(t => t.Role == "Teacher");
            var subject = TestDataHelper.GetTestSubjects().First();
            var classEntity = TestDataHelper.GetTestClasses().First();

            var createDto = new AssignmentCreateDto
            {
                TeacherId = teacher.Id,
                SubjectId = subject.Id,
                ClassId = classEntity.Id,
                Title = "New Assignment",
                Description = "Test Description",
                TotalMarks = 100,
                DueDate = DateTime.Now.AddDays(7),
                Status = "Published",
                IsActive = true
            };

            _userRepositoryMock.Setup(x => x.GetByIdAsync(teacher.Id))
                .ReturnsAsync(teacher);
            _subjectRepositoryMock.Setup(x => x.GetByIdAsync(subject.Id))
                .ReturnsAsync(subject);
            _classRepositoryMock.Setup(x => x.GetByIdAsync(classEntity.Id))
                .ReturnsAsync(classEntity);
            _teacherSubjectRepositoryMock.Setup(x => x.ExistsAsync(teacher.Id, subject.Id))
                .ReturnsAsync(false);

            await Assert.ThrowsAsync<Exception>(() => _assignmentService.CreateAsync(createDto));
        }

        [Fact]
        public async Task DeleteAssignmentAsync_WhenExists_DeletesAssignment()
        {
            var assignmentId = Guid.NewGuid();
            var assignment = new Assignment { Id = assignmentId, Title = "Test" };

            _assignmentRepositoryMock.Setup(x => x.GetByIdAsync(assignmentId))
                .ReturnsAsync(assignment);

            await _assignmentService.DeleteAsync(assignmentId);

            _assignmentRepositoryMock.Verify(x => x.Delete(assignment), Times.Once);
            _assignmentRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteAssignmentAsync_WhenNotExists_ThrowsException()
        {
            var id = Guid.NewGuid();
            _assignmentRepositoryMock.Setup(x => x.GetByIdAsync(id))
                .ReturnsAsync((Assignment?)null);

            await Assert.ThrowsAsync<Exception>(() => _assignmentService.DeleteAsync(id));
        }
    }
}