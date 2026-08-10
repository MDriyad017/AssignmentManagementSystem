using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.DTOs.StudentClassAssign
{
    public class StudentClassAssignCreateDto
    {
        [Required]
        public Guid StudentId { get; set; }

        [Required]
        public Guid ClassId { get; set; }
    }
}
