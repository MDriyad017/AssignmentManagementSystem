using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.DTOs.Submission
{
    public class SubmissionGradeDto
    {
        [Required]
        public Guid SubmissionId { get; set; }

        [Required]
        public decimal MarksObtained { get; set; }
        public string? Feedback { get; set; }

        [Required]
        public Guid GradedBy { get; set; }
        public string Status { get; set; } = "Graded";
    }
}
