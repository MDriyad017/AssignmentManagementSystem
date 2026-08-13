"use client";
import { X, Save, Upload } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { assignmentService } from "@/services/assignment.service";
import { teacherSubjectAssignService } from "@/services/teacherSubjectAssign.service";
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/lib/api-client";

interface TeacherAssignData {
   classId: string;
   className: string;
   subjectId: string;
   subjectName: string;
}

interface ClassOption {
   id: string;
   name: string;
}

interface SubjectOption {
   id: string;
   name: string;
}

const getErrorMessage = (error: unknown): string => {
   if (!error) return '';
   if (typeof error === 'string') return error;
   if (typeof error === 'object' && error !== null && 'message' in error) {
      const message = (error as { message: unknown }).message;
      return typeof message === 'string' ? message : '';
   }
   return '';
};

const createAssignmentSchema = z.object({
   classId: z.string().min(1, "Class is required"),
   subjectId: z.string().min(1, "Subject is required"),
   title: z.string().min(1, "Title is required").max(200),
   description: z.string().optional(),
   totalMarks: z.any().optional(),
   dueDate: z.string().min(1, "Due date is required"),
   status: z.enum(["Draft", "Published", "Closed"]),
   isActive: z.boolean(),
});

type CreateAssignmentFormData = z.infer<typeof createAssignmentSchema>;

interface CreateAssignmentDrawerProps {
   isOpen: boolean;
   onClose: () => void;
   onSuccess: () => void;
}

