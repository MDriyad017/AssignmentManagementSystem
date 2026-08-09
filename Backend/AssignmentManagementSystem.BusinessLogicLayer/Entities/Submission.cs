using System;
using System.Collections.Generic;

namespace AssignmentManagementSystem.BusinessLogicLayer.Entities;

public partial class Submission
{
    public Guid Id { get; set; }
    public Guid AssignmentId { get; set; }
    public Guid StudentId { get; set; }
    public string? SubmissionText { get; set; }
    public string? SubmissionFileUrl { get; set; }
    public DateTime SubmittedAt { get; set; }
    public string? Status { get; set; }
    public decimal? MarksObtained { get; set; }
    public string? FeedBack { get; set; }
    public DateTime? GradedAt { get; set; }
    public Guid? GradedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; }

    public virtual Assignment Assignment { get; set; } = null!;
    public virtual User? GradedbyNavigation { get; set; }
    public virtual User Student { get; set; } = null!;
}
