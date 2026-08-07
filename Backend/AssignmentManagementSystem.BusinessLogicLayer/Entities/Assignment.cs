using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AssignmentManagementSystem.BusinessLogicLayer.Entities;

[Table("assignments")]
public partial class Assignment
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("teacherid")]
    public int TeacherId { get; set; }

    [Column("subjectid")]
    public int SubjectId { get; set; }

    [Column("classid")]
    public int ClassId { get; set; }

    [Column("title")]
    [StringLength(200)]
    public string Title { get; set; } = null!;

    [Column("description")]
    public string? Description { get; set; }

    [Column("totalmarks")]
    public int TotalMarks { get; set; }

    [Column("duedate", TypeName = "timestamp without time zone")]
    public DateTime DueDate { get; set; }

    [Column("attachmenturl")]
    [StringLength(500)]
    public string? AttachmentUrl { get; set; }

    [Column("status")]
    [StringLength(20)]
    public string Status { get; set; } = null!;

    [Column("createdat", TypeName = "timestamp without time zone")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedat", TypeName = "timestamp without time zone")]
    public DateTime? UpdatedAt { get; set; }

    [Column("isactive")]
    public bool IsActive { get; set; }

    [ForeignKey("Classid")]
    [InverseProperty("Assignments")]
    public virtual Class Class { get; set; } = null!;

    [ForeignKey("Subjectid")]
    [InverseProperty("Assignments")]
    public virtual Subject Subject { get; set; } = null!;

    [InverseProperty("Assignment")]
    public virtual ICollection<Submission> Submissions { get; set; } = new List<Submission>();

    [ForeignKey("Teacherid")]
    [InverseProperty("Assignments")]
    public virtual User Teacher { get; set; } = null!;
}
