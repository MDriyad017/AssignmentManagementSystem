using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AssignmentManagementSystem.BusinessLogicLayer.Entities;

[Table("subjects")]
public partial class Subject
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    [StringLength(100)]
    public string Name { get; set; } = null!;

    [Column("code")]
    [StringLength(20)]
    public string Code { get; set; } = null!;

    [Column("classid")]
    public int Classid { get; set; }

    [Column("createdat", TypeName = "timestamp without time zone")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedat", TypeName = "timestamp without time zone")]
    public DateTime? UpdatedAt { get; set; }

    [InverseProperty("Subject")]
    public virtual ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();

    [ForeignKey("Classid")]
    [InverseProperty("Subjects")]
    public virtual Class Class { get; set; } = null!;

    [InverseProperty("Subject")]
    public virtual ICollection<TeacherSubject> TeacherSubjects { get; set; } = new List<TeacherSubject>();
}
