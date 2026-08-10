using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IRepositories;
using AssignmentManagementSystem.DataAccessLayer.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.DataAccessLayer.Repositories
{
    public class StudentClassAssignRepository : IStudentClassAssignRepository
    {
        private readonly ApplicationDbContext _context;

        public StudentClassAssignRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<StudentClass?> GetByIdAsync(Guid id)
        {
            return await _context.StudentClasses
                .Include(x => x.Student)
                .Include(x => x.Class)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<StudentClass>> GetAllAsync()
        {
            return await _context.StudentClasses
                .Include(x => x.Student)
                .Include(x => x.Class)
                .OrderBy(x => x.Student.FirstName)
                .ToListAsync();
        }

        public async Task<IEnumerable<StudentClass>> GetByStudentIdAsync(Guid studentId)
        {
            return await _context.StudentClasses
                .Include(x => x.Student)
                .Include(x => x.Class)
                .Where(x => x.StudentId == studentId)
                .OrderBy(x => x.Class.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<StudentClass>> GetByClassIdAsync(Guid classId)
        {
            return await _context.StudentClasses
                .Include(x => x.Student)
                .Include(x => x.Class)
                .Where(x => x.ClassId == classId)
                .OrderBy(x => x.Student.FirstName)
                .ToListAsync();
        }

        public async Task<bool> ExistsAsync(Guid studentId, Guid classId)
        {
            return await _context.StudentClasses
                .AnyAsync(x => x.StudentId == studentId && x.ClassId == classId);
        }

        public async Task AddAsync(StudentClass entity)
        {
            await _context.StudentClasses.AddAsync(entity);
        }

        public void Update(StudentClass entity)
        {
            _context.StudentClasses.Update(entity);
        }

        public void Delete(StudentClass entity)
        {
            _context.StudentClasses.Remove(entity);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}