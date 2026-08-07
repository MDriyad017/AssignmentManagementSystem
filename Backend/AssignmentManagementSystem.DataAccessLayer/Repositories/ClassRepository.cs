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
    public class ClassRepository : IClassRepository
    {
        private readonly ApplicationDbContext _context;

        public ClassRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Class?> GetByIdAsync(int id)
        {
            return await _context.Classes.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<Class>> GetAllAsync()
        {
            return await _context.Classes.OrderBy(x => x.Name).ToListAsync();
        }

        public async Task<Class?> GetByNameAsync(string name)
        {
            return await _context.Classes.FirstOrDefaultAsync(x => x.Name == name);
        }

        public async Task<Class?> GetByCodeAsync(string code)
        {
            return await _context.Classes.FirstOrDefaultAsync(x => x.Code == code);
        }

        public async Task<bool> ExistsByNameAsync(string name)
        {
            return await _context.Classes.AnyAsync(x => x.Name == name);
        }

        public async Task<bool> ExistsByCodeAsync(string code)
        {
            return await _context.Classes.AnyAsync(x => x.Code == code);
        }

        public async Task AddAsync(Class classEntity)
        {
            await _context.Classes.AddAsync(classEntity);
        }

        public void Update(Class classEntity)
        {
            _context.Classes.Update(classEntity);
        }

        public void Delete(Class classEntity)
        {
            _context.Classes.Remove(classEntity);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
