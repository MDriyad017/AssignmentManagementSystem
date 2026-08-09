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
    public class TeacherSubjectAssignRepository : ITeacherSubjectAssignRepository
    {
        private readonly ApplicationDbContext _context;

        public TeacherSubjectAssignRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<TeacherSubject?> GetByIdAsync(Guid id)
        {
            return await _context.TeacherSubjects
                .Include(x => x.Teacher)
                .Include(x => x.Subject)
                .ThenInclude(s => s.Class)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<TeacherSubject>> GetAllAsync()
        {
            return await _context.TeacherSubjects
                .Include(x => x.Teacher)
                .Include(x => x.Subject)
                .ThenInclude(s => s.Class)
                .OrderBy(x => x.Teacher.FirstName)
                .ToListAsync();
        }

        public async Task<IEnumerable<TeacherSubject>> GetByTeacherIdAsync(Guid teacherId)
        {
            return await _context.TeacherSubjects
                .Include(x => x.Teacher)
                .Include(x => x.Subject)
                .ThenInclude(s => s.Class)
                .Where(x => x.TeacherId == teacherId)
                .OrderBy(x => x.Subject.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<TeacherSubject>> GetBySubjectIdAsync(Guid subjectId)
        {
            return await _context.TeacherSubjects
                .Include(x => x.Teacher)
                .Include(x => x.Subject)
                .ThenInclude(s => s.Class)
                .Where(x => x.SubjectId == subjectId)
                .OrderBy(x => x.Teacher.FirstName)
                .ToListAsync();
        }

        public async Task<IEnumerable<TeacherSubject>> GetByClassIdAsync(Guid classId)
        {
            return await _context.TeacherSubjects
                .Include(x => x.Teacher)
                .Include(x => x.Subject)
                .ThenInclude(s => s.Class)
                .Where(x => x.Subject.ClassId == classId)
                .OrderBy(x => x.Teacher.FirstName)
                .ToListAsync();
        }

        public async Task<bool> ExistsAsync(Guid teacherId, Guid subjectId)
        {
            return await _context.TeacherSubjects
                .AnyAsync(x => x.TeacherId == teacherId && x.SubjectId == subjectId);
        }

        public async Task<bool> ExistsByTeacherClassSubjectAsync(Guid teacherId, Guid classId, Guid subjectId)
        {
            return await _context.TeacherSubjects
                .AnyAsync(x => x.TeacherId == teacherId && x.Subject.ClassId == classId && x.SubjectId == subjectId);
        }

        public async Task AddAsync(TeacherSubject entity)
        {
            await _context.TeacherSubjects.AddAsync(entity);
        }

        public async Task AddRangeAsync(IEnumerable<TeacherSubject> entities)
        {
            await _context.TeacherSubjects.AddRangeAsync(entities);
        }

        public void Update(TeacherSubject entity)
        {
            _context.TeacherSubjects.Update(entity);
        }

        public void Delete(TeacherSubject entity)
        {
            _context.TeacherSubjects.Remove(entity);
        }

        public void DeleteRange(IEnumerable<TeacherSubject> entities)
        {
            _context.TeacherSubjects.RemoveRange(entities);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
