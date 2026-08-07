"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.replace("/login");
            return;
        }

        if (allowedRoles && user && !allowedRoles.includes(user.role)) {
            router.replace("/login");
        }
    }, [isAuthenticated, isLoading, user, allowedRoles, router]);

    if (isLoading)
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );

    if (!isAuthenticated)
        return null;

    if (allowedRoles && user && !allowedRoles.includes(user.role))
        return null;

    return <>{children}</>;
}