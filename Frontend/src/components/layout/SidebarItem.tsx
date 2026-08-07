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
    const isActive = pathname.startsWith(item.href);

    return (
        <li className="nav-item mb-1">
            <Link href={item.href} className={`nav-link sidebar-link px-3 py-2 d-flex align-items-center ${isActive ? "active" : ""}`}>
                <Icon size={20} />

                <span className="ms-3 flex-grow-1 sidebar-title">
                    {item.title}
                </span>

                {item.badge && (
                    <span className="badge bg-danger">
                        {item.badge}
                    </span>
                )}
            </Link>
        </li>
    );
}