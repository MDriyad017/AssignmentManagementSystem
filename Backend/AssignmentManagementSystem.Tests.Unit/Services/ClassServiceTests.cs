using AssignmentManagementSystem.BusinessLogicLayer.BLServices;
using AssignmentManagementSystem.BusinessLogicLayer.DTOs.Class;
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
    public class ClassServiceTests
    {
        private readonly Mock<IClassRepository> _classRepositoryMock;
        private readonly ClassService _classService;
        private readonly Fixture _fixture;

        public ClassServiceTests()
        {
            _classRepositoryMock = new Mock<IClassRepository>();
            _classService = new ClassService(_classRepositoryMock.Object);
            _fixture = new Fixture();
        }

        [Fact]
        public async Task GetClassByIdAsync_WhenClassExists_ReturnsClass()
        {
            var classId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
            var expectedClass = TestDataHelper.GetTestClasses().First(c => c.Id == classId);

            _classRepositoryMock.Setup(x => x.GetByIdAsync(classId))
                .ReturnsAsync(expectedClass);

            var result = await _classService.GetClassByIdAsync(classId);

            result.Should().NotBeNull();
            result.Id.Should().Be(classId);
            result.Name.Should().Be(expectedClass.Name);
            _classRepositoryMock.Verify(x => x.GetByIdAsync(classId), Times.Once);
        }

        [Fact]
        public async Task GetAllClassesAsync_ReturnsAllClasses()
        {
            var classes = TestDataHelper.GetTestClasses();
            _classRepositoryMock.Setup(x => x.GetAllAsync())
                .ReturnsAsync(classes);

            var result = await _classService.GetAllClassesAsync();

            result.Should().NotBeNull();
            result.Count().Should().Be(classes.Count);
            _classRepositoryMock.Verify(x => x.GetAllAsync(), Times.Once);
        }

        [Fact]
        public async Task CreateClassAsync_WhenNameAlreadyExists_ThrowsException()
        {
            var existingClass = TestDataHelper.GetTestClasses().First();
            var createDto = new ClassCreateDto
            {
                Name = existingClass.Name,
                Code = "NEW001"
            };

            _classRepositoryMock.Setup(x => x.ExistsByNameAsync(createDto.Name))
                .ReturnsAsync(true);

            await Assert.ThrowsAsync<Exception>(() => _classService.CreateClassAsync(createDto));
            _classRepositoryMock.Verify(x => x.ExistsByNameAsync(createDto.Name), Times.Once);
        }

        [Fact]
        public async Task CreateClassAsync_WhenCodeAlreadyExists_ThrowsException()
        {
            var existingClass = TestDataHelper.GetTestClasses().First();
            var createDto = new ClassCreateDto
            {
                Name = "New Class",
                Code = existingClass.Code
            };

            _classRepositoryMock.Setup(x => x.ExistsByNameAsync(createDto.Name))
                .ReturnsAsync(false);
            _classRepositoryMock.Setup(x => x.ExistsByCodeAsync(createDto.Code))
                .ReturnsAsync(true);

            await Assert.ThrowsAsync<Exception>(() => _classService.CreateClassAsync(createDto));
            _classRepositoryMock.Verify(x => x.ExistsByCodeAsync(createDto.Code), Times.Once);
        }

        [Fact]
        public async Task CreateClassAsync_WhenValid_AddsClass()
        {
            var createDto = new ClassCreateDto
            {
                Name = "Class - New",
                Code = "NEW001"
            };

            _classRepositoryMock.Setup(x => x.ExistsByNameAsync(createDto.Name))
                .ReturnsAsync(false);
            _classRepositoryMock.Setup(x => x.ExistsByCodeAsync(createDto.Code))
                .ReturnsAsync(false);
            _classRepositoryMock.Setup(x => x.AddAsync(It.IsAny<Class>()))
                .Returns(Task.CompletedTask);
            _classRepositoryMock.Setup(x => x.SaveChangesAsync())
                .Returns(Task.CompletedTask);

            await _classService.CreateClassAsync(createDto);

            _classRepositoryMock.Verify(x => x.AddAsync(It.IsAny<Class>()), Times.Once);
            _classRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
        }
    }
}
