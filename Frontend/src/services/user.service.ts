import apiClient from "@/lib/api-client";
import { User } from "@/types/user";

export interface CreateUserData {
    firstName: string;
    lastName?: string | null;
    email: string;
    password: string;
    role: "Admin" | "Teacher" | "Student";
}

export interface UpdateUserData {
    firstName: string;
    lastName?: string | null;
    email: string;
    isActive: boolean;
}

export const userService = {
    getAll: async (): Promise<User[]> => {
        const response = await apiClient.get("/Users/UG001");
        return response.data;
    },

    getById: async (id: string): Promise<User> => {
        const response = await apiClient.get(`/Users/UGID001?id=${id}`);
        return response.data;
    },

    create: async (data: CreateUserData): Promise<User> => {
        const response = await apiClient.post("/Users/UIN001", data);
        return response.data;
    },

    update: async (id: string, data: UpdateUserData): Promise<User> => {
        const response = await apiClient.post(`/Users/UED001?id=${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.post(`/Users/UD001?id=${id}`);
    },
};