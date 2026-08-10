// Frontend/src/services/studentClassAssign.service.ts

import apiClient from "@/lib/api-client";
import {
    StudentGroup,
    StudentClassDetail,
    StudentClassAssignCreateData,
    StudentClassAssignUpdateData,
    CreateResponse,
    UpdateResponse,
    DeleteResponse,
    StudentClassAssign,
} from "@/types/studentClassAssign";

interface RawStudentGroup {
    studentId: string;
    studentName: string;
    studentEmail: string;
    class?: StudentClassAssign | null;
}

export const studentClassAssignService = {

    getAllGrouped: async (): Promise<StudentGroup[]> => {
        const response = await apiClient.get("/StudentClassAssign/CGG001");
        const data: RawStudentGroup[] = response.data || [];
        return data.map((group) => ({
            ...group,
            class: group.class || null
        }));
    },

    getStudentClassDetail: async (studentId: string): Promise<StudentClassDetail> => {
        const response = await apiClient.get(`/StudentClassAssign/CGD001?studentId=${studentId}`);
        return response.data;
    },

    assign: async (data: StudentClassAssignCreateData): Promise<CreateResponse> => {
        const response = await apiClient.post("/StudentClassAssign/CA001", data);
        return response.data;
    },

    update: async (data: StudentClassAssignUpdateData): Promise<UpdateResponse> => {
        const response = await apiClient.post("/StudentClassAssign/CU001", data);
        return response.data;
    },

    delete: async (id: string): Promise<DeleteResponse> => {
        const response = await apiClient.post(`/StudentClassAssign/CD001?id=${id}`);
        return response.data;
    },

    deleteByStudentId: async (studentId: string): Promise<DeleteResponse> => {
        const response = await apiClient.post(`/StudentClassAssign/CDS001?studentId=${studentId}`);
        return response.data;
    },
};