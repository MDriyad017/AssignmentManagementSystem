using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AssignmentManagementSystem.BusinessLogicLayer.Entities;

[Table("studentclasses")]
public partial class StudentClass
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("studentid")]
    public int StudentId { get; set; }

    [Column("classid")]
    public int ClassId { get; set; }

    [Column("enrolledat", TypeName = "timestamp without time zone")]
    public DateTime EnrolledAt { get; set; }

    [Column("createdat", TypeName = "timestamp without time zone")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedat", TypeName = "timestamp without time zone")]
    public DateTime? UpdatedAt { get; set; }

    [Column("isactive")]
    public bool IsActive { get; set; }

    [ForeignKey(nameof(ClassId))]
    [InverseProperty(nameof(Class.StudentClasses))]
    public virtual Class Class { get; set; } = null!;

    [ForeignKey(nameof(StudentId))]
    [InverseProperty(nameof(User.StudentClasses))]
    public virtual User Student { get; set; } = null!;
}
