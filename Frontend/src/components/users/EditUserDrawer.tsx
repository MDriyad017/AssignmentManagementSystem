"use client";
import { X, Mail, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userService, UpdateUserData } from "@/services/user.service";

const editUserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().nullable().optional(),
    email: z.string().email("Please enter a valid email address"),
    isActive: z.boolean(),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userId: string | null;
}

export default function EditUserDrawer({ isOpen, onClose, onSuccess, userId }: EditUserDrawerProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<EditUserFormData>({
        resolver: zodResolver(editUserSchema),
        defaultValues: { firstName: "", lastName: "", email: "", isActive: true },
    });

    const isActive = watch("isActive");

    useEffect(() => {
        let isMounted = true;
        const loadUser = async () => {
            if (!isOpen || !userId) return;
            try {
                setLoading(true);
                setError(null);
                const user = await userService.getById(userId);
                if (isMounted) {
                    reset({
                        firstName: user.firstName,
                        lastName: user.lastName || "",
                        email: user.email,
                        isActive: user.isActive,
                    });
                }
            } catch (err) {
                if (isMounted) {
                    const errorMessage = err instanceof Error ? err.message : "Failed to load user";
                    setError(errorMessage);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        loadUser();
        return () => {
            isMounted = false;
        };
    }, [isOpen, userId, reset]);

    const onSubmit = async (data: EditUserFormData) => {
        try {
            setIsSubmitting(true);
            setError(null);
            const updateData: UpdateUserData = {
                firstName: data.firstName,
                lastName: data.lastName || null,
                email: data.email,
                isActive: data.isActive,
            };
            await userService.update(userId!, updateData);
            reset();
            onSuccess();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to update user";
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
                    <h5 className="fw-bold mb-0" style={{ color: "var(--dark-color)" }}>Edit User</h5>
                    <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", padding: "4px" }}>
                        <X size={20} style={{ color: "var(--text-muted)" }} />
                    </button>
                </div>
                <div className="flex-grow-1 overflow-auto p-4">
                    {loading && <div className="text-center py-4">Loading...</div>}
                    {error && <div className="alert alert-danger py-2" role="alert" style={{ borderRadius: "var(--border-radius)" }}>{error}</div>}
                    {!loading && (
                        <form id="editUserForm" onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3">
                                <label className="form-label">First Name</label>
                                <div className="input-group">
                                    <span className="input-group-text"><User size={18} /></span>
                                    <input type="text" className="form-control" placeholder="Enter first name" {...register("firstName")} />
                                </div>
                                {errors.firstName && <small className="text-danger">{errors.firstName.message}</small>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Last Name</label>
                                <div className="input-group">
                                    <span className="input-group-text"><User size={18} /></span>
                                    <input type="text" className="form-control" placeholder="Enter last name" {...register("lastName")} />
                                </div>
                                {errors.lastName && <small className="text-danger">{errors.lastName.message}</small>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email Address</label>
                                <div className="input-group">
                                    <span className="input-group-text"><Mail size={18} /></span>
                                    <input type="email" className="form-control" placeholder="Enter email address" {...register("email")} />
                                </div>
                                {errors.email && <small className="text-danger">{errors.email.message}</small>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="form-check form-switch" style={{ margin: 0 }}>
                                        <input className="form-check-input" type="checkbox" role="switch" id="statusSwitch"
                                            style={{
                                                width: "48px",
                                                height: "24px",
                                                cursor: "pointer",
                                                backgroundColor: isActive ? "var(--primary-color)" : "var(--border-color)",
                                                borderColor: isActive ? "var(--primary-color)" : "var(--border-color)",
                                                transition: "var(--transition)", }} checked={isActive} onChange={(e) => setValue("isActive", e.target.checked)} />
                                    </div>
                                    <span className="badge" style={{ backgroundColor: isActive ? "var(--success-color)" : "var(--danger-color)", fontSize: "12px", padding: "4px 12px", transition: "var(--transition)",}}>
                                        {isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
                <div className="p-4 border-top d-flex justify-content-end gap-2" style={{ borderColor: "var(--border-color) !important" }}>
                    <button type="button" className="btn" onClick={onClose} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--border-radius)", padding: "8px 24px", color: "var(--text-muted)" }}>Cancel</button>
                    <button type="submit" form="editUserForm" className="btn" disabled={isSubmitting || loading} style={{ backgroundColor: "var(--primary-color)", color: "white", borderRadius: "var(--border-radius)", padding: "8px 24px", border: "none", transition: "var(--transition)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--primary-color)"}>
                        {isSubmitting ? "Updating..." : "Update User"}
                    </button>
                </div>
            </div>
        </>
    );
}