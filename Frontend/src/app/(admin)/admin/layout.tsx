import { ReactNode } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

interface Props {
    children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
    return (
        <ProtectedRoute>
            <AppLayout>{children}</AppLayout>
        </ProtectedRoute>
    );
}