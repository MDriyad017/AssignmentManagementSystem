using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.Tests.Unit.Helpers
{
    public class TestDataHelper
    {
        public static List<User> GetTestUsers()
        {
            return new List<User>
            {
                new User
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    FirstName = "Admin",
                    LastName = "User",
                    Email = "admin@test.com",
                    PasswordHash = "hashed_password",
                    Role = "Admin",
                    IsActive = true,
                    CreatedAt = DateTime.Now
                },
                new User
                {
                    Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    FirstName = "Teacher",
                    LastName = "User",
                    Email = "teacher@test.com",
                    PasswordHash = "hashed_password",
                    Role = "Teacher",
                    IsActive = true,
                    CreatedAt = DateTime.Now
                },
                new User
                {
                    Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    FirstName = "Student",
                    LastName = "User",
                    Email = "student@test.com",
                    PasswordHash = "hashed_password",
                    Role = "Student",
                    IsActive = true,
                    CreatedAt = DateTime.Now
                }
            };
        }

        public static List<Class> GetTestClasses()
        {
            return new List<Class>
            {
                new Class
                {
                    Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    Name = "Class - Six",
                    Code = "C006",
                    CreatedAt = DateTime.Now
                },
                new Class
                {
                    Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    Name = "Class - Seven",
                    Code = "C007",
                    CreatedAt = DateTime.Now
                }
            };
        }

        public static List<Subject> GetTestSubjects()
        {
            return new List<Subject>
            {
                new Subject
                {
                    Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Name = "Bangla (1st Part)",
                    Code = "BF-006",
                    ClassId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    CreatedAt = DateTime.Now
                },
                new Subject
                {
                    Id = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    Name = "Bangla (2nd Part)",
                    Code = "BS-006",
                    ClassId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    CreatedAt = DateTime.Now
                }
            };
        }
    }
}
