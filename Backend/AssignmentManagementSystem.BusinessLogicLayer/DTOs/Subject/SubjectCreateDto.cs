using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssignmentManagementSystem.BusinessLogicLayer.DTOs.Subject
{
    public class SubjectCreateDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = null!;

        public string? Code { get; set; }

        [Required]
        public Guid ClassId { get; set; }
    }
}
