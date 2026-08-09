"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function NotFound() {
    const router = useRouter();
    const { logout } = useAuth();

    const handleGoBack = () => {
        router.back();
    };

    const handleLogoutAndRedirect = () => {
        logout();
        router.push("/login");
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "var(--light-color)" }}>
            <div className="text-center p-5">
                <div style={{ fontSize: "120px", fontWeight: "bold", color: "var(--primary-color)" }}>404</div>
                <h1 className="mt-3 fw-bold" style={{ color: "var(--dark-color)" }}>Page Not Found</h1>
                <p className="text-muted mt-2" style={{ fontSize: "18px" }}>
                    The page you are looking for does not exist or has been moved.
                </p>
                <div className="d-flex gap-3 justify-content-center mt-4">
                    <button onClick={handleGoBack} className="btn px-4 py-2" style={{ backgroundColor: "var(--border-color)", color: "var(--dark-color)", borderRadius: "var(--border-radius)", border: "none", transition: "var(--transition)" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#c0c8c8"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--border-color)"; }}>
                        ← Go Back
                    </button>
                    <button onClick={handleLogoutAndRedirect} className="btn px-4 py-2" style={{ backgroundColor: "var(--primary-color)", color: "#fff", borderRadius: "var(--border-radius)", border: "none", transition: "var(--transition)" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--primary-hover)"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--primary-color)"; }}>
                        Go to Login
                    </button>
                </div>
            </div>
        </div>
    );
}