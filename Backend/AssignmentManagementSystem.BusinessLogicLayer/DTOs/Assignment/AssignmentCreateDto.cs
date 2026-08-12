using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.DTOs.Assignment
{
    public class AssignmentCreateDto
    {
        [Required]
        public Guid TeacherId { get; set; }
        [Required]
        public Guid SubjectId { get; set; }
        [Required]
        public Guid ClassId { get; set; }
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        [Range(0, int.MaxValue)]
        public int? TotalMarks { get; set; }
        public DateTime? DueDate { get; set; }
        public string? Status { get; set; } = "Published";
        public string? AttachmentUrl { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
