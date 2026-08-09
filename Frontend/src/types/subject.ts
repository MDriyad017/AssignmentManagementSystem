export interface Subject {
    id: string;
    name: string;
    code: string | null;
    classId: string;
    className?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateSubjectData {
    name: string;
    code: string | null;
    classId: string;
}

export interface UpdateSubjectData {
    name: string;
    code: string | null;
    classId: string;
}