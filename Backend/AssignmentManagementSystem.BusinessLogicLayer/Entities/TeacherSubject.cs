using System;
using System.Collections.Generic;

namespace AssignmentManagementSystem.BusinessLogicLayer.Entities;

public partial class TeacherSubject
{
    public Guid Id { get; set; }
    public Guid TeacherId { get; set; }
    public Guid SubjectId { get; set; }
    public DateTime AssignedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public virtual Subject Subject { get; set; } = null!;
    public virtual User Teacher { get; set; } = null!;
}
