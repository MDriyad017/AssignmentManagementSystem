using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AssignmentManagementSystem.BusinessLogicLayer.Entities;

[Table("users")]
public partial class User
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("email")]
    [StringLength(255)]
    public string Email { get; set; } = null!;

    [Column("passwordhash")]
    [StringLength(500)]
    public string PasswordHash { get; set; } = null!;

    [Column("firstname")]
    [StringLength(100)]
    public string FirstName { get; set; } = null!;

    [Column("lastname")]
    [StringLength(100)]
    public string LastName { get; set; } = null!;

    [Column("role")]
    [StringLength(20)]
    public string Role { get; set; } = null!;

    [Column("profilepictureurl")]
    [StringLength(500)]
    public string? ProfilePictureUrl { get; set; }

    [Column("isactive")]
    public bool IsActive { get; set; }

    [Column("createdat", TypeName = "timestamp without time zone")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedat", TypeName = "timestamp without time zone")]
    public DateTime? UpdatedAt { get; set; }

    [InverseProperty("Teacher")]
    public virtual ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();

    [InverseProperty("User")]
    public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();

    [InverseProperty("Student")]
    public virtual ICollection<StudentClass> StudentClasses { get; set; } = new List<StudentClass>();

    [InverseProperty("GradedbyNavigation")]
    public virtual ICollection<Submission> SubmissionGradedbyNavigations { get; set; } = new List<Submission>();

    [InverseProperty("Student")]
    public virtual ICollection<Submission> SubmissionStudents { get; set; } = new List<Submission>();

    [InverseProperty("Teacher")]
    public virtual ICollection<TeacherSubject> TeacherSubjects { get; set; } = new List<TeacherSubject>();
}
