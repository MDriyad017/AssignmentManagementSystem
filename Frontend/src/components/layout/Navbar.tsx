"use client";
import { Menu, LogOut, ChevronDown, LucideSettings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";

interface NavbarProps {
    onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        router.replace("/login");
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <nav className="navbar border-bottom px-4" style={{ height: "var(--navbar-height)", backgroundColor: "var(--dark-color)", borderColor: "rgba(255,255,255,0.08) !important" }}>
            <button type="button" className="btn d-lg-none text-white" onClick={onToggleSidebar} style={{ borderColor: "rgba(255,255,255,0.2)" }}>
                <Menu size={22} />
            </button>
            {/* <div className="d-none d-lg-block">
                <h5 className="text-white mb-0 fw-semibold">Dashboard</h5>
            </div> */}
            <div className="ms-auto d-flex align-items-center gap-3">
                <div className="text-end d-none d-sm-block">
                    <h6 className="mb-0 text-white" style={{ fontSize: "14px" }}>{user?.fullName || "User"}</h6>
                    <span className="badge" style={{ backgroundColor: "var(--primary-color)", fontSize: "10px", padding: "3px 10px" }}>{user?.role || "Guest"}</span>
                </div>
                <div className="position-relative" ref={dropdownRef}>
                    <button type="button" className="btn d-flex align-items-center gap-2" style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "none", color: "white", padding: "6px 12px 6px 6px", borderRadius: "50px" }} onClick={() => setIsOpen(!isOpen)}>
                        <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: "32px", height: "32px", backgroundColor: "var(--primary-color)", color: "white", fontWeight: "bold", fontSize: "14px" }}>
                            {user?.fullName?.charAt(0) || "U"}
                        </div>
                        <ChevronDown size={16} className="text-white-50" />
                    </button>
                    {isOpen && (
                        <div className="dropdown-menu dropdown-menu-end show position-absolute mt-2 p-2" style={{ backgroundColor: "var(--dark-color)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "var(--border-radius)", minWidth: "200px", boxShadow: "var(--box-shadow)", right: 0, left: "auto" }}>
                            <div className="px-3 py-2 border-bottom" style={{ borderColor: "rgba(255,255,255,0.08) !important" }}>
                                <p className="text-white mb-0 fw-semibold">{user?.fullName}</p>
                                <small className="text-white-50">{user?.email}</small>
                            </div>
                            <button className="dropdown-item text-primary d-flex align-items-center gap-2 px-3 py-2" style={{ borderRadius: "6px", transition: "var(--transition)" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                                <LucideSettings size={18} />
                                Settings
                            </button>
                            <hr className="dropdown-divider" style={{ borderColor: "rgba(255,255,255,0.08)" }} />
                            <button className="dropdown-item text-danger d-flex align-items-center gap-2 px-3 py-2" onClick={handleLogout} style={{ borderRadius: "6px", transition: "var(--transition)" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}