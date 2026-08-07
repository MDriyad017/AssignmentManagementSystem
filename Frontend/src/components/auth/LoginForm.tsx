"use client";

import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/utils/validation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data.email, data.password);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="row min-vh-100">
            <div
                className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center"
                style={{ backgroundColor: "#101414" }}
            >
                <div className="text-center text-white">
                    <h1 className="fw-bold">Assignment Management System</h1>

                    <p className="mt-3 text-white-50">
                        Manage assignments, submissions and academic activities easily.
                    </p>
                </div>
            </div>

            <div
                className="col-lg-6 d-flex justify-content-center align-items-center"
                style={{ backgroundColor: "#F5F7F8" }}
            >
                <div
                    className="card shadow border-0 p-4"
                    style={{ width: "420px", borderRadius: "15px" }}
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="text-center mb-4">
                            <h2 className="fw-bold" style={{ color: "#004F4F" }}>
                                Welcome Back
                            </h2>

                            <p className="text-muted">
                                Login to your account
                            </p>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Email Address
                            </label>

                            <div className="input-group">
                                <span className="input-group-text">
                                    <Mail size={18} />
                                </span>

                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    {...register("email")}
                                />
                            </div>

                            {errors.email && (
                                <small className="text-danger">
                                    {errors.email.message}
                                </small>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="form-label">
                                Password
                            </label>

                            <div className="input-group">
                                <span className="input-group-text">
                                    <Lock size={18} />
                                </span>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder="Enter your password"
                                    {...register("password")}
                                />

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {errors.password && (
                                <small className="text-danger">
                                    {errors.password.message}
                                </small>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Signing In..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}