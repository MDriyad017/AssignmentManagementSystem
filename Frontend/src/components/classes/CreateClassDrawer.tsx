"use client";
import { X, BookOpen, Hash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { classService } from "@/services/class.service";

const createClassSchema = z.object({
    name: z.string().min(1, "Class name is required"),
    code: z.string().min(1, "Class code is required"),
});
type CreateClassFormData = z.infer<typeof createClassSchema>;

interface CreateClassDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateClassDrawer({ isOpen, onClose, onSuccess }: CreateClassDrawerProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateClassFormData>({
        resolver: zodResolver(createClassSchema),
        defaultValues: { name: "", code: "" },
    });

    const onSubmit = async (data: CreateClassFormData) => {
        try {
            setIsSubmitting(true);
            setError(null);
            await classService.create(data);
            reset();
            onSuccess();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to create class";
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
                    <h5 className="fw-bold mb-0" style={{ color: "var(--dark-color)" }}>Create Class</h5>
                    <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", padding: "4px" }}>
                        <X size={20} style={{ color: "var(--text-muted)" }} />
                    </button>
                </div>
                <div className="flex-grow-1 overflow-auto p-4">
                    {error && <div className="alert alert-danger py-2" role="alert" style={{ borderRadius: "var(--border-radius)" }}>{error}</div>}
                    <form id="createClassForm" onSubmit={handleSubmit(onSubmit)}>
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
                </div>
                <div className="p-4 border-top d-flex justify-content-end gap-2" style={{ borderColor: "var(--border-color) !important" }}>
                    <button type="button" className="btn" onClick={onClose} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--border-radius)", padding: "8px 24px", color: "var(--text-muted)" }}>Cancel</button>
                    <button type="submit" form="createClassForm" className="btn" disabled={isSubmitting} style={{ backgroundColor: "var(--primary-color)", color: "white", borderRadius: "var(--border-radius)", padding: "8px 24px", border: "none", transition: "var(--transition)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--primary-color)"}>
                        {isSubmitting ? "Creating..." : "Create Class"}
                    </button>
                </div>
            </div>
        </>
    );
}