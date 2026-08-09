"use client";
import { useEffect } from "react";
import { GraduationCap, X } from "lucide-react";
import { menuConfig } from "@/config/menu";
import { useAuth } from "@/hooks/useAuth";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { user } = useAuth();
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleEsc);
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen, onClose]);
    if (!user) return null;
    const menus = menuConfig[user.role as keyof typeof menuConfig] || [];

    return (
        <>
            <aside className="d-none d-lg-flex flex-column text-white border-end" style={{ width: "var(--sidebar-width)", minHeight: "100vh", backgroundColor: "var(--dark-color)", borderColor: "rgba(255,255,255,0.06) !important", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
                <div className="p-4 border-bottom" style={{ borderColor: "rgba(255,255,255,0.06) !important" }}>
                    <div className="d-flex align-items-center gap-3">
                        <div className="sidebar-logo" style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "var(--primary-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "18px" }}>
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <h5 className="mb-0 fw-bold text-white" style={{ fontSize: "16px" }}>AMS</h5>
                            <small className="text-white-50" style={{ fontSize: "10px" }}>Assignment Management</small>
                        </div>
                    </div>
                </div>
                <div className="flex-grow-1 overflow-auto p-3">
                    <ul className="nav flex-column">
                        {menus.map((item) => (
                            <SidebarItem key={item.href} item={item} />
                        ))}
                    </ul>
                </div>
                <div className="p-3 border-top" style={{ borderColor: "rgba(255,255,255,0.06) !important" }}>
                    <small className="text-white-50" style={{ fontSize: "10px" }}>v1.0.0</small>
                </div>
            </aside>
            <aside className="position-fixed top-0 start-0 h-100 text-white shadow-lg d-lg-none" style={{ width: "var(--sidebar-width)", zIndex: 1055, backgroundColor: "var(--dark-color)", transform: isOpen ? "translateX(0)" : "translateX(-100%)", transition: "var(--transition)" }}>
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center" style={{ borderColor: "rgba(255,255,255,0.06) !important" }}>
                    <div className="d-flex align-items-center gap-3">
                        <div className="sidebar-logo" style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "var(--primary-color)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <GraduationCap size={24} color="white" />
                        </div>
                        <div>
                            <h5 className="mb-0 fw-bold text-white">AMS</h5>
                            <small className="text-white-50">Assignment Management</small>
                        </div>
                    </div>
                    <button type="button" className="btn btn-sm text-white" onClick={onClose} style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                        <X size={18} />
                    </button>
                </div>
                <div className="p-3 overflow-auto" style={{ height: "calc(100% - 80px)" }}>
                    <ul className="nav flex-column">
                        {menus.map((item) => (
                            <div key={item.href} onClick={onClose}>
                                <SidebarItem item={item} />
                            </div>
                        ))}
                    </ul>
                </div>
            </aside>
            {isOpen && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-lg-none" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }} onClick={onClose} />
            )}
        </>
    );
}