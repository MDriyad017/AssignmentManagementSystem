"use client";
import { X, Mail, Lock, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userService } from "@/services/user.service";

const createUserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().optional(),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(3, "Password must be at least 3 characters"),
    role: z.enum(["Admin", "Teacher", "Student"]),
});
type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateUserDrawer({ isOpen, onClose, onSuccess }: CreateUserDrawerProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: { firstName: "", lastName: "", email: "", password: "", role: "Student" },
    });

    const onSubmit = async (data: CreateUserFormData) => {
        try {
            setIsSubmitting(true);
            setError(null);
            console.log("Sending User Data:", data);
            const response = await userService.create({
                firstName: data.firstName,
                lastName: data.lastName || null,
                email: data.email,
                password: data.password,
                role: data.role,
            });
            console.log("API Response:", response);
            reset();
            onSuccess();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to create user";
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
                    <h5 className="fw-bold mb-0" style={{ color: "var(--dark-color)" }}>Create User</h5>
                    <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", padding: "4px" }}>
                        <X size={20} style={{ color: "var(--text-muted)" }} />
                    </button>
                </div>
                <div className="flex-grow-1 overflow-auto p-4">
                    {error && <div className="alert alert-danger py-2" role="alert" style={{ borderRadius: "var(--border-radius)" }}>{error}</div>}
                    <form id="createUserForm" onSubmit={handleSubmit(onSubmit)}>
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
                            <label className="form-label">Password</label>
                            <div className="input-group">
                                <span className="input-group-text"><Lock size={18} /></span>
                                <input type="password" className="form-control" placeholder="Enter password (min 3 chars)" {...register("password")} />
                            </div>
                            {errors.password && <small className="text-danger">{errors.password.message}</small>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Role</label>
                            <div className="position-relative">
                                <select className="form-select" {...register("role")}>
                                    <option value="Teacher">Teacher</option>
                                    <option value="Student">Student</option>
                                </select>
                                <ChevronDown size={18} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                            </div>
                            {errors.role && <small className="text-danger">{errors.role.message}</small>}
                        </div>
                    </form>
                </div>
                <div className="p-4 border-top d-flex justify-content-end gap-2" style={{ borderColor: "var(--border-color) !important" }}>
                    <button type="button" className="btn" onClick={onClose} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--border-radius)", padding: "8px 24px", color: "var(--text-muted)" }}>Cancel</button>
                    <button type="submit" form="createUserForm" className="btn" disabled={isSubmitting} style={{ backgroundColor: "var(--primary-color)", color: "white", borderRadius: "var(--border-radius)", padding: "8px 24px", border: "none", transition: "var(--transition)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--primary-color)"}>
                        {isSubmitting ? "Creating..." : "Create User"}
                    </button>
                </div>
            </div>
        </>
    );
}