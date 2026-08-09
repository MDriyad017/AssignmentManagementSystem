"use client";
import { X, BookOpen, Hash } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { classService } from "@/services/class.service";

const editClassSchema = z.object({
    name: z.string().min(1, "Class name is required"),
    code: z.string().min(1, "Class code is required"),
});
type EditClassFormData = z.infer<typeof editClassSchema>;

interface EditClassDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    classId: string | null;
}

export default function EditClassDrawer({ isOpen, onClose, onSuccess, classId }: EditClassDrawerProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<EditClassFormData>({
        resolver: zodResolver(editClassSchema),
        defaultValues: { name: "", code: "" },
    });

    useEffect(() => {
        let isMounted = true;
        const loadClass = async () => {
            if (!isOpen || !classId) return;
            try {
                setLoading(true);
                setError(null);
                const cls = await classService.getById(classId);
                if (isMounted) {
                    reset({ name: cls.name, code: cls.code });
                }
            } catch (err) {
                if (isMounted) {
                    const errorMessage = err instanceof Error ? err.message : "Failed to load class";
                    setError(errorMessage);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadClass();
        return () => { isMounted = false; };
    }, [isOpen, classId, reset]);

    const onSubmit = async (data: EditClassFormData) => {
        try {
            setIsSubmitting(true);
            setError(null);
            await classService.update(classId!, data);
            reset();
            onSuccess();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to Update user";
            setError(errorMessage);
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
                    <h5 className="fw-bold mb-0" style={{ color: "var(--dark-color)" }}>Edit Class</h5>
                    <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", padding: "4px" }}>
                        <X size={20} style={{ color: "var(--text-muted)" }} />
                    </button>
                </div>
                <div className="flex-grow-1 overflow-auto p-4">
                    {loading && <div className="text-center py-4">Loading...</div>}
                    {error && <div className="alert alert-danger py-2" role="alert" style={{ borderRadius: "var(--border-radius)" }}>{error}</div>}
                    {!loading && (
                        <form id="editClassForm" onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3">
                                <label className="form-label">Class Name</label>
                                <div className="input-group">
                                    <span className="input-group-text"><BookOpen size={18} /></span>
                                    <input type="text" className="form-control" placeholder="Enter class name" {...register("name")} />
                                </div>
                                {errors.name && <small className="text-danger">{errors.name.message}</small>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Class Code</label>
                                <div className="input-group">
                                    <span className="input-group-text"><Hash size={18} /></span>
                                    <input type="text" className="form-control" placeholder="Enter class code" {...register("code")} />
                                </div>
                                {errors.code && <small className="text-danger">{errors.code.message}</small>}
                            </div>
                        </form>
                    )}
                </div>
                <div className="p-4 border-top d-flex justify-content-end gap-2" style={{ borderColor: "var(--border-color) !important" }}>
                    <button type="button" className="btn" onClick={onClose} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--border-radius)", padding: "8px 24px", color: "var(--text-muted)" }}>Cancel</button>
                    <button type="submit" form="editClassForm" className="btn" disabled={isSubmitting || loading} style={{ backgroundColor: "var(--primary-color)", color: "white", borderRadius: "var(--border-radius)", padding: "8px 24px", border: "none", transition: "var(--transition)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--primary-color)"}>
                        {isSubmitting ? "Updating..." : "Update Class"}
                    </button>
                </div>
            </div>
        </>
    );
}