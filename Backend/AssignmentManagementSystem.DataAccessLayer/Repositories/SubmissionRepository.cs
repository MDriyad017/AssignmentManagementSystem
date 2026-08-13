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
    public class SubmissionRepository : ISubmissionRepository
    {
        private readonly ApplicationDbContext _context;

        public SubmissionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Submission?> GetByIdAsync(Guid id)
        {
            return await _context.Submissions
                .Include(x => x.Assignment)
                .Include(x => x.Student)
                .Include(x => x.GradedbyNavigation)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Submission?> GetByAssignmentAndStudentAsync(Guid assignmentId, Guid studentId)
        {
            return await _context.Submissions
                .Include(x => x.Assignment)
                .Include(x => x.Student)
                .FirstOrDefaultAsync(x => x.AssignmentId == assignmentId && x.StudentId == studentId);
        }

        public async Task<IEnumerable<Submission>> GetAllAsync()
        {
            return await _context.Submissions
                .Include(x => x.Assignment)
                .Include(x => x.Student)
                .Include(x => x.GradedbyNavigation)
                .OrderByDescending(x => x.SubmittedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Submission>> GetByAssignmentIdAsync(Guid assignmentId)
        {
            return await _context.Submissions
                .Include(x => x.Student)
                .Where(x => x.AssignmentId == assignmentId)
                .OrderBy(x => x.Student.FirstName)
                .ToListAsync();
        }

        public async Task<IEnumerable<Submission>> GetByStudentIdAsync(Guid studentId)
        {
            return await _context.Submissions
                .Include(x => x.Assignment)
                .Include(x => x.Student)
                .Include(x => x.GradedbyNavigation)
                .Where(x => x.StudentId == studentId)
                .OrderByDescending(x => x.SubmittedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Submission>> GetByTeacherIdAsync(Guid teacherId)
        {
            return await _context.Submissions
                .Include(x => x.Assignment)
                    .ThenInclude(a => a.Teacher)
                .Include(x => x.Assignment)
                    .ThenInclude(a => a.Class)
                .Include(x => x.Assignment)
                    .ThenInclude(a => a.Subject)
                .Include(x => x.Student)
                .Include(x => x.GradedbyNavigation)
                .Where(x => x.Assignment.TeacherId == teacherId)
                .OrderByDescending(x => x.SubmittedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Submission>> GetPendingSubmissionsAsync()
        {
            return await _context.Submissions
                .Include(x => x.Assignment)
                .Include(x => x.Student)
                .Where(x => x.Status == "Submitted" || x.Status == "Late")
                .OrderBy(x => x.Assignment.Duedate)
                .ToListAsync();
        }

        public async Task AddAsync(Submission entity)
        {
            await _context.Submissions.AddAsync(entity);
        }

        public void Update(Submission entity)
        {
            _context.Submissions.Update(entity);
        }

        public void Delete(Submission entity)
        {
            _context.Submissions.Remove(entity);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
