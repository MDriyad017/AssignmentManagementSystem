"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuItem } from "@/config/menu";

interface Props {
    item: MenuItem;
}

export default function SidebarItem({ item }: Props) {
    const pathname = usePathname();
    const Icon = item.icon;
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

    return (
        <li className="nav-item mb-1">
            <Link href={item.href} className={`nav-link sidebar-link px-3 py-2 d-flex align-items-center ${isActive ? "active" : ""}`} style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.7)", backgroundColor: isActive ? "var(--primary-color)" : "transparent", borderRadius: "var(--border-radius)", transition: "var(--transition)", fontSize: "14px", fontWeight: isActive ? "600" : "400" }} onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; } }} onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; } }}>
                <Icon size={18} style={{ flexShrink: 0 }} />
                <span className="ms-3 flex-grow-1" style={{ letterSpacing: "0.3px" }}>{item.title}</span>
                {item.badge && (
                    <span className="badge bg-danger rounded-pill" style={{ fontSize: "10px" }}>{item.badge}</span>
                )}
            </Link>
        </li>
    );
}