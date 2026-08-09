using System;
using System.Collections.Generic;

namespace AssignmentManagementSystem.BusinessLogicLayer.Entities;

public partial class StudentClass
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public Guid ClassId { get; set; }
    public DateTime EnrolledAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public virtual Class Class { get; set; } = null!;
    public virtual User Student { get; set; } = null!;
}
