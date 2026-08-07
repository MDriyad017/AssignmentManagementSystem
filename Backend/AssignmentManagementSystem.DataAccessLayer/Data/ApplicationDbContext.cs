using System;
using System.Collections.Generic;
using AssignmentManagementSystem.BusinessLogicLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace AssignmentManagementSystem.DataAccessLayer.Data;

public partial class ApplicationDbContext : DbContext
{
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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Assignment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("assignments_pkey");

            entity.Property(e => e.Id).UseIdentityAlwaysColumn();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Status).HasDefaultValueSql("'Published'::character varying");

            entity.HasOne(d => d.Class).WithMany(p => p.Assignments)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_assignments_class");

            entity.HasOne(d => d.Subject).WithMany(p => p.Assignments)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_assignments_subject");

            entity.HasOne(d => d.Teacher).WithMany(p => p.Assignments)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_assignments_teacher");
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("auditlogs_pkey");

            entity.Property(e => e.Id).UseIdentityAlwaysColumn();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(d => d.User).WithMany(p => p.AuditLogs)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_auditlogs_user");
        });

        modelBuilder.Entity<Class>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("classes_pkey");

            entity.Property(e => e.Id).UseIdentityAlwaysColumn();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<StudentClass>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("studentclasses_pkey");

            entity.Property(e => e.Id).UseIdentityAlwaysColumn();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.EnrolledAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.Class).WithMany(p => p.StudentClasses)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_studentclasses_class");

            entity.HasOne(d => d.Student).WithMany(p => p.StudentClasses)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_studentclasses_student");
        });

        modelBuilder.Entity<Subject>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("subjects_pkey");

            entity.Property(e => e.Id).UseIdentityAlwaysColumn();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(d => d.Class).WithMany(p => p.Subjects)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_subjects_classes");
        });

        modelBuilder.Entity<Submission>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("submissions_pkey");

            entity.Property(e => e.Id).UseIdentityAlwaysColumn();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Status).HasDefaultValueSql("'Submitted'::character varying");
            entity.Property(e => e.SubmittedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(d => d.Assignment).WithMany(p => p.Submissions)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_submissions_assignment");

            entity.HasOne(d => d.GradedbyNavigation).WithMany(p => p.SubmissionGradedbyNavigations)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_submissions_gradedby");

            entity.HasOne(d => d.Student).WithMany(p => p.SubmissionStudents)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_submissions_student");
        });

        modelBuilder.Entity<TeacherSubject>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("teachersubjects_pkey");

            entity.Property(e => e.Id).UseIdentityAlwaysColumn();
            entity.Property(e => e.AssignedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.Subject).WithMany(p => p.TeacherSubjects)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_teachersubjects_subject");

            entity.HasOne(d => d.Teacher).WithMany(p => p.TeacherSubjects)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_teachersubjects_teacher");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("users_pkey");

            entity.Property(e => e.Id).UseIdentityAlwaysColumn();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