export default function CreateAssignmentDrawer({ isOpen, onClose, onSuccess }: CreateAssignmentDrawerProps) {
   const { user } = useAuth();
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [teacherClasses, setTeacherClasses] = useState<ClassOption[]>([]);
   const [availableSubjects, setAvailableSubjects] = useState<SubjectOption[]>([]);
   const [loadingClasses, setLoadingClasses] = useState(false);
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [fileName, setFileName] = useState<string>("");
   const fileInputRef = useRef<HTMLInputElement>(null);

   const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<CreateAssignmentFormData>({
      resolver: zodResolver(createAssignmentSchema),
      defaultValues: {
         status: "Published",
         isActive: true,
         totalMarks: undefined,
      },
   });

   const selectedClassId = watch("classId");
   const selectedStatus = watch("status");

   useEffect(() => {
      let isMounted = true;
      const loadTeacherClasses = async () => {
         if (!isOpen || !user?.id) return;
         try {
            setLoadingClasses(true);
            const data = await teacherSubjectAssignService.getByTeacherId(user.id);
            if (isMounted && data) {
               const uniqueClasses = (data.assigns as TeacherAssignData[])
                  .reduce((acc: ClassOption[], curr: TeacherAssignData) => {
                     if (!acc.some((item) => item.id === curr.classId)) {
                        acc.push({
                           id: curr.classId,
                           name: curr.className,
                        });
                     }
                     return acc;
                  }, []);
               setTeacherClasses(uniqueClasses);
            }
         } catch (err) {
            if (isMounted) console.error("Failed to load classes:", err);
         } finally {
            if (isMounted) setLoadingClasses(false);
         }
      };
      loadTeacherClasses();
      return () => { isMounted = false; };
   }, [isOpen, user?.id]);

   useEffect(() => {
      let isMounted = true;
      const loadSubjects = async () => {
         if (!selectedClassId || !user?.id) {
            setAvailableSubjects([]);
            return;
         }
         try {
            const data = await teacherSubjectAssignService.getByTeacherId(user.id);
            if (isMounted && data) {
               const subjects = (data.assigns as TeacherAssignData[])
                  .filter((a: TeacherAssignData) => a.classId === selectedClassId)
                  .map((a: TeacherAssignData) => ({
                     id: a.subjectId,
                     name: a.subjectName,
                  }));
               setAvailableSubjects(subjects);
            }
         } catch (err) {
            if (isMounted) console.error("Failed to load subjects:", err);
         }
      };
      loadSubjects();
      return () => { isMounted = false; };
   }, [selectedClassId, user?.id]);

   useEffect(() => {
      if (selectedStatus === "Closed") {
         setValue("isActive", false);
      } else {
         setValue("isActive", true);
      }
   }, [selectedStatus, setValue]);

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
         if (file.size > 200 * 1024 * 1024) {
            setError("File size exceeds 200MB limit.");
            return;
         }
         setSelectedFile(file);
         setFileName(file.name);
      }
   };

   const uploadFile = async (): Promise<string | null> => {
      if (!selectedFile) return null;
      try {
         const formData = new FormData();
         formData.append("file", selectedFile);

         const response = await apiClient.post("/Upload?type=assignment", formData, {
            headers: { "Content-Type": "multipart/form-data" },
         });

         return response.data.fileUrl;
      } catch (error) {
         console.error("Upload error:", error);
         setError("Failed to upload file.");
         return null;
      }
   };

   const onSubmit = async (data: CreateAssignmentFormData) => {
      try {
         setIsSubmitting(true);
         setError(null);

         let attachmentUrl = "";
         if (selectedFile) {
            const uploadedUrl = await uploadFile();
            if (uploadedUrl) {
               attachmentUrl = uploadedUrl;
            }
         }

         const payload = {
            teacherId: user!.id,
            classId: data.classId,
            subjectId: data.subjectId,
            title: data.title,
            description: data.description,
            totalMarks: data.totalMarks ? Number(data.totalMarks) : undefined,
            dueDate: data.dueDate,
            status: data.status,
            isActive: data.isActive,
            attachmentUrl: attachmentUrl,
         };

         await assignmentService.create(payload);
         reset();
         setSelectedFile(null);
         setFileName("");
         if (fileInputRef.current) {
            fileInputRef.current.value = "";
         }
         onSuccess();
         onClose();
      } catch (error) {
         const errorMessage =
            error && typeof error === 'object' && 'response' in error && error.response &&
               typeof error.response === 'object' && 'data' in error.response && error.response.data &&
               typeof error.response.data === 'object' && 'message' in error.response.data
               ? String(error.response.data.message)
               : error instanceof Error ? error.message : "Failed to Create Assignment.";
         setError(errorMessage);
         console.error("❌ Create Assignment Error:", error);
      } finally {
         setIsSubmitting(false);
      }
   };

   if (!isOpen) return null;

   return (
      <>
         <div className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1040 }} onClick={onClose} />
         <div className="position-fixed top-0 end-0 h-100 bg-white shadow-lg" style={{ width: "550px", maxWidth: "90vw", zIndex: 1050, transform: isOpen ? "translateX(0)" : "translateX(100%)", transition: "var(--transition)", display: "flex", flexDirection: "column" }}>
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
               <h5 className="fw-bold mb-0">📝 Create Assignment</h5>
               <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", padding: "4px" }}>
                  <X size={20} />
               </button>
            </div>
            <div className="flex-grow-1 overflow-auto p-4">
               {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
               <form id="createAssignmentForm" onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                     <label className="form-label fw-semibold">Class</label>
                     <select className="form-select" {...register("classId")} disabled={loadingClasses}>
                        <option value="">Select Class</option>
                        {teacherClasses.map((cls) => (
                           <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                     </select>
                     {errors.classId && <small className="text-danger">{getErrorMessage(errors.classId)}</small>}
                  </div>

                  <div className="mb-3">
                     <label className="form-label fw-semibold">Subject</label>
                     <select className="form-select" {...register("subjectId")} disabled={!selectedClassId}>
                        <option value="">Select Subject</option>
                        {availableSubjects.map((sub) => (
                           <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                     </select>
                     {errors.subjectId && <small className="text-danger">{getErrorMessage(errors.subjectId)}</small>}
                  </div>

                  <div className="mb-3">
                     <label className="form-label fw-semibold">Title</label>
                     <input type="text" className="form-control" placeholder="Enter assignment title" {...register("title")} />
                     {errors.title && <small className="text-danger">{getErrorMessage(errors.title)}</small>}
                  </div>

                  <div className="mb-3">
                     <label className="form-label fw-semibold">Description</label>
                     <textarea className="form-control" rows={3} placeholder="Enter description" {...register("description")} />
                     {errors.description && <small className="text-danger">{getErrorMessage(errors.description)}</small>}
                  </div>

                  <div className="mb-3">
                     <label className="form-label fw-semibold">Total Marks</label>
                     <input
                        type="number"
                        className="form-control"
                        placeholder="Enter total marks"
                        step="1"
                        min="0"
                        {...register("totalMarks")}
                     />
                     {errors.totalMarks && <small className="text-danger">{getErrorMessage(errors.totalMarks)}</small>}
                  </div>

                  <div className="mb-3">
                     <label className="form-label fw-semibold">Due Date</label>
                     <input type="date" className="form-control" {...register("dueDate")} min={new Date().toISOString().split("T")[0]} />
                     {errors.dueDate && <small className="text-danger">{getErrorMessage(errors.dueDate)}</small>}
                  </div>

                  <div className="mb-3">
                     <label className="form-label fw-semibold">Status</label>
                     <div className="d-flex gap-3">
                        <div className="form-check">
                           <input className="form-check-input" type="radio" value="Draft" {...register("status")} />
                           <label className="form-check-label">Draft</label>
                        </div>
                        <div className="form-check">
                           <input className="form-check-input" type="radio" value="Published" {...register("status")} defaultChecked />
                           <label className="form-check-label">Published</label>
                        </div>
                        <div className="form-check">
                           <input className="form-check-input" type="radio" value="Closed" {...register("status")} />
                           <label className="form-check-label">Closed</label>
                        </div>
                     </div>
                     {errors.status && <small className="text-danger">{getErrorMessage(errors.status)}</small>}
                  </div>

                  <div className="mb-3">
                     <label className="form-label fw-semibold">Active Status</label>
                     <div className="d-flex align-items-center gap-3">
                        <div className="form-check form-switch">
                           <input className="form-check-input" type="checkbox" role="switch" disabled checked={watch("isActive")} />
                        </div>
                        <span className="badge" style={{ backgroundColor: watch("isActive") ? "var(--success-color)" : "var(--danger-color)" }}>
                           {watch("isActive") ? "Active" : "Inactive"}
                        </span>
                     </div>
                     <small className="text-muted d-block">Status is automatically updated based on selection.</small>
                  </div>

                  <div className="mb-3">
                     <label className="form-label fw-semibold">Attachment</label>
                     <div className="input-group">
                        <input
                           ref={fileInputRef}
                           type="file"
                           className="form-control"
                           onChange={handleFileChange}
                           style={{ padding: "6px 12px" }}
                        />
                        <button
                           type="button"
                           className="btn btn-outline-secondary"
                           onClick={() => fileInputRef.current?.click()}
                        >
                           <Upload size={16} /> Browse
                        </button>
                     </div>
                     {fileName && (
                        <small className="text-success d-block mt-1">
                           ✅ Selected: {fileName}
                        </small>
                     )}
                     <small className="text-muted d-block">Max file size: 200MB</small>
                  </div>
               </form>
            </div>
            <div className="p-4 border-top d-flex justify-content-end gap-2">
               <button type="button" className="btn" onClick={onClose} style={{ border: "1px solid var(--border-color)" }}>Cancel</button>
               <button type="submit" form="createAssignmentForm" className="btn d-flex align-items-center gap-2" disabled={isSubmitting} style={{ backgroundColor: "var(--primary-color)", color: "white", border: "none" }}>
                  <Save size={16} />
                  {isSubmitting ? "Creating..." : "Create Assignment"}
               </button>
            </div>
         </div>
      </>
   );
}