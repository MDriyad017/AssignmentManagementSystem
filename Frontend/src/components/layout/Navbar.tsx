"use client";

import { Menu, LogOut, UserCircle } from "lucide-react";
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
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <nav className="navbar bg-white border-bottom shadow-sm px-4" style={{ height: 70 }}>
            <button
                type="button"
                className="btn btn-outline-secondary d-lg-none"
                onClick={onToggleSidebar}
            >
                <Menu size={20} />
            </button>

            <div className="ms-auto d-flex align-items-center gap-3">
                <div className="text-end">
                    <h6 className="mb-0">{user?.fullName}</h6>
                    <span className="badge bg-primary">{user?.role}</span>
                </div>

                <div className="position-relative" ref={dropdownRef}>
                    <button
                        type="button"
                        className="btn btn-light border"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <UserCircle size={28} />
                    </button>

                    {isOpen && (
                        <div className="dropdown-menu dropdown-menu-end show position-absolute mt-2">
                            <button className="dropdown-item">
                                Profile
                            </button>

                            <hr className="dropdown-divider" />

                            <button
                                className="dropdown-item text-danger d-flex align-items-center gap-2"
                                onClick={handleLogout}
                            >
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