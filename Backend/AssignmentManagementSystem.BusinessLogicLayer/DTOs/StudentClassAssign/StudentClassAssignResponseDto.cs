using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.DTOs.StudentClassAssign
{
    public class StudentClassAssignResponseDto
    {
        public Guid Id { get; set; }
        public Guid StudentId { get; set; }
        public string StudentName { get; set; } = null!;
        public string StudentEmail { get; set; } = null!;
        public Guid ClassId { get; set; }
        public string ClassName { get; set; } = null!;
        public string ClassCode { get; set; } = null!;
        public DateTime EnrolledAt { get; set; }
    }

    public class StudentGroupResponseDto
    {
        public Guid StudentId { get; set; }
        public string StudentName { get; set; } = null!;
        public string StudentEmail { get; set; } = null!;
        public StudentClassAssignResponseDto? Class { get; set; }
    }
    public class StudentClassDetailDto
    {
        public Guid StudentId { get; set; }
        public string StudentName { get; set; } = null!;
        public string StudentEmail { get; set; } = null!;
        public Guid ClassId { get; set; }
        public string ClassName { get; set; } = null!;
        public List<TeacherSubjectDetailDto> Teachers { get; set; } = new();
    }

    public class TeacherSubjectDetailDto
    {
        public Guid TeacherId { get; set; }
        public string TeacherName { get; set; } = null!;
        public List<SubjectDetailDto> Subjects { get; set; } = new();
    }

    public class SubjectDetailDto
    {
        public Guid SubjectId { get; set; }
        public string SubjectName { get; set; } = null!;
    }
}
