"use client";
import { X, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submissionService } from "@/services/submission.service";
import { useAuth } from "@/hooks/useAuth";
import { Submission, SubmissionGroup } from "@/types/submission";

const gradeSchema = z.object({ marksObtained: z.string().optional(), feedback: z.string().optional(), rejected: z.boolean() });
type GradeFormData = z.infer<typeof gradeSchema>;

interface GradeSubmissionDrawerProps { isOpen: boolean; onClose: () => void; onSuccess: () => void; submission: Submission | null; assignment: SubmissionGroup | null; }

const getErrorMessage = (error: unknown): string => {
    if (!error) return "";
    if (typeof error === "string") return error;
    if (typeof error === "object" && error !== null && "message" in error) {
        const message = (error as { message: unknown }).message;
        return typeof message === "string" ? message : "";
    }
    return "";
};

export default function GradeSubmissionDrawer({ isOpen, onClose, onSuccess, submission, assignment }: GradeSubmissionDrawerProps) {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm<GradeFormData>({
        resolver: zodResolver(gradeSchema),
        defaultValues: { marksObtained: submission?.marksObtained?.toString() || "", feedback: submission?.feedback || "", rejected: false },
    });
    const isRejected = watch("rejected");
    const handleRejectedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rejected = event.target.checked;
        setValue("rejected", rejected);
        if (rejected) setValue("marksObtained", "0");
    };
    const onSubmit = async (data: GradeFormData) => {
        if (!submission || !user) return;
        try {
            setIsSubmitting(true);
            setError(null);
            const status = data.rejected ? "Rejected" : "Graded";
            const marks = data.rejected ? 0 : Number(data.marksObtained) || 0;
            await submissionService.grade({ submissionId: submission.id, marksObtained: marks, feedback: data.feedback || "", gradedBy: user.id, status });
            reset();
            onSuccess();
            onClose();
        } catch (error) {
            const errorMessage = error && typeof error === "object" && "response" in error && error.response && typeof error.response === "object" && "data" in error.response && error.response.data && typeof error.response.data === "object" && "message" in error.response.data ? String(error.response.data.message) : error instanceof Error ? error.message : "Failed to grade submission.";
            setError(errorMessage);
            console.error("Grade Error:", error);
        } finally { setIsSubmitting(false); }
    };
    if (!isOpen || !submission) return null;
    return (
        <>
            <div className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1040 }} onClick={onClose} />
            <div className="position-fixed top-0 end-0 h-100 bg-white shadow-lg" style={{ width: "500px", maxWidth: "90vw", zIndex: 1050, transform: isOpen ? "translateX(0)" : "translateX(100%)", transition: "var(--transition)", display: "flex", flexDirection: "column" }}>
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">📝 Grade Submission</h5>
                    <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", padding: "4px" }}><X size={20} /></button>
                </div>
                <div className="flex-grow-1 overflow-auto p-4">
                    {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
                    <div className="mb-3">
                        <label className="fw-semibold text-muted" style={{ fontSize: "13px" }}>Student</label>
                        <p className="fw-semibold">{submission.studentName}</p>
                    </div>
                    <div className="mb-3">
                        <label className="fw-semibold text-muted" style={{ fontSize: "13px" }}>Assignment</label>
                        <p className="fw-semibold">{assignment?.assignmentTitle || submission.assignmentTitle}</p>
                    </div>
                    <form id="gradeForm" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Marks Obtained</label>
                            <input type="number" className="form-control" placeholder="Enter marks" step="0.01" min="0" disabled={isRejected} {...register("marksObtained")} />
                            {errors.marksObtained && <small className="text-danger">{getErrorMessage(errors.marksObtained)}</small>}
                            {isRejected && <small className="text-muted">Marks disabled when rejected.</small>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Feedback</label>
                            <textarea className="form-control" rows={4} placeholder="Provide feedback..." {...register("feedback")} />
                            {errors.feedback && <small className="text-danger">{getErrorMessage(errors.feedback)}</small>}
                        </div>
                        <div className="mb-3">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="rejectedCheck" {...register("rejected")} onChange={handleRejectedChange} />
                                <label className="form-check-label fw-semibold" htmlFor="rejectedCheck">Rejected</label>
                                <small className="text-muted d-block">Check this to mark as rejected instead of graded.</small>
                            </div>
                        </div>
                        <div className="mt-3 p-3 bg-light rounded">
                            <small className="text-muted">Status will be set to: <strong>{isRejected ? "Rejected" : "Graded"}</strong></small>
                        </div>
                    </form>
                </div>
                <div className="p-4 border-top d-flex justify-content-end gap-2">
                    <button type="button" className="btn" onClick={onClose} disabled={isSubmitting} style={{ border: "1px solid var(--border-color)" }}>Cancel</button>
                    <button type="submit" form="gradeForm" className="btn d-flex align-items-center gap-2" disabled={isSubmitting} style={{ backgroundColor: "var(--primary-color)", color: "white", border: "none" }}>
                        <Save size={16} /> {isSubmitting ? "Saving..." : "Save Grade"}
                    </button>
                </div>
            </div>
        </>
    );
}