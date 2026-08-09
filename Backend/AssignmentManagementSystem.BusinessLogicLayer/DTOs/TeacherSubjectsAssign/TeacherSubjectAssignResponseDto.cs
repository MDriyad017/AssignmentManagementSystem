using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.DTOs.TeacherSubjectsAssign
{
    public class TeacherSubjectAssignResponseDto
    {
        public Guid Id { get; set; }
        public Guid TeacherId { get; set; }
        public string TeacherName { get; set; } = null!;
        public string TeacherEmail { get; set; } = null!;
        public Guid ClassId { get; set; }
        public string ClassName { get; set; } = null!;
        public Guid SubjectId { get; set; }
        public string SubjectName { get; set; } = null!;
        public DateTime AssignedAt { get; set; }
    }

    public class TeacherSubjectAssignBulkResponseDto
    {
        public int TotalAssigned { get; set; }
        public List<TeacherSubjectAssignResponseDto> TeacherSubjectAssigns { get; set; } = new();
    }
}
