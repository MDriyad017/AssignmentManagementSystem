using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.DTOs.Assignment
{
    public class AssignmentResponseDto
    {
        public Guid Id { get; set; }
        public Guid TeacherId { get; set; }
        public string TeacherName { get; set; } = null!;
        public Guid SubjectId { get; set; }
        public string SubjectName { get; set; } = null!;
        public Guid ClassId { get; set; }
        public string ClassName { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int? TotalMarks { get; set; }
        public DateTime? DueDate { get; set; }
        public string? Status { get; set; }
        public string? AttachmentUrl { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? DaysRemaining => DueDate.HasValue ? (int?)(DueDate.Value - DateTime.Now).TotalDays : null;
        public bool IsOverdue => DueDate.HasValue && DueDate.Value < DateTime.Now;
    }
}
