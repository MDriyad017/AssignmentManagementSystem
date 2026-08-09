"use client";
import { X, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { classService } from "@/services/class.service";

interface DeleteClassDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    classId: string | null;
    className: string;
}

export default function DeleteClassDrawer({ isOpen, onClose, onSuccess, classId, className }: DeleteClassDrawerProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!classId) return;
        try {
            setIsSubmitting(true);
            setError(null);
            await classService.delete(classId);
            onSuccess();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to delete class";
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1040, transition: "var(--transition)" }} onClick={onClose} />
            <div className="position-fixed top-0 end-0 h-100 bg-white shadow-lg" style={{ width: "420px", maxWidth: "90vw", zIndex: 1050, transform: isOpen ? "translateX(0)" : "translateX(100%)", transition: "var(--transition)", display: "flex", flexDirection: "column" }}>
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center" style={{ borderColor: "var(--border-color) !important" }}>
                    <h5 className="fw-bold mb-0" style={{ color: "var(--danger-color)" }}>Delete Class</h5>
                    <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", padding: "4px" }}>
                        <X size={20} style={{ color: "var(--text-muted)" }} />
                    </button>
                </div>
                <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column align-items-center justify-content-center">
                    <div className="text-center">
                        <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "rgba(220,53,69,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                            <AlertTriangle size={32} style={{ color: "var(--danger-color)" }} />
                        </div>
                        <h5 className="fw-bold" style={{ color: "var(--dark-color)" }}>Are you sure?</h5>
                        <p className="text-muted mt-2">
                            This will permanently delete <strong>{className}</strong>.<br />
                            This action cannot be undone.
                        </p>
                        {error && <div className="alert alert-danger py-2 mt-3" role="alert" style={{ borderRadius: "var(--border-radius)" }}>{error}</div>}
                    </div>
                </div>
                <div className="p-4 border-top d-flex justify-content-end gap-2" style={{ borderColor: "var(--border-color) !important" }}>
                    <button type="button" className="btn" onClick={onClose} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--border-radius)", padding: "8px 24px", color: "var(--text-muted)" }}>Cancel</button>
                    <button type="button" className="btn" onClick={handleDelete} disabled={isSubmitting} style={{ backgroundColor: "var(--danger-color)", color: "white", borderRadius: "var(--border-radius)", padding: "8px 24px", border: "none", transition: "var(--transition)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#b02a37"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--danger-color)"}>
                        {isSubmitting ? "Deleting..." : "Delete Class"}
                    </button>
                </div>
            </div>
        </>
    );
}