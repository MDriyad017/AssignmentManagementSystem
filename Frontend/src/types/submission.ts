export interface Submission {
    id: string;
    assignmentId: string;
    assignmentTitle: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    submissionText?: string;
    submissionFileUrl?: string;
    submittedAt: string;
    status: string;
    marksObtained?: number;
    feedback?: string;
    gradedAt?: string;
    gradedBy?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface SubmissionGradeData {
    submissionId: string;
    marksObtained: number;
    feedback?: string;
    gradedBy: string;
    status: string;
}

export interface SubmissionGroup {
    assignmentId: string;
    assignmentTitle: string;
    teacherId: string;
    teacherName: string;
    classId: string;
    className: string;
    subjectId: string;
    subjectName: string;
    dueDate?: string;
    totalMarks?: number;
    submissions: Submission[];
}

export interface CreateSubmissionData {
    assignmentId: string;
    studentId: string;
    submissionText?: string;
    submissionFileUrl?: string;
}

export interface GradeResponse {
    success: boolean;
    message: string;
    data: Submission;
}