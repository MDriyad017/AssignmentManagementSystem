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
        <div className="d-flex">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-grow-1 d-flex flex-column min-vh-100">
                <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

                <main className="flex-grow-1 bg-light p-4">
                    {children}
                </main>

                <Footer />
            </div>
        </div>
    );
}