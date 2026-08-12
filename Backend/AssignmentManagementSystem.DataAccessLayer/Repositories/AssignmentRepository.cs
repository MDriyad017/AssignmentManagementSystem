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
    public class AssignmentRepository : IAssignmentRepository
    {
        private readonly ApplicationDbContext _context;

        public AssignmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Assignment?> GetByIdAsync(Guid id)
        {
            return await _context.Assignments
                .Include(x => x.Teacher)
                .Include(x => x.Subject)
                .Include(x => x.Class)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<Assignment>> GetAllAsync()
        {
            return await _context.Assignments
                .Include(x => x.Teacher)
                .Include(x => x.Subject)
                .Include(x => x.Class)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Assignment>> GetByTeacherIdAsync(Guid teacherId)
        {
            return await _context.Assignments
                .Include(x => x.Teacher)
                .Include(x => x.Subject)
                .Include(x => x.Class)
                .Where(x => x.TeacherId == teacherId)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Assignment>> GetByClassIdAsync(Guid classId)
        {
            return await _context.Assignments
                .Include(x => x.Teacher)
                .Include(x => x.Subject)
                .Include(x => x.Class)
                .Where(x => x.ClassId == classId)
                .OrderByDescending(x => x.Duedate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Assignment>> GetBySubjectIdAsync(Guid subjectId)
        {
            return await _context.Assignments
                .Include(x => x.Teacher)
                .Include(x => x.Subject)
                .Include(x => x.Class)
                .Where(x => x.SubjectId == subjectId)
                .OrderByDescending(x => x.Duedate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Assignment>> GetPublishedAssignmentsAsync()
        {
            return await _context.Assignments
                .Include(x => x.Teacher)
                .Include(x => x.Subject)
                .Include(x => x.Class)
                .Where(x => x.Status == "Published" && x.IsActive && x.Duedate > DateTime.Now)
                .OrderBy(x => x.Duedate)
                .ToListAsync();
        }

        public async Task AddAsync(Assignment entity)
        {
            await _context.Assignments.AddAsync(entity);
        }

        public void Update(Assignment entity)
        {
            _context.Assignments.Update(entity);
        }

        public void Delete(Assignment entity)
        {
            _context.Assignments.Remove(entity);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
