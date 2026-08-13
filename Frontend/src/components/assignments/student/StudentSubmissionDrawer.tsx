"use client";
import { X, Save, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { studentAssignmentService } from "@/services/studentAssignment.service";
import { useAuth } from "@/hooks/useAuth";
import { StudentAssignment } from "@/types/studentAssignment";
import apiClient from "@/lib/api-client";

const submissionSchema = z.object({
   submissionText: z.string().optional(),
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

interface StudentSubmissionDrawerProps {
   isOpen: boolean;
   onClose: () => void;
   onSuccess: () => void;
   assignment: StudentAssignment | null;
}

export default function StudentSubmissionDrawer({
   isOpen,
   onClose,
   onSuccess,
   assignment,
}: StudentSubmissionDrawerProps) {
   const { user } = useAuth();
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [fileName, setFileName] = useState<string>("");
   const fileInputRef = useRef<HTMLInputElement>(null);

   const { register, handleSubmit, formState: { errors }, reset } = useForm<SubmissionFormData>({
      resolver: zodResolver(submissionSchema),
      defaultValues: { submissionText: "" },
   });

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

         const response = await apiClient.post("/Upload?type=submission", formData, {
            headers: { "Content-Type": "multipart/form-data" },
         });

         return response.data.fileUrl;
      } catch (error) {
         console.error("Upload error:", error);
         setError("Failed to upload file.");
         return null;
      }
   };

   const onSubmit = async (data: SubmissionFormData) => {
      if (!assignment || !user) return;
      try {
         setIsSubmitting(true);
         setError(null);

         let submissionFileUrl = "";
         if (selectedFile) {
            const uploadedUrl = await uploadFile();
            if (uploadedUrl) {
               submissionFileUrl = uploadedUrl;
            }
         }

         await studentAssignmentService.submit({
            assignmentId: assignment.id,
            studentId: user.id,
            submissionText: data.submissionText,
            submissionFileUrl: submissionFileUrl,
         });

         reset();
         setSelectedFile(null);
         setFileName("");
         if (fileInputRef.current) fileInputRef.current.value = "";
         onSuccess();
         onClose();
      } catch (error) {
         const errorMessage =
            error && typeof error === 'object' && 'response' in error && error.response &&
               typeof error.response === 'object' && 'data' in error.response && error.response.data &&
               typeof error.response.data === 'object' && 'message' in error.response.data
               ? String(error.response.data.message)
               : error instanceof Error ? error.message : "Failed to submit assignment.";
         setError(errorMessage);
         console.error("❌ Submit Error:", error);
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSubmit(onSubmit)(e);
   };

   if (!isOpen || !assignment) return null;

   return (
      <>
         <div className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1040 }} onClick={onClose} />
         <div className="position-fixed top-0 end-0 h-100 bg-white shadow-lg" style={{ width: "550px", maxWidth: "90vw", zIndex: 1050, transform: isOpen ? "translateX(0)" : "translateX(100%)", transition: "var(--transition)", display: "flex", flexDirection: "column" }}>
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
               <h5 className="fw-bold mb-0">📝 Submit Assignment</h5>
               <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", padding: "4px" }}>
                  <X size={20} />
               </button>
            </div>
            <div className="flex-grow-1 overflow-auto p-4">
               {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

               <div className="mb-3">
                  <label className="fw-semibold text-muted" style={{ fontSize: "13px" }}>Assignment</label>
                  <p className="fw-semibold">{assignment.title}</p>
               </div>

               <form id="submissionForm" onSubmit={handleFormSubmit}>
                  <div className="mb-3">
                     <label className="fw-semibold text-muted" style={{ fontSize: "13px" }}>Submission Text</label>
                     <textarea
                        className="form-control"
                        rows={4}
                        placeholder="Write your submission here..."
                        {...register("submissionText")}
                     />
                     {errors.submissionText && <small className="text-danger">{errors.submissionText.message}</small>}
                  </div>

                  <div className="mb-3">
                     <label className="fw-semibold text-muted" style={{ fontSize: "13px" }}>Attachment</label>
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
               <button type="submit" form="submissionForm" className="btn d-flex align-items-center gap-2" disabled={isSubmitting} style={{ backgroundColor: "var(--primary-color)", color: "white", border: "none" }}>
                  <Save size={16} />
                  {isSubmitting ? "Submitting..." : "Submit Assignment"}
               </button>
            </div>
         </div>
      </>
   );
}