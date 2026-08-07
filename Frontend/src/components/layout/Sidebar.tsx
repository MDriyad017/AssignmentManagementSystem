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

    const menus = menuConfig[user.role];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className="d-none d-lg-flex flex-column bg-dark-brand text-white border-end"
                style={{ width: "var(--sidebar-width)", minHeight: "100vh" }}
            >
                <div className="p-4 border-bottom sidebar-divider">
                    <div className="d-flex align-items-center gap-3">
                        <div className="sidebar-logo">
                            <GraduationCap size={24} />
                        </div>

                        <div>
                            <h5 className="mb-1 fw-bold text-white">
                                AMS
                            </h5>

                            <small className="text-white-50">
                                Assignment Management System
                            </small>
                        </div>
                    </div>
                </div>

                <div className="flex-grow-1 overflow-auto p-3">
                    <ul className="nav flex-column">
                        {menus.map(item => (
                            <SidebarItem key={item.href} item={item} />
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <aside
                className="position-fixed top-0 start-0 h-100 bg-dark-brand text-white shadow-lg d-lg-none"
                style={{ width: "var(--sidebar-width)", zIndex: 1055, transform: isOpen ? "translateX(0)" : "translateX(-100%)", transition: "var(--transition)" }} >
                <div className="p-4 border-bottom sidebar-divider d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                        <div className="sidebar-logo">
                            <GraduationCap size={24} />
                        </div>

                        <div>
                            <h5 className="mb-1 text-white fw-bold">
                                AMS
                            </h5>

                            <small className="text-white-50">
                                Assignment Management System
                            </small>
                        </div>
                    </div>

                    <button type="button" className="btn btn-sm btn-outline-light" onClick={onClose} >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-3">
                    <ul className="nav flex-column">
                        {menus.map(item => (
                            <div key={item.href} onClick={onClose}>
                                <SidebarItem item={item} />
                            </div>
                        ))}
                    </ul>
                </div>
            </aside>

            {isOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
                    style={{
                        opacity: .5,
                        zIndex: 1050
                    }}
                    onClick={onClose}
                />
            )}
        </>
    );
}