using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.DTOs.TeacherSubjectsAssign
{
    public class TeacherSubjectAssignBulkCreateDTO
    {
        [Required]
        public Guid TeacherId { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "At least one subject assign is required.")]
        public List<TeacherSubjectAssignItemDto> TeacherSubjectAssigns { get; set; } = new();
    }

    public class TeacherSubjectAssignItemDto
    {
        [Required]
        public Guid ClassId { get; set; }

        [Required]
        public Guid SubjectId { get; set; }
    }
}
