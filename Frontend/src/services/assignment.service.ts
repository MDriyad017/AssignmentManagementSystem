import apiClient from "@/lib/api-client";
import {
    Assignment,
    CreateAssignmentData,
    UpdateAssignmentData,
    CreateResponse, 
    UpdateResponse,
    DeleteResponse,
} from "@/types/teacherAssignment";

export const assignmentService = {

    getAll: async (): Promise<Assignment[]> => {
        const response = await apiClient.get("/Assignments/CG001");
        return response.data;
    },

    getById: async (id: string): Promise<Assignment> => {
        const response = await apiClient.get(`/Assignments/CGID001?id=${id}`);
        return response.data;
    },

    getByTeacherId: async (teacherId: string): Promise<Assignment[]> => {
        const response = await apiClient.get(`/Assignments/CGT001?teacherId=${teacherId}`);
        return response.data;
    },

    getByClassId: async (classId: string): Promise<Assignment[]> => {
        const response = await apiClient.get(`/Assignments/CGC001?classId=${classId}`);
        return response.data;
    },

    create: async (data: CreateAssignmentData): Promise<CreateResponse> => {  // ✅ Changed
        const response = await apiClient.post("/Assignments/CA001", data);
        return response.data;
    },

    update: async (data: UpdateAssignmentData): Promise<UpdateResponse> => {
        const response = await apiClient.post("/Assignments/CU001", data);
        return response.data;
    },

    delete: async (id: string): Promise<DeleteResponse> => {
        const response = await apiClient.post(`/Assignments/CD001?id=${id}`);
        return response.data;
    },
};