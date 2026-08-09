import apiClient from "@/lib/api-client";
import { Subject, CreateSubjectData, UpdateSubjectData } from "@/types/subject";

export const subjectService = {
    getAll: async (): Promise<Subject[]> => {
        const response = await apiClient.get("/Subjects/CG001");
        return response.data;
    },

    getById: async (id: string): Promise<Subject> => {
        const response = await apiClient.get(`/Subjects/CGID001?id=${id}`);
        return response.data;
    },

    getByClassId: async (classId: string): Promise<Subject[]> => {
        const response = await apiClient.get(`/Subjects/CGBC001?classId=${classId}`);
        return response.data;
    },

    create: async (data: CreateSubjectData): Promise<Subject> => {
        const response = await apiClient.post("/Subjects/CC001", data);
        return response.data;
    },

    update: async (id: string, data: UpdateSubjectData): Promise<Subject> => {
        const response = await apiClient.post(`/Subjects/CU001?id=${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.post(`/Subjects/CD001?id=${id}`);
    },
};