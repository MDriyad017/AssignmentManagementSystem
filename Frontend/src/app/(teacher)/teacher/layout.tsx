import { ReactNode } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

interface Props {
    children: ReactNode;
}

export default function TeacherLayout({ children }: Props) {
    return (
        <ProtectedRoute allowedRoles={["Teacher"]}>
            <AppLayout>{children}</AppLayout>
        </ProtectedRoute>
    );
}