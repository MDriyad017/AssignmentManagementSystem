// Frontend/src/types/teacherSubjectAssign.ts

export interface TeacherAssign {
    id: string;
    classId: string;
    className: string;
    subjectId: string;
    subjectName: string;
    assignedAt: string;
}

export interface TeacherGroup {
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
    assigns: TeacherAssign[];
}

export interface TeacherSubjectAssignInput {
    classId: string;
    subjectId: string;
}

export interface TeacherSubjectAssignBulkData {
    teacherId: string;
    teacherSubjectAssigns: TeacherSubjectAssignInput[];
}

export interface TeacherSubjectAssignUpdateData {
    id: string;
    teacherId: string;
    classId: string;
    subjectId: string;
}

export interface BulkCreateResponse {
    success: boolean;
    message: string;
    data: {
        totalAssigned: number;
        assigns: TeacherAssign[];
    };
}

export interface UpdateResponse {
    success: boolean;
    message: string;
    data: TeacherAssign;
}

export interface DeleteResponse {
    success: boolean;
    message: string;
}