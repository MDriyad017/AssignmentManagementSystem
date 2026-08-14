import { ReactNode } from "react";
import AppLayout from "@/components/layout/AppLayout";

interface Props {
    children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
    return <AppLayout>{children}</AppLayout>;
}