using AssignmentManagementSystem.DataAccessLayer.Data;
using Microsoft.EntityFrameworkCore;

namespace AssignmentManagementSystem.API.Extensions
{
    public static class DatabaseExtensions
    {
        public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseNpgsql(
                    configuration.GetConnectionString("appCon"));
            });

            return services;
        }
    }
}
