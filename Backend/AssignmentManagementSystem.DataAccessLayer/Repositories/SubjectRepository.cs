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
    public class SubjectRepository : ISubjectRepository
    {
        private readonly ApplicationDbContext _context;

        public SubjectRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Subject?> GetByIdAsync(Guid id)
        {
            return await _context.Subjects
                .Include(x => x.Class)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<Subject>> GetAllAsync()
        {
            return await _context.Subjects
                .Include(x => x.Class)
                .OrderBy(x => x.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Subject>> GetByClassIdAsync(Guid classId)
        {
            return await _context.Subjects
                .Include(x => x.Class)
                .Where(x => x.ClassId == classId)
                .OrderBy(x => x.Name)
                .ToListAsync();
        }

        public async Task<Subject?> GetByNameAsync(string name)
        {
            return await _context.Subjects
                .FirstOrDefaultAsync(x => x.Name == name);
        }

        public async Task<Subject?> GetByCodeAsync(string code)
        {
            return await _context.Subjects
                .FirstOrDefaultAsync(x => x.Code == code);
        }

        public async Task<bool> ExistsByNameAsync(string name)
        {
            return await _context.Subjects.AnyAsync(x => x.Name == name);
        }

        public async Task<bool> ExistsByCodeAsync(string code)
        {
            return await _context.Subjects.AnyAsync(x => x.Code == code);
        }

        public async Task<bool> ExistsByNameInClassAsync(string name, Guid classId)
        {
            return await _context.Subjects.AnyAsync(x => x.Name == name && x.ClassId == classId);
        }

        public async Task<bool> ExistsByCodeInClassAsync(string code, Guid classId)
        {
            return await _context.Subjects.AnyAsync(x => x.Code == code && x.ClassId == classId);
        }

        public async Task AddAsync(Subject subject)
        {
            await _context.Subjects.AddAsync(subject);
        }

        public void Update(Subject subject)
        {
            _context.Subjects.Update(subject);
        }

        public void Delete(Subject subject)
        {
            _context.Subjects.Remove(subject);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
