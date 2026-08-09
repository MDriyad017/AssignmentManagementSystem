export interface Class {
    id: string;
    name: string;
    code: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateClassData {
    name: string;
    code: string;
}

export interface UpdateClassData {
    name: string;
    code: string;
}