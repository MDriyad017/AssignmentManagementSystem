import apiClient from "@/lib/api-client";
import { StudentAssignment, StudentSubmission, CreateSubmissionData } from "@/types/studentAssignment";

export const studentAssignmentService = {

    getByStudentId: async (studentId: string): Promise<StudentAssignment[]> => {
        const response = await apiClient.get(`/Assignments/CGS001?studentId=${studentId}`);
        return response.data;
    },

    getAssignmentById: async (id: string): Promise<StudentAssignment> => {
        const response = await apiClient.get(`/Assignments/CGID001?id=${id}`);
        return response.data;
    },

    submit: async (data: CreateSubmissionData): Promise<StudentSubmission> => {
        const response = await apiClient.post("/Submissions/CS001", data);
        return response.data;
    },

    getSubmissionByAssignment: async (assignmentId: string, studentId: string): Promise<StudentSubmission | null> => {
        try {
            const response = await apiClient.get(`/Submissions/CGS001?assignmentId=${assignmentId}&studentId=${studentId}`);
            return response.data;
        } catch {
            return null;
        }
    },
};