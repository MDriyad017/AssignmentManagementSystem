using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.DTOs.Submission
{
    public class SubmissionCreateDto
    {
        [Required]
        public Guid AssignmentId { get; set; }

        [Required]
        public Guid StudentId { get; set; }
        public string? SubmissionText { get; set; }
        public string? SubmissionFileUrl { get; set; }
    }
}
