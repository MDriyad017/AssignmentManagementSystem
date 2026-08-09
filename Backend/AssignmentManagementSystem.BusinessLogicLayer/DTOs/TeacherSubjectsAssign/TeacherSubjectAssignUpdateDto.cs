using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.DTOs.TeacherSubjectsAssign
{
    public class TeacherSubjectAssignUpdateDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public Guid TeacherId { get; set; }

        [Required]
        public Guid ClassId { get; set; }

        [Required]
        public Guid SubjectId { get; set; }
    }
}
