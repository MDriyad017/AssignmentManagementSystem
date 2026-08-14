import apiClient from "@/lib/api-client";
import { Submission, SubmissionGroup, SubmissionGradeData, GradeResponse } from "@/types/submission";

export const submissionService = {

    getAll: async (): Promise<Submission[]> => {
        const response = await apiClient.get("/Submissions/CG001");
        return response.data;
    },

    getByTeacherId: async (teacherId: string): Promise<SubmissionGroup[]> => {
        const response = await apiClient.get(`/Submissions/CGT001?teacherId=${teacherId}`);
        return response.data;
    },

    getByStudentId: async (studentId: string): Promise<Submission[]> => {
        const response = await apiClient.get(`/Submissions/CGSID001?studentId=${studentId}`);
        return response.data;
    },

    grade: async (data: SubmissionGradeData): Promise<GradeResponse> => {
        const response = await apiClient.post("/Submissions/CG001", data);
        return response.data;
    },

    getByAssignmentAndStudent: async (assignmentId: string, studentId: string): Promise<Submission | null> => {
        try {
            const response = await apiClient.get(`/Submissions/CGS001?assignmentId=${assignmentId}&studentId=${studentId}`);
            return response.data;
        } catch {
            return null;
        }
    },
};