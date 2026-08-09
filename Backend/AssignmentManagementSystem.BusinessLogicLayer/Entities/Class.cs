using System;
using System.Collections.Generic;

namespace AssignmentManagementSystem.BusinessLogicLayer.Entities;

public partial class Class
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string Code { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    public virtual ICollection<StudentClass> StudentClasses { get; set; } = new List<StudentClass>();
    public virtual ICollection<Subject> Subjects { get; set; } = new List<Subject>();
}
