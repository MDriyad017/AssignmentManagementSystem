using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AssignmentManagementSystem.BusinessLogicLayer.Entities;

[Table("submissions")]
public partial class Submission
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("assignmentid")]
    public int AssignmentId { get; set; }

    [Column("studentid")]
    public int StudentId { get; set; }

    [Column("submissiontext")]
    public string? SubmissionText { get; set; }

    [Column("submissionfileurl")]
    [StringLength(500)]
    public string? SubmissionFileUrl { get; set; }

    [Column("submittedat", TypeName = "timestamp without time zone")]
    public DateTime SubmittedAt { get; set; }

    [Column("status")]
    [StringLength(20)]
    public string Status { get; set; } = null!;

    [Column("marksobtained")]
    [Precision(5, 2)]
    public decimal? MarksObtained { get; set; }

    [Column("feedback")]
    public string? FeedBack { get; set; }

    [Column("gradedat", TypeName = "timestamp without time zone")]
    public DateTime? GradedAt { get; set; }

    [Column("gradedby")]
    public int? GradedBy { get; set; }

    [Column("createdat", TypeName = "timestamp without time zone")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedat", TypeName = "timestamp without time zone")]
    public DateTime? UpdatedAt { get; set; }

    [Column("isactive")]
    public bool IsActive { get; set; }

    [ForeignKey("Assignmentid")]
    [InverseProperty("Submissions")]
    public virtual Assignment Assignment { get; set; } = null!;

    [ForeignKey("Gradedby")]
    [InverseProperty("SubmissionGradedbyNavigations")]
    public virtual User? GradedbyNavigation { get; set; }

    [ForeignKey("Studentid")]
    [InverseProperty("SubmissionStudents")]
    public virtual User Student { get; set; } = null!;
}
