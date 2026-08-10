"use client";
import { useAuth } from "@/hooks/useAuth";

export default function StudentDashboardPage() {
    const { user } = useAuth();

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <h2 className="fw-bold" style={{ color: "var(--dark-color)" }}>
                        This Is Student Dashboard
                    </h2>
                    <p className="text-muted">
                        Welcome {user?.fullName || "Student"} to Assignment Management System.
                    </p>
                </div>
            </div>
        </div>
    );
}