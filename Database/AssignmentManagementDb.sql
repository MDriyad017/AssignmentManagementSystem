-- ============================================================
-- Assignment Management System Database
-- ============================================================
-- Database Name: AssignmentManagementDB2
-- 1. Users Table
-- ============================================================
CREATE TABLE Users
(
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Email VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash VARCHAR(500) NOT NULL,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NULL,  
    Role VARCHAR(20) NOT NULL CHECK (Role IN ('Admin', 'Teacher', 'Student')),
    ProfilePictureUrl VARCHAR(500),
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NULL
);

-- 2. Classes Table
-- ============================================================
CREATE TABLE Classes
(
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Name VARCHAR(100) NOT NULL,
    Code VARCHAR(20) NOT NULL UNIQUE,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NULL
);

-- 3. Subjects Table
-- ============================================================
CREATE TABLE Subjects
(
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Name VARCHAR(100) NOT NULL,
    Code VARCHAR(20) NULL UNIQUE, 
    ClassId UUID NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NULL,

    CONSTRAINT FK_Subjects_Classes FOREIGN KEY (ClassId) REFERENCES Classes(Id) ON DELETE RESTRICT,
    CONSTRAINT UQ_Subjects_Class_Name UNIQUE (ClassId, Name)
);

-- 4. TeacherSubjects Table
-- ============================================================
CREATE TABLE TeacherSubjects
(
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    TeacherId UUID NOT NULL,
    SubjectId UUID NOT NULL,
    AssignedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NULL,

    CONSTRAINT FK_TeacherSubjects_Teacher FOREIGN KEY (TeacherId) REFERENCES Users(Id) ON DELETE RESTRICT,
    CONSTRAINT FK_TeacherSubjects_Subject FOREIGN KEY (SubjectId) REFERENCES Subjects(Id) ON DELETE RESTRICT,
    CONSTRAINT UQ_TeacherSubjects_Teacher_Subject UNIQUE (TeacherId, SubjectId)
);

-- 5. StudentClasses Table
-- ============================================================
CREATE TABLE StudentClasses
(
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    StudentId UUID NOT NULL,
    ClassId UUID NOT NULL,
    EnrolledAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NULL,

    CONSTRAINT FK_StudentClasses_Student FOREIGN KEY (StudentId) REFERENCES Users(Id) ON DELETE RESTRICT,
    CONSTRAINT FK_StudentClasses_Class FOREIGN KEY (ClassId) REFERENCES Classes(Id) ON DELETE RESTRICT,
    CONSTRAINT UQ_StudentClasses_Student_Class UNIQUE (StudentId, ClassId)
);

-- 6. Assignments Table
-- ============================================================
CREATE TABLE Assignments
(
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    TeacherId UUID NOT NULL,
    SubjectId UUID NOT NULL,
    ClassId UUID NOT NULL,
    Title VARCHAR(200) NOT NULL,
    Description TEXT,
    TotalMarks INTEGER NULL,  
    DueDate TIMESTAMP NULL, 
    AttachmentUrl VARCHAR(500),
    Status VARCHAR(20) NULL DEFAULT 'Published' CHECK (Status IN ('Draft', 'Published', 'Closed')),
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT FK_Assignments_Teacher FOREIGN KEY (TeacherId) REFERENCES Users(Id) ON DELETE RESTRICT,
    CONSTRAINT FK_Assignments_Subject FOREIGN KEY (SubjectId) REFERENCES Subjects(Id) ON DELETE RESTRICT,
    CONSTRAINT FK_Assignments_Class FOREIGN KEY (ClassId) REFERENCES Classes(Id) ON DELETE RESTRICT
);

-- 7. Submissions Table
-- ============================================================
CREATE TABLE Submissions
(
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    AssignmentId UUID NOT NULL,
    StudentId UUID NOT NULL,
    SubmissionText TEXT,
    SubmissionFileUrl VARCHAR(500),
    SubmittedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Status VARCHAR(20) NULL CHECK (Status IN ('Submitted', 'Late', 'Graded', 'Rejected')),
    MarksObtained NUMERIC(5,2),
    Feedback TEXT,
    GradedAt TIMESTAMP NULL,
    GradedBy UUID NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT FK_Submissions_Assignment FOREIGN KEY (AssignmentId) REFERENCES Assignments(Id) ON DELETE RESTRICT,
    CONSTRAINT FK_Submissions_Student FOREIGN KEY (StudentId) REFERENCES Users(Id) ON DELETE RESTRICT,
    CONSTRAINT FK_Submissions_GradedBy FOREIGN KEY (GradedBy) REFERENCES Users(Id) ON DELETE RESTRICT,
    CONSTRAINT UQ_Submissions_Assignment_Student UNIQUE (AssignmentId, StudentId)
);

-- 8. AuditLogs Table
-- ============================================================
CREATE TABLE AuditLogs
(
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserId UUID NOT NULL,
    Action VARCHAR(100) NULL,  
    EntityName VARCHAR(100) NULL,
    EntityId UUID NULL,
    OldValues JSONB,
    NewValues JSONB,
    IpAddress VARCHAR(50),
    UserAgent VARCHAR(500),
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_AuditLogs_User FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE RESTRICT
);