using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.DTOs.Submission
{
    public class SubmissionResponseDto
    {
        public Guid Id { get; set; }
        public Guid AssignmentId { get; set; }
        public string AssignmentTitle { get; set; } = null!;
        public Guid StudentId { get; set; }
        public string StudentName { get; set; } = null!;
        public string StudentEmail { get; set; } = null!;
        public string? SubmissionText { get; set; }
        public string? SubmissionFileUrl { get; set; }
        public DateTime SubmittedAt { get; set; }
        public string? Status { get; set; } = null!;
        public decimal? MarksObtained { get; set; }
        public string? Feedback { get; set; }
        public DateTime? GradedAt { get; set; }
        public Guid? GradedBy { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class SubmissionDetailDto
    {
        public Guid AssignmentId { get; set; }
        public string AssignmentTitle { get; set; } = null!;
        public Guid StudentId { get; set; }
        public string StudentName { get; set; } = null!;
        public string StudentEmail { get; set; } = null!;
        public SubmissionResponseDto? Submission { get; set; }
        public bool IsSubmitted { get; set; }
        public bool IsLate { get; set; }
        public DateTime? DueDate { get; set; }
    }
}
