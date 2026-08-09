using System;
using System.Collections.Generic;

namespace AssignmentManagementSystem.BusinessLogicLayer.Entities;

public partial class Assignment
{
    public Guid Id { get; set; }
    public Guid TeacherId { get; set; }
    public Guid SubjectId { get; set; }
    public Guid ClassId { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public int? TotalMarks { get; set; }
    public DateTime? Duedate { get; set; }
    public string? AttachmentUrl { get; set; }
    public string? Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; }

    public virtual Class Class { get; set; } = null!;
    public virtual Subject Subject { get; set; } = null!;
    public virtual ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    public virtual User Teacher { get; set; } = null!;
}
