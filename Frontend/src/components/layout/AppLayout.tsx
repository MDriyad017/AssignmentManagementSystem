"use client";
import { ReactNode, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface Props {
    children: ReactNode;
}

export default function AppLayout({ children }: Props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="d-flex" style={{ minHeight: "100vh" }}>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: "100vh" }}>
                <Navbar onToggleSidebar={() => setSidebarOpen(true)} />
                <main className="flex-grow-1 p-4" style={{ backgroundColor: "var(--light-color)", minHeight: "calc(100vh - var(--navbar-height) - 60px)" }}>
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}