# Assignment & Submission Management System

A production-oriented, role-based web application for managing
assignments and submissions in schools and colleges. The system provides
separate workflows for **Admin, Teacher, and Student** users and covers
academic setup, assignment creation, submission, grading,
authentication, and automated testing.

> **Project status:** Core Authentication, User Management, Class
> Management, Subject Management, Teacher-Subject Assignment,
> Student-Class Assignment, Assignment Management, and Submission
> Management are implemented. Unit tests are also in place. Cookie-based
> authentication and final middleware hardening are planned as the final
> security step.

------------------------------------------------------------------------

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Prerequisites](#2-prerequisites)
- [3. Installation and Setup](#3-installation-and-setup)
- [4. Database Configuration Or Dummy Data](#4-database-configuration-or-dummy-data)
- [5. Demo Accounts](#5-demo-accounts)
- [6. Backend Configuration](#6-backend-configuration)
- [7. Frontend Configuration](#7-frontend-configuration)
- [8. Running the Application](#8-running-the-application)
- [9. Testing](#9-testing)
- [10. Troubleshooting](#10-troubleshooting)
- [11. Future Improvements](#11-future-improvements)
- [12. Key Features](#12-key-features)
- [13. Technology Stack](#13-technology-stack)
- [14. System Architecture](#14-system-architecture)
- [15. Module Overview](#15-module-overview)
- [16. Complete Business Workflow](#16-complete-business-workflow)
- [17. Roles and Permissions](#17-roles-and-permissions)
- [Quick Start](#quick-start)
- [System at a Glance](#system-at-a-glance)

------------------------------------------------------------------------

# 1. Project Overview

The **Assignment & Submission Management System** is designed to
digitize the academic assignment lifecycle.

The system follows this high-level process:

``` text
Admin Setup
    ↓
Create Users
    ↓
Create Classes
    ↓
Create Subjects
    ↓
Assign Teachers to Subjects
    ↓
Assign Students to Classes
    ↓
Teacher Creates Assignment
    ↓
Student Views Assignment
    ↓
Student Submits Assignment
    ↓
Teacher Reviews & Grades Submission
    ↓
Student Views Grade & Feedback
```

The application uses a layered ASP.NET Core Web API backend and a
Next.js/React frontend.

------------------------------------------------------------------------

# 2. Prerequisites

Install the following before running the project:

  Software                       Recommended Version
  ------------------------------ -----------------------
  .NET SDK                       8.0
  Node.js                        18+
  PostgreSQL                     15+
  Git                            Latest
  Visual Studio 2022 / VS Code   Latest
  npm                            Included with Node.js

Verify installations:

``` bash
dotnet --version
node --version
npm --version
psql --version
git --version
```

------------------------------------------------------------------------

# 3. Installation and Setup

## Step 1 --- Clone the Repository

``` bash
git clone <YOUR_REPOSITORY_URL>
cd AssignmentManagementSystem
```

------------------------------------------------------------------------

## Step 2 --- Create the PostgreSQL Database

Open PostgreSQL / pgAdmin and create:

``` sql
CREATE DATABASE AssignmentManagementDb;
```

------------------------------------------------------------------------

## Step 3 --- Execute the Database Script

The project contains:

``` text
Database/AssignmentManagementDb.sql
```

Run the script against `AssignmentManagementDb`.
```

------------------------------------------------------------------------

# 4. Database Configuration Or Dummy Data

  i) admin123@gmail.com    [Password: admin@123] - "Admin"
 ii) teacher123@gmail.com  [Password: teacher@123] - "Teacher"
iii) student123@gmail.com  [Password: student@123] - "Student"

------------------------------------------------------------------------

# 5. Demo Accounts

For local development, the seed data provides:

  Role      Email                  Password
  --------- --------------------  -------------
  Admin     admin123@gmail.com     admin@123
  Teacher   teacher123@gmail.com   teacher@123
  Student   student123@gmail.com   student@123

------------------------------------------------------------------------

# 6. Backend Configuration

Open:

``` text
AssignmentManagementSystem.API/appsettings.json
```

Configure the PostgreSQL connection:

``` json
{
  "ConnectionStrings": {
    "appCon": "Host=localhost;Port=5432;Database=AssignmentManagementDb;Username=postgres;Password=YOUR_PASSWORD"
  },
  "Jwt": {
    "Key": "AssignmentManagementSystemSecretKey2026@JWT",
    "Issuer": "AssignmentManagementSystem",
    "Audience": "AssignmentManagementSystemUsers",
    "ExpireMinutes": 60
  }
}
```

------------------------------------------------------------------------

## Restore Backend Packages

From the solution directory:

``` bash
dotnet restore
```

------------------------------------------------------------------------

## Build Backend

``` bash
dotnet build
```

A successful build should complete without compilation errors.

------------------------------------------------------------------------

# 7. Frontend Configuration

Navigate to:

``` text
AssignmentManagementSystem.Frontend/
```

Create:

``` text
.env.local
```

Add:

``` env
NEXT_PUBLIC_API_BASE_URL=https://localhost:44380/api
```

Install frontend dependencies:

``` bash
npm install
```

``` text
.env.example
```

Example:

``` env
NEXT_PUBLIC_API_BASE_URL=https://localhost:44380/api
```

------------------------------------------------------------------------

# 8. Running the Application

## Start Backend

From the solution directory:

``` bash
dotnet run --project AssignmentManagementSystem.API
```

Expected development URLs:

``` text
https://localhost:44380
```

------------------------------------------------------------------------

## Start Frontend

Open a second terminal:

``` bash
cd AssignmentManagementSystem.Frontend
npm run dev
```

Expected URL:

``` text
http://localhost:3000
Paste Link in the browser (FireFox) After run Backend API: http://localhost:3000/login
```

------------------------------------------------------------------------

## Application URLs

  URL                               Purpose
  --------------------------------- ---------------------------
  http://localhost:3000             Frontend
  https://localhost:44380/swagger   Swagger API documentation
  https://localhost:44380/api       API base URL

------------------------------------------------------------------------

# 9. Testing

The project contains separate test projects:

``` text
AssignmentManagementSystem.Tests.Unit
```

## Run all tests

``` bash
dotnet test
```

## Run Unit Tests

``` bash
dotnet test AssignmentManagementSystem.Tests.Unit/AssignmentManagementSystem.Tests.Unit.csproj
```

## Run a specific test class

Example:

``` bash
dotnet test --filter "FullyQualifiedName~AuthServiceTests"
```

## Current Unit Test Coverage

  Service               Tests Status
  ------------------- ------- ---------
  AuthService               7 Passing
  UserService               5 Passing
  ClassService              5 Passing
  SubjectService            4 Passing
  AssignmentService         5 Passing
  SubmissionService         7 Passing

The unit-test suite verifies important business rules without requiring
the complete application to be running.

------------------------------------------------------------------------

# 10. Troubleshooting

## Database connection error

Check:

``` text
AssignmentManagementSystem.API/appsettings.json
```

Verify:

-   PostgreSQL is running
-   Database exists
-   Username is correct
-   Password is correct
-   Port is correct
-   Database name is correct

------------------------------------------------------------------------

## CORS error

Verify the frontend URL is allowed by the API CORS configuration.

Development frontend:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

# 11. Future Improvements

Planned improvements include:

-   More comprehensive integration tests
-   Refresh token support
-   Production file/object storage
-   Audit logging improvements
-   Pagination and advanced filtering
-   Email notifications
-   Assignment deadline notifications
-   Production deployment automation
-   CI/CD pipeline

------------------------------------------------------------------------

## Quick Start

For an experienced developer, the complete local setup is:

``` bash
# 12. Key Features

## Authentication

-   Login
-   Logout
-   JWT-based authentication
-   Role-based access
-   Protected application areas
-   Current-user management

## User Management

Admin users can:

-   Create users
-   View users
-   Update users
-   Delete users
-   Assign roles

Supported roles:

-   Admin
-   Teacher
-   Student

## Class Management

-   Create classes
-   View classes
-   Update classes
-   Delete classes

## Subject Management

-   Create subjects
-   Assign subjects to classes
-   Update subjects
-   Delete subjects

## Teacher-Subject Assign

Admin can assign teachers to subjects/classes.

``` text
Teacher
   ↓
Subject
   ↓
Class
```

## Student-Class Enrollment

Admin can enroll a student into a class.

``` text
Student
   ↓
Class
   ↓
Class Subjects
```

## Assignment Management

Teachers can:

-   Create assignments
-   Select class and subject
-   Set assignment details
-   Set due dates
-   Attach files
-   Publish assignments
-   Update assignments
-   Delete assignments

Students can:

-   View available assignments
-   Open assignment details
-   Submit assignment text
-   Upload submission files

## Submission Management

Students can:

-   Submit assignments
-   Upload files
-   Add submission text
-   View submission status

Teachers can:

-   View submissions
-   Grade submissions
-   Give marks
-   Provide feedback
-   Reject submissions

Submission statuses include:

-   Submitted
-   Late
-   Graded
-   Rejected

------------------------------------------------------------------------

# 13. Technology Stack

## Backend

  Technology              Version / Purpose
  ----------------------- -----------------------------
  C#                      Backend language
  ASP.NET Core Web API    REST API
  .NET                    8.0
  Entity Framework Core   ORM
  PostgreSQL              Database
  JWT                     Authentication
  xUnit                   Unit testing
  Swagger / OpenAPI       API documentation

## Frontend

  Technology        Purpose
  ----------------- -----------------
  Next.js           React framework
  React             UI
  TypeScript        Type safety
  Bootstrap 5       Responsive UI
  CSS               Custom styling
  Axios             API integration
  React Hook Form   Form management
  Zod               Form validation
  Lucide React      Icons

------------------------------------------------------------------------

# 14. System Architecture

``` text
┌─────────────────────────────────────────────────────────────┐
│                         Browser                             │
│                Next.js + React + TypeScript                │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              │ HTTPS / REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  ASP.NET Core Web API                       │
│                                                             │
│   Controllers → Business Logic → Repositories              │
│                                                             │
│   AuthController                                            │
│   UsersController                                           │
│   ClassesController                                         │
│   SubjectsController                                        │
│   AssignmentsController                                     │
│   SubmissionsController                                     │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                      │
│                                                             │
│ Users                                                        │
│ Classes                                                      │
│ Subjects                                                     │
│ TeacherSubjects                                              │
│ StudentClasses                                               │
│ Assignments                                                  │
│ Submissions                                                  │
│ AuditLogs                                                    │
└─────────────────────────────────────────────────────────────┘
```

The backend follows a layered/N-Tier approach:

``` text
API
 ↓
BusinessLogicLayer
 ↓
DataAccessLayer
 ↓
PostgreSQL
```

Shared utilities are placed in the Shared project.


# 15. Module Overview

## 5.1 Authentication Module

### Users

Admin, Teacher, Student

### Responsibility

Handles:

-   Login
-   Logout
-   JWT token generation
-   Authentication state
-   Role-based access

### Current Flow

``` text
User enters email + password
        ↓
Frontend sends POST /api/Auth/login
        ↓
AuthController
        ↓
AuthService
        ↓
UserRepository
        ↓
Password verification
        ↓
JWT generated
        ↓
Login response returned
        ↓
Frontend stores authentication state
```

> The project currently uses localStorage-based authentication. Cookie +
> middleware hardening is planned as the final authentication step.

------------------------------------------------------------------------

## 5.2 User Management Module

### Who can use it?

Admin

### Responsibility

Admin manages Teacher and Student accounts.

``` text
Admin
  ↓
Users Page
  ↓
Create / View / Edit / Delete
  ↓
Users Database
```

Main backend layers:

``` text
UsersController
      ↓
UserService
      ↓
UserRepository
      ↓
Users Table
```

------------------------------------------------------------------------

## 5.3 Class Management Module

### Who can manage classes?

Admin

### Responsibility

Creates and manages academic classes.

``` text
Admin
  ↓
Classes
  ↓
Create Class
  ↓
Class Database
```

Teachers and Students can consume class information according to their
permissions.

------------------------------------------------------------------------

## 5.4 Subject Management Module

### Who can manage subjects?

Admin

### Responsibility

Creates subjects and associates them with classes.

``` text
Admin
  ↓
Create Class
  ↓
Create Subject
  ↓
Select Class
  ↓
Subject belongs to Class
```

Relationship:

``` text
Class 1 ─────────── * Subjects
```

------------------------------------------------------------------------

## 5.5 Teacher-Subject Assignment Module

### Who can use it?

Admin

### Responsibility

Assigns teachers to subjects/classes.

``` text
Admin
  ↓
Teacher-Subject Assignment
  ↓
Select Teacher
  ↓
Select Class
  ↓
Select Subject
  ↓
Save Assignment
```

Relationship:

``` text
Teacher ↔ Subject ↔ Class
```

This determines which academic subjects a teacher can manage.

------------------------------------------------------------------------

## 5.6 Student-Class Assignment Module

### Who can use it?

Admin

### Responsibility

Assigns students to classes.

``` text
Admin
  ↓
Student-Class Assignment
  ↓
Select Student
  ↓
Select Class
  ↓
Assign
  ↓
Student enrolled in Class
```

After enrollment, the student's academic context is determined by the
assigned class.

------------------------------------------------------------------------

## 5.7 Assignment Management Module

### Who can use it?

-   Teacher: Create, Update, Delete
-   Student: View and Submit

### Responsibility

Teachers create assignments for their assigned classes/subjects.

``` text
Teacher
  ↓
Assignments
  ↓
Create Assignment
  ↓
Select Class
  ↓
Select Subject
  ↓
Enter Title / Description / Due Date
  ↓
Optional File Attachment
  ↓
Publish
  ↓
Student can see Assignment
```

The assignment is then available to eligible students.

------------------------------------------------------------------------

## 5.8 Submission Management Module

### Who can use it?

-   Student: Submit
-   Teacher: Grade
-   Admin: View where permitted

### Student workflow

``` text
Student
  ↓
View Assignment
  ↓
Open Submit Form
  ↓
Enter Submission Text
  ↓
Optional File Upload
  ↓
Submit
  ↓
Status = Submitted
```

### Teacher workflow

``` text
Teacher
  ↓
Submissions
  ↓
View Student Submission
  ↓
Enter Marks
  ↓
Enter Feedback
  ↓
Grade
  ↓
Status = Graded
```

If the submission is rejected:

``` text
Teacher
  ↓
Reject Submission
  ↓
Status = Rejected
```

The student can then see the resulting status, marks, and feedback.

------------------------------------------------------------------------

# 16. Complete Business Workflow

The correct order for setting up a fresh installation is:

``` text
1. Admin Login
       ↓
2. Create Teacher and Student Users
       ↓
3. Create Classes
       ↓
4. Create Subjects under Classes
       ↓
5. Assign Teachers to Subjects
       ↓
6. Assign Students to Classes
       ↓
7. Teacher Login
       ↓
8. Teacher Creates Assignment
       ↓
9. Assignment Published
       ↓
10. Student Login
       ↓
11. Student Views Assignment
       ↓
12. Student Submits Assignment
       ↓
13. Teacher Views Submission
       ↓
14. Teacher Grades / Rejects Submission
       ↓
15. Student Views Result and Feedback
```

This order is important because later modules depend on data created by
earlier modules.

------------------------------------------------------------------------

# 17. Roles and Permissions

  Feature                       Admin   Teacher   Student
  ---------------------------- ------- --------- ---------
  Login                           ✓        ✓         ✓
  User Management                 ✓       ---       ---
  Class Management                ✓      View      View
  Subject Management              ✓      View      View
  Teacher-Subject Assignment      ✓       ---       ---
  Student-Class Assignment        ✓       ---       ---
  Create Assignment              ---       ✓        ---
  Update Assignment              ---       ✓        ---
  Delete Assignment              ---       ✓        ---
  View Assignment                 ✓        ✓         ✓
  Submit Assignment              ---      ---        ✓
  View Submissions                ✓        ✓        Own
  Grade Submission               ---       ✓        ---
  View Feedback                  ---      ---        ✓

------------------------------------------------------------------------
