using AssignmentManagementSystem.BusinessLogicLayer.DTOs.Class;
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
    public class ClassService : IClassService
    {

        private readonly IClassRepository _classRepository;

        public ClassService(IClassRepository classRepository)
        {
            _classRepository = classRepository;
        }

        public async Task<ClassResponseDto?> GetClassByIdAsync(int id)
        {
            try
            {
                Class? classEntity = await _classRepository.GetByIdAsync(id);

                if (classEntity == null)
                    return null;

                return MapToResponseDto(classEntity);
            }
            catch
            {
                throw;
            }
        }

        public async Task<IEnumerable<ClassResponseDto>> GetAllClassesAsync()
        {
            try
            {
                IEnumerable<Class> classes = await _classRepository.GetAllAsync();

                return classes.Select(MapToResponseDto);
            }
            catch
            {
                throw;
            }
        }

        public async Task CreateClassAsync(ClassCreateDto entity)
        {
            try
            {
                if (await _classRepository.ExistsByNameAsync(entity.Name))
                    throw new Exception("Class name already exists.");

                if (await _classRepository.ExistsByCodeAsync(entity.Code))
                    throw new Exception("Class code already exists.");

                Class classEntity = new()
                {
                    Name = entity.Name,
                    Code = entity.Code,
                    CreatedAt = DateTime.Now
                };

                await _classRepository.AddAsync(classEntity);
                await _classRepository.SaveChangesAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task UpdateClassAsync(int id, ClassUpdateDto entity)
        {
            try
            {
                Class? classEntity = await _classRepository.GetByIdAsync(id);

                if (classEntity == null)
                    throw new Exception("Class not found.");

                if (classEntity.Name != entity.Name && await _classRepository.ExistsByNameAsync(entity.Name))
                {
                    throw new Exception("Class name already exists.");
                }

                if (classEntity.Code != entity.Code && await _classRepository.ExistsByCodeAsync(entity.Code))
                {
                    throw new Exception("Class code already exists.");
                }

                classEntity.Name = entity.Name;
                classEntity.Code = entity.Code;
                classEntity.UpdatedAt = DateTime.Now;

                _classRepository.Update(classEntity);
                await _classRepository.SaveChangesAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task DeleteClassAsync(int id)
        {
            try
            {
                Class? classEntity = await _classRepository.GetByIdAsync(id);

                if (classEntity == null)
                    throw new Exception("Class not found.");

                _classRepository.Delete(classEntity);
                await _classRepository.SaveChangesAsync();
            }
            catch
            {
                throw;
            }
        }

        private static ClassResponseDto MapToResponseDto(Class classEntity)
        {
            return new ClassResponseDto
            {
                Id = classEntity.Id,
                Name = classEntity.Name,
                Code = classEntity.Code
            };
        }
    }
}
