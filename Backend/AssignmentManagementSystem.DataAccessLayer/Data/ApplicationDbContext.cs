using System;
using System.Collections.Generic;
using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace AssignmentManagementSystem.DataAccessLayer.Data;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Assignment> Assignments { get; set; }

    public virtual DbSet<AuditLog> AuditLogs { get; set; }

    public virtual DbSet<Class> Classes { get; set; }

    public virtual DbSet<StudentClass> StudentClasses { get; set; }

    public virtual DbSet<Subject> Subjects { get; set; }

    public virtual DbSet<Submission> Submissions { get; set; }

    public virtual DbSet<TeacherSubject> TeacherSubjects { get; set; }

    public virtual DbSet<User> Users { get; set; }

    // ✅ REMOVED OnConfiguring - No Hardcoded Connection String

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Assignment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("assignments_pkey");
            entity.ToTable("assignments");
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()").HasColumnName("id");
            entity.Property(e => e.AttachmentUrl).HasMaxLength(500).HasColumnName("attachmenturl");
            entity.Property(e => e.ClassId).HasColumnName("classid");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnType("timestamp without time zone").HasColumnName("createdat");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Duedate).HasColumnType("timestamp without time zone").HasColumnName("duedate");
            entity.Property(e => e.IsActive).HasDefaultValue(true).HasColumnName("isactive");
            entity.Property(e => e.Status).HasMaxLength(20).HasDefaultValueSql("'Published'::character varying").HasColumnName("status");
            entity.Property(e => e.SubjectId).HasColumnName("subjectid");
            entity.Property(e => e.TeacherId).HasColumnName("teacherid");
            entity.Property(e => e.Title).HasMaxLength(200).HasColumnName("title");
            entity.Property(e => e.TotalMarks).HasColumnName("totalmarks");
            entity.Property(e => e.UpdatedAt).HasColumnType("timestamp without time zone").HasColumnName("updatedat");
            entity.HasOne(d => d.Class).WithMany(p => p.Assignments).HasForeignKey(d => d.ClassId).OnDelete(DeleteBehavior.Restrict).HasConstraintName("fk_assignments_class");
            entity.HasOne(d => d.Subject).WithMany(p => p.Assignments).HasForeignKey(d => d.SubjectId).OnDelete(DeleteBehavior.Restrict).HasConstraintName("fk_assignments_subject");
            entity.HasOne(d => d.Teacher).WithMany(p => p.Assignments).HasForeignKey(d => d.TeacherId).OnDelete(DeleteBehavior.Restrict).HasConstraintName("fk_assignments_teacher");
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("auditlogs_pkey");
            entity.ToTable("auditlogs");
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()").HasColumnName("id");
            entity.Property(e => e.Action).HasMaxLength(100).HasColumnName("action");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnType("timestamp without time zone").HasColumnName("createdat");
            entity.Property(e => e.EntityId).HasColumnName("entityid");
            entity.Property(e => e.EntityName).HasMaxLength(100).HasColumnName("entityname");
            entity.Property(e => e.IpAddress).HasMaxLength(50).HasColumnName("ipaddress");
            entity.Property(e => e.NewValues).HasColumnType("jsonb").HasColumnName("newvalues");
            entity.Property(e => e.OldValues).HasColumnType("jsonb").HasColumnName("oldvalues");
            entity.Property(e => e.UserAgent).HasMaxLength(500).HasColumnName("useragent");
            entity.Property(e => e.UserId).HasColumnName("userid");
            entity.HasOne(d => d.User).WithMany(p => p.AuditLogs).HasForeignKey(d => d.UserId).OnDelete(DeleteBehavior.Restrict).HasConstraintName("fk_auditlogs_user");
        });

        modelBuilder.Entity<Class>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("classes_pkey");
            entity.ToTable("classes");
            entity.HasIndex(e => e.Code, "classes_code_key").IsUnique();
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()").HasColumnName("id");
            entity.Property(e => e.Code).HasMaxLength(20).HasColumnName("code");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnType("timestamp without time zone").HasColumnName("createdat");
            entity.Property(e => e.Name).HasMaxLength(100).HasColumnName("name");
            entity.Property(e => e.UpdatedAt).HasColumnType("timestamp without time zone").HasColumnName("updatedat");
        });

        modelBuilder.Entity<StudentClass>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("studentclasses_pkey");
            entity.ToTable("studentclasses");
            entity.HasIndex(e => new { e.StudentId, e.ClassId }, "uq_studentclasses_student_class").IsUnique();
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()").HasColumnName("id");
            entity.Property(e => e.ClassId).HasColumnName("classid");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnType("timestamp without time zone").HasColumnName("createdat");
            entity.Property(e => e.EnrolledAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnType("timestamp without time zone").HasColumnName("enrolledat");
            entity.Property(e => e.StudentId).HasColumnName("studentid");
            entity.Property(e => e.UpdatedAt).HasColumnType("timestamp without time zone").HasColumnName("updatedat");
            entity.HasOne(d => d.Class).WithMany(p => p.StudentClasses).HasForeignKey(d => d.ClassId).OnDelete(DeleteBehavior.Restrict).HasConstraintName("fk_studentclasses_class");
            entity.HasOne(d => d.Student).WithMany(p => p.StudentClasses).HasForeignKey(d => d.StudentId).OnDelete(DeleteBehavior.Restrict).HasConstraintName("fk_studentclasses_student");
        });

        modelBuilder.Entity<Subject>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("subjects_pkey");
            entity.ToTable("subjects");
            entity.HasIndex(e => e.Code, "subjects_code_key").IsUnique();
            entity.HasIndex(e => new { e.ClassId, e.Name }, "uq_subjects_class_name").IsUnique();
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()").HasColumnName("id");
            entity.Property(e => e.ClassId).HasColumnName("classid");
            entity.Property(e => e.Code).HasMaxLength(20).HasColumnName("code");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnType("timestamp without time zone").HasColumnName("createdat");
            entity.Property(e => e.Name).HasMaxLength(100).HasColumnName("name");
            entity.Property(e => e.UpdatedAt).HasColumnType("timestamp without time zone").HasColumnName("updatedat");
            entity.HasOne(d => d.Class).WithMany(p => p.Subjects).HasForeignKey(d => d.ClassId).OnDelete(DeleteBehavior.Restrict).HasConstraintName("fk_subjects_classes");
        });

        modelBuilder.Entity<Submission>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("submissions_pkey");
            entity.ToTable("submissions");
            entity.HasIndex(e => new { e.AssignmentId, e.StudentId }, "uq_submissions_assignment_student").IsUnique();
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()").HasColumnName("id");
            entity.Property(e => e.AssignmentId).HasColumnName("assignmentid");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnType("timestamp without time zone").HasColumnName("createdat");
            entity.Property(e => e.FeedBack).HasColumnName("feedback");
            entity.Property(e => e.GradedAt).HasColumnType("timestamp without time zone").HasColumnName("gradedat");
            entity.Property(e => e.GradedBy).HasColumnName("gradedby");
            entity.Property(e => e.IsActive).HasDefaultValue(true).HasColumnName("isactive");
            entity.Property(e => e.MarksObtained).HasPrecision(5, 2).HasColumnName("marksobtained");
            entity.Property(e => e.Status).HasMaxLength(20).HasColumnName("status");
            entity.Property(e => e.StudentId).HasColumnName("studentid");
            entity.Property(e => e.SubmissionFileUrl).HasMaxLength(500).HasColumnName("submissionfileurl");
            entity.Property(e => e.SubmissionText).HasColumnName("submissiontext");
            entity.Property(e => e.SubmittedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnType("timestamp without time zone").HasColumnName("submittedat");
            entity.Property(e => e.UpdatedAt).HasColumnType("timestamp without time zone").HasColumnName("updatedat");
            entity.HasOne(d => d.Assignment).WithMany(p => p.Submissions).HasForeignKey(d => d.AssignmentId).OnDelete(DeleteBehavior.Restrict).HasConstraintName("fk_submissions_assignment");
            entity.HasOne(d => d.GradedbyNavigation).WithMany(p => p.SubmissionGradedbyNavigations).HasForeignKey(d => d.GradedBy).OnDelete(DeleteBehavior.Restrict).HasConstraintName("fk_submissions_gradedby");
            entity.HasOne(d => d.Student).WithMany(p => p.SubmissionStudents).HasForeignKey(d => d.StudentId).OnDelete(DeleteBehavior.Restrict).HasConstraintName("fk_submissions_student");
        });

        modelBuilder.Entity<TeacherSubject>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("teachersubjects_pkey");
            entity.ToTable("teachersubjects");
            entity.HasIndex(e => new { e.TeacherId, e.SubjectId }, "uq_teachersubjects_teacher_subject").IsUnique();
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()").HasColumnName("id");
            entity.Property(e => e.AssignedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnType("timestamp without time zone").HasColumnName("assignedat");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnType("timestamp without time zone").HasColumnName("createdat");
            entity.Property(e => e.SubjectId).HasColumnName("subjectid");
            entity.Property(e => e.TeacherId).HasColumnName("teacherid");
            entity.Property(e => e.UpdatedAt).HasColumnType("timestamp without time zone").HasColumnName("updatedat");
            entity.HasOne(d => d.Subject).WithMany(p => p.TeacherSubjects).HasForeignKey(d => d.SubjectId).OnDelete(DeleteBehavior.Restrict).HasConstraintName("fk_teachersubjects_subject");
            entity.HasOne(d => d.Teacher).WithMany(p => p.TeacherSubjects).HasForeignKey(d => d.TeacherId).OnDelete(DeleteBehavior.Restrict).HasConstraintName("fk_teachersubjects_teacher");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("users_pkey");
            entity.ToTable("users");
            entity.HasIndex(e => e.Email, "users_email_key").IsUnique();
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()").HasColumnName("id");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnType("timestamp without time zone").HasColumnName("createdat");
            entity.Property(e => e.Email).HasMaxLength(255).HasColumnName("email");
            entity.Property(e => e.FirstName).HasMaxLength(100).HasColumnName("firstname");
            entity.Property(e => e.IsActive).HasDefaultValue(true).HasColumnName("isactive");
            entity.Property(e => e.LastName).HasMaxLength(100).HasColumnName("lastname");
            entity.Property(e => e.PasswordHash).HasMaxLength(500).HasColumnName("passwordhash");
            entity.Property(e => e.ProfilePictureUrl).HasMaxLength(500).HasColumnName("profilepictureurl");
            entity.Property(e => e.Role).HasMaxLength(20).HasColumnName("role");
            entity.Property(e => e.UpdatedAt).HasColumnType("timestamp without time zone").HasColumnName("updatedat");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}