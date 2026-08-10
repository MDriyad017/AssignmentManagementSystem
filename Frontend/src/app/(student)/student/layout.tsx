import { ReactNode } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

interface Props {
    children: ReactNode;
}

export default function StudentLayout({ children }: Props) {
    return (
        <ProtectedRoute allowedRoles={["Student"]}>
            <AppLayout>{children}</AppLayout>
        </ProtectedRoute>
    );
}