using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.DTOs.TeacherSubjectsAssign
{
    public class TeacherGroupResponseDto
    {
        public Guid TeacherId { get; set; }
        public string TeacherName { get; set; } = null!;
        public string TeacherEmail { get; set; } = null!;
        public List<TeacherSubjectAssignResponseDto> Assigns { get; set; } = new();
    }
}
