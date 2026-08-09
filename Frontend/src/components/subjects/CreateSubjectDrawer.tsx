"use client";
import { X, BookOpen, Hash, Layers } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { subjectService } from "@/services/subject.service";
import { classService } from "@/services/class.service";
import { Class } from "@/types/class";

const createSubjectSchema = z.object({
    name: z.string().min(1, "Subject name is required"),
    code: z.string().optional(),
    classId: z.string().min(1, "Class is required"),
});
type CreateSubjectFormData = z.infer<typeof createSubjectSchema>;

interface CreateSubjectDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateSubjectDrawer({ isOpen, onClose, onSuccess }: CreateSubjectDrawerProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateSubjectFormData>({
        resolver: zodResolver(createSubjectSchema),
        defaultValues: { name: "", code: "", classId: "" },
    });

    useEffect(() => {
        const loadClasses = async () => {
            try {
                setLoadingClasses(true);
                const data = await classService.getAll();
                setClasses(data);
            } catch (err) {
                console.error("Failed to load classes:", err);
            } finally {
                setLoadingClasses(false);
            }
        };
        if (isOpen) {
            loadClasses();
        }
    }, [isOpen]);

    const onSubmit = async (data: CreateSubjectFormData) => {
        try {
            setIsSubmitting(true);
            setError(null);
            await subjectService.create({
                name: data.name,
                code: data.code || null,
                classId: data.classId,
            });
            reset();
            onSuccess();
        } catch (err) {
            const errorMessage = 
                err && typeof err === 'object' && 'response' in err && err.response && 
                typeof err.response === 'object' && 'data' in err.response && err.response.data &&
                typeof err.response.data === 'object' && 'message' in err.response.data
                    ? String(err.response.data.message)
                    : err instanceof Error 
                        ? err.message 
                        : "Failed to create subject. Please try again.";
            setError(errorMessage);
            console.error("Create Subject Error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1040, transition: "var(--transition)" }} onClick={onClose} />
            <div className="position-fixed top-0 end-0 h-100 bg-white shadow-lg" style={{ width: "480px", maxWidth: "90vw", zIndex: 1050, transform: isOpen ? "translateX(0)" : "translateX(100%)", transition: "var(--transition)", display: "flex", flexDirection: "column" }}>
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center" style={{ borderColor: "var(--border-color) !important" }}>
                    <h5 className="fw-bold mb-0" style={{ color: "var(--dark-color)" }}>Create Subject</h5>
                    <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", padding: "4px" }}>
                        <X size={20} style={{ color: "var(--text-muted)" }} />
                    </button>
                </div>
                <div className="flex-grow-1 overflow-auto p-4">
                    {error && <div className="alert alert-danger py-2" role="alert" style={{ borderRadius: "var(--border-radius)" }}>{error}</div>}
                    <form id="createSubjectForm" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label className="form-label">Subject Name</label>
                            <div className="input-group">
                                <span className="input-group-text"><BookOpen size={18} /></span>
                                <input type="text" className="form-control" placeholder="Enter subject name" {...register("name")} />
                            </div>
                            {errors.name && <small className="text-danger">{errors.name.message}</small>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Subject Code (Optional)</label>
                            <div className="input-group">
                                <span className="input-group-text"><Hash size={18} /></span>
                                <input type="text" className="form-control" placeholder="Enter subject code" {...register("code")} />
                            </div>
                            {errors.code && <small className="text-danger">{errors.code.message}</small>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Class</label>
                            <div className="input-group">
                                <span className="input-group-text"><Layers size={18} /></span>
                                <select className="form-select" {...register("classId")} disabled={loadingClasses}>
                                    <option value="">Select a class</option>
                                    {classes.map((cls) => (
                                        <option key={cls.id} value={cls.id}>{cls.name} ({cls.code})</option>
                                    ))}
                                </select>
                            </div>
                            {errors.classId && <small className="text-danger">{errors.classId.message}</small>}
                        </div>
                    </form>
                </div>
                <div className="p-4 border-top d-flex justify-content-end gap-2" style={{ borderColor: "var(--border-color) !important" }}>
                    <button type="button" className="btn" onClick={onClose} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--border-radius)", padding: "8px 24px", color: "var(--text-muted)" }}>Cancel</button>
                    <button type="submit" form="createSubjectForm" className="btn" disabled={isSubmitting || loadingClasses} style={{ backgroundColor: "var(--primary-color)", color: "white", borderRadius: "var(--border-radius)", padding: "8px 24px", border: "none", transition: "var(--transition)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--primary-color)"}>
                        {isSubmitting ? "Creating..." : "Create Subject"}
                    </button>
                </div>
            </div>
        </>
    );
}