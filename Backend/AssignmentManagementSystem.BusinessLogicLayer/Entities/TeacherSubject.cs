using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AssignmentManagementSystem.BusinessLogicLayer.Entities;

[Table("teachersubjects")]
public partial class TeacherSubject
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("teacherid")]
    public int TeacherId { get; set; }

    [Column("subjectid")]
    public int SubjectId { get; set; }

    [Column("assignedat", TypeName = "timestamp without time zone")]
    public DateTime AssignedAt { get; set; }

    [Column("createdat", TypeName = "timestamp without time zone")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedat", TypeName = "timestamp without time zone")]
    public DateTime? UpdatedAt { get; set; }

    [Column("isactive")]
    public bool IsActive { get; set; }

    [ForeignKey(nameof(SubjectId))]
    [InverseProperty(nameof(Subject.TeacherSubjects))]
    public virtual Subject Subject { get; set; } = null!;

    [ForeignKey(nameof(TeacherId))]
    [InverseProperty(nameof(User.TeacherSubjects))]
    public virtual User Teacher { get; set; } = null!;
}
