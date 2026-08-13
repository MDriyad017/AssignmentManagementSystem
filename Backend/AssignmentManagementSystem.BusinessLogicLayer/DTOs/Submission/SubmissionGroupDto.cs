using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.DTOs.Submission
{
    public class SubmissionGroupDto
    {
        public Guid AssignmentId { get; set; }
        public string AssignmentTitle { get; set; } = null!;
        public Guid TeacherId { get; set; }
        public string TeacherName { get; set; } = null!;
        public Guid ClassId { get; set; }
        public string ClassName { get; set; } = null!;
        public Guid SubjectId { get; set; }
        public string SubjectName { get; set; } = null!;
        public DateTime? DueDate { get; set; }
        public int? TotalMarks { get; set; }
        public List<SubmissionResponseDto> Submissions { get; set; } = new();
    }
}
