"use client";
import { useAuth } from "@/hooks/useAuth";

export default function StudentProfilePage() {
    const { user } = useAuth();

    return (
        <div className="container-fluid">
            <h4 className="fw-bold mb-4" style={{ color: "var(--dark-color)" }}>
                👤 My Profile
            </h4>

            <div className="card border-0 shadow-sm" style={{ borderRadius: "var(--border-radius)", maxWidth: "500px" }}>
                <div className="card-body">
                    <div className="text-center mb-4">
                        <div className="d-flex align-items-center justify-content-center mx-auto rounded-circle" style={{ width: "80px", height: "80px", backgroundColor: "var(--primary-color)", color: "#fff", fontSize: "32px", fontWeight: "bold" }}>
                            {user?.fullName?.charAt(0) || "S"}
                        </div>
                        <h5 className="fw-bold mt-3">{user?.fullName}</h5>
                        <span className="badge" style={{ backgroundColor: "var(--primary-color)" }}>Student</span>
                    </div>

                    <hr />

                    <div className="mb-3">
                        <label className="fw-semibold text-muted" style={{ fontSize: "13px" }}>Email</label>
                        <p className="mb-0">{user?.email}</p>
                    </div>

                    <div className="mb-3">
                        <label className="fw-semibold text-muted" style={{ fontSize: "13px" }}>Role</label>
                        <p className="mb-0">{user?.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}