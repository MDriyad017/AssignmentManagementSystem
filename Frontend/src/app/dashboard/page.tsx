"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (hasRedirected.current) return;
        
        if (!isLoading) {
            if (!user) {
                hasRedirected.current = true;
                router.replace("/login");
                return;
            }
            
            const role = user.role?.toLowerCase();
            const redirectMap: Record<string, string> = {
                admin: "/admin/dashboard",
                teacher: "/teacher/dashboard",
                student: "/student/dashboard",
            };
            
            const redirectPath = redirectMap[role];
            if (redirectPath) {
                hasRedirected.current = true;
                router.replace(redirectPath);
            }
        }
    }, [user, isLoading, router]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}