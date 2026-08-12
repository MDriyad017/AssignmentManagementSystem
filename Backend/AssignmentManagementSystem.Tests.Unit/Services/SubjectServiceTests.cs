using AssignmentManagementSystem.BusinessLogicLayer.BLServices;
using AssignmentManagementSystem.BusinessLogicLayer.DTOs.Subject;
using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IRepositories;
using AssignmentManagementSystem.Tests.Unit.Helpers;
using AutoFixture;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.Tests.Unit.Services
{
    public class SubjectServiceTests
    {
        private readonly Mock<ISubjectRepository> _subjectRepositoryMock;
        private readonly Mock<IClassRepository> _classRepositoryMock;
        private readonly SubjectService _subjectService;
        private readonly Fixture _fixture;

        public SubjectServiceTests()
        {
            _subjectRepositoryMock = new Mock<ISubjectRepository>();
            _classRepositoryMock = new Mock<IClassRepository>();
            _subjectService = new SubjectService(_subjectRepositoryMock.Object, _classRepositoryMock.Object);
            _fixture = new Fixture();
        }

        [Fact]
        public async Task GetSubjectByIdAsync_WhenSubjectExists_ReturnsSubject()
        {
            var subjectId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc");
            var expectedSubject = TestDataHelper.GetTestSubjects().First(s => s.Id == subjectId);

            _subjectRepositoryMock.Setup(x => x.GetByIdAsync(subjectId))
                .ReturnsAsync(expectedSubject);

            var result = await _subjectService.GetSubjectByIdAsync(subjectId);

            result.Should().NotBeNull();
            result.Id.Should().Be(subjectId);
            result.Name.Should().Be(expectedSubject.Name);
            _subjectRepositoryMock.Verify(x => x.GetByIdAsync(subjectId), Times.Once);
        }

        [Fact]
        public async Task GetAllSubjectsAsync_ReturnsAllSubjects()
        {
            var subjects = TestDataHelper.GetTestSubjects();
            _subjectRepositoryMock.Setup(x => x.GetAllAsync())
                .ReturnsAsync(subjects);

            var result = await _subjectService.GetAllSubjectsAsync();

            result.Should().NotBeNull();
            result.Count().Should().Be(subjects.Count);
            _subjectRepositoryMock.Verify(x => x.GetAllAsync(), Times.Once);
        }

        [Fact]
        public async Task CreateSubjectAsync_WhenClassNotFound_ThrowsException()
        {
            var createDto = new SubjectCreateDto
            {
                Name = "New Subject",
                Code = "NS001",
                ClassId = Guid.NewGuid()
            };

            _classRepositoryMock.Setup(x => x.GetByIdAsync(createDto.ClassId))
                .ReturnsAsync((Class?)null);

            await Assert.ThrowsAsync<Exception>(() => _subjectService.CreateSubjectAsync(createDto));
            _classRepositoryMock.Verify(x => x.GetByIdAsync(createDto.ClassId), Times.Once);
        }

        [Fact]
        public async Task CreateSubjectAsync_WhenSubjectNameExistsInClass_ThrowsException()
        {
            var classId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
            var existingSubject = TestDataHelper.GetTestSubjects().First();

            var createDto = new SubjectCreateDto
            {
                Name = existingSubject.Name,
                Code = "NS001",
                ClassId = classId
            };

            var classEntity = TestDataHelper.GetTestClasses().First(c => c.Id == classId);

            _classRepositoryMock.Setup(x => x.GetByIdAsync(classId))
                .ReturnsAsync(classEntity);
            _subjectRepositoryMock.Setup(x => x.ExistsByNameInClassAsync(createDto.Name, classId))
                .ReturnsAsync(true);

            await Assert.ThrowsAsync<Exception>(() => _subjectService.CreateSubjectAsync(createDto));
            _subjectRepositoryMock.Verify(x => x.ExistsByNameInClassAsync(createDto.Name, classId), Times.Once);
        }
    }
}
