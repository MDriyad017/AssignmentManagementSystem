// Frontend/src/types/assignment.ts

export interface Assignment {
    id: string;
    teacherId: string;
    teacherName: string;
    subjectId: string;
    subjectName: string;
    classId: string;
    className: string;
    title: string;
    description?: string;
    totalMarks?: number;
    dueDate?: string;
    status?: string;
    attachmentUrl?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
    daysRemaining?: number;
    isOverdue?: boolean;
}

export interface CreateAssignmentData {
    teacherId: string;
    subjectId: string;
    classId: string;
    title: string;
    description?: string;
    totalMarks?: number;
    dueDate?: string;
    status?: string;
    attachmentUrl?: string;
    isActive?: boolean;
}

export interface UpdateAssignmentData {
    id: string;
    subjectId: string;
    classId: string;
    title: string;
    description?: string;
    totalMarks?: number;
    dueDate?: string;
    status?: string;
    attachmentUrl?: string;
    isActive?: boolean;
}

export interface CreateResponse {
    success: boolean;
    message: string;
    data: Assignment;
}

export interface UpdateResponse {
    success: boolean;
    message: string;
    data: Assignment;
}

export interface DeleteResponse {
    success: boolean;
    message: string;
}