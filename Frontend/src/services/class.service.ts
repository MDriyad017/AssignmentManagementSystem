import apiClient from "@/lib/api-client";
import { Class, CreateClassData, UpdateClassData } from "@/types/class";

export const classService = {
    getAll: async (): Promise<Class[]> => {
        const response = await apiClient.get("/Classes/CG001");
        return response.data;
    },

    getById: async (id: string): Promise<Class> => {
        const response = await apiClient.get(`/Classes/CGID001?id=${id}`);
        return response.data;
    },

    create: async (data: CreateClassData): Promise<Class> => {
        const response = await apiClient.post("/Classes/CC001", data);
        return response.data;
    },

    update: async (id: string, data: UpdateClassData): Promise<Class> => {
        const response = await apiClient.post(`/Classes/CU001?id=${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.post(`/Classes/CD001?id=${id}`);
    },
};