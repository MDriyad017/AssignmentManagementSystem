// Frontend/src/types/studentClassAssign.ts

export interface StudentClassAssign {
    id: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    classId: string;
    className: string;
    classCode: string;
    enrolledAt: string;
}

export interface StudentGroup {
    studentId: string;
    studentName: string;
    studentEmail: string;
    class: StudentClassAssign | null;
}

// ✅ Updated: Each Teacher has multiple Subjects
export interface SubjectDetail {
    subjectId: string;
    subjectName: string;
}

export interface TeacherSubjectDetail {
    teacherId: string;
    teacherName: string;
    subjects: SubjectDetail[];  // ✅ Multiple Subjects
}

export interface StudentClassDetail {
    studentId: string;
    studentName: string;
    studentEmail: string;
    classId: string;
    className: string;
    teachers: TeacherSubjectDetail[];
}

export interface StudentClassAssignCreateData {
    studentId: string;
    classId: string;
}

export interface StudentClassAssignUpdateData {
    id: string;
    studentId: string;
    classId: string;
}

export interface CreateResponse {
    success: boolean;
    message: string;
    data: StudentClassAssign;
}

export interface UpdateResponse {
    success: boolean;
    message: string;
    data: StudentClassAssign;
}

export interface DeleteResponse {
    success: boolean;
    message: string;
}