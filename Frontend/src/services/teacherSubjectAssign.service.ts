import apiClient from "@/lib/api-client";
import {
   TeacherGroup,
   TeacherAssign,
   TeacherSubjectAssignBulkData,
   TeacherSubjectAssignUpdateData,
} from "@/types/teacherSubjectAssign";

export interface BulkCreateResponse {
   success: boolean;
   message: string;
   data: {
      totalAssigned: number;
      assigns: TeacherGroup['assigns'];
   };
}

export interface UpdateResponse {
   success: boolean;
   message: string;
   data: TeacherGroup['assigns'][0];
}

interface RawTeacherGroup {
   teacherId: string;
   teacherName: string;
   teacherEmail: string;
   teacherSubjectAssigns?: TeacherAssign[];
   assigns?: TeacherAssign[];
}

export const teacherSubjectAssignService = {

   getByClassId: async (classId: string): Promise<TeacherAssign[]> => {
      const response = await apiClient.get(`/TeacherSubjectAssign/CGC001?classId=${classId}`);
      return response.data || [];
   },

   getAllGrouped: async (): Promise<TeacherGroup[]> => {
      const response = await apiClient.get("/TeacherSubjectAssign/CGG001");
      const data: RawTeacherGroup[] = response.data || [];
      return data.map((group) => ({
          ...group,
          assigns: group.assigns || group.teacherSubjectAssigns || []
      }));
   },

   getByTeacherId: async (teacherId: string): Promise<TeacherGroup> => {
      const response = await apiClient.get(`/TeacherSubjectAssign/CGT001?teacherId=${teacherId}`);
      console.log("🔵 Raw API Response:", response.data);
      
      const data = response.data || {};
      
      let assigns: TeacherAssign[] = [];
      
      if (Array.isArray(data)) {
         assigns = data;
      } else if (data.assigns && Array.isArray(data.assigns)) {
         assigns = data.assigns;
      } else if (data.teacherSubjectAssigns && Array.isArray(data.teacherSubjectAssigns)) {
         assigns = data.teacherSubjectAssigns;
      } else {
         const keys = Object.keys(data).filter(key => !isNaN(Number(key)));
         if (keys.length > 0) {
            assigns = keys.map(key => data[key]);
         }
      }
      
      console.log("🔵 Processed Assigns:", assigns);
      
      return {
          teacherId: data.teacherId || teacherId,
          teacherName: data.teacherName || assigns[0]?.teacherName || "",
          teacherEmail: data.teacherEmail || assigns[0]?.teacherEmail || "",
          assigns: assigns
      };
   },

   createBulk: async (data: TeacherSubjectAssignBulkData): Promise<BulkCreateResponse> => {
      const response = await apiClient.post("/TeacherSubjectAssign/CB001", data);
      return response.data;
   },

   update: async (data: TeacherSubjectAssignUpdateData): Promise<UpdateResponse> => {
      const response = await apiClient.post("/TeacherSubjectAssign/CU001", data);
      return response.data;
   },

   delete: async (id: string): Promise<{ success: boolean; message: string }> => {
      const response = await apiClient.post(`/TeacherSubjectAssign/CD001?id=${id}`);
      return response.data;
   },

   deleteByTeacherId: async (teacherId: string): Promise<{ success: boolean; message: string }> => {
      const response = await apiClient.post(`/TeacherSubjectAssign/CDT001?teacherId=${teacherId}`);
      return response.data;
   },
};