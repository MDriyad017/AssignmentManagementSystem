"use client";
import { useAuth } from "@/hooks/useAuth";

export default function TeacherDashboardPage() {
    const { user } = useAuth();

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <h2 className="fw-bold" style={{ color: "var(--dark-color)" }}>
                        This Is Teacher Dashboard
                    </h2>
                    <p className="text-muted">
                        Welcome {user?.fullName || "Teacher"} to Assignment Management System.
                    </p>
                </div>
            </div>
        </div>
    );
}