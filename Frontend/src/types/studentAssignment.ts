export interface StudentAssignment {
    id: string;
    title: string;
    description?: string;
    subjectName: string;
    teacherName: string;
    className: string;
    totalMarks?: number;
    dueDate?: string;
    attachmentUrl?: string;
    status: string;
    isActive: boolean;
}

export interface StudentSubmission {
    id: string;
    assignmentId: string;
    studentId: string;
    submissionText?: string;
    submissionFileUrl?: string;
    submittedAt: string;
    status: string;
    marksObtained?: number;
    feedback?: string;
    gradedAt?: string;
    gradedBy?: string;
}

export interface CreateSubmissionData {
    assignmentId: string;
    studentId: string;
    submissionText?: string;
    submissionFileUrl?: string;
}