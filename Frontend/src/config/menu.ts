import { BookOpen, ClipboardList, FileText, GraduationCap, Home, Settings, User, Users, UserPlus, UserCog } from "lucide-react";
import { ElementType } from "react";

export type UserRole = "Admin" | "Teacher" | "Student";

export interface MenuItem {
    title: string;
    href: string;
    icon: ElementType;
    badge?: number;
    children?: MenuItem[];
    permission?: string;
}

export type MenuConfig = Record<UserRole, MenuItem[]>;

export const menuConfig: MenuConfig = {
    Admin: [
        { title: "Dashboard", href: "/admin/dashboard", icon: Home },
        { title: "Users", href: "/admin/users", icon: Users },
        { title: "Classes", href: "/admin/classes", icon: GraduationCap },
        { title: "Subjects", href: "/admin/subjects", icon: BookOpen },
        { title: "Student Class", href: "/admin/student-class-assign", icon: UserPlus },
        { title: "Teacher Subject", href: "/admin/teacher-subject-assign", icon: UserCog },
        { title: "Assignments", href: "/admin/assignments", icon: ClipboardList },
        { title: "Submissions", href: "/admin/submissions", icon: FileText },
        { title: "Settings", href: "/admin/settings", icon: Settings },
    ],

    Teacher: [
        { title: "Dashboard", href: "/teacher/dashboard", icon: Home },
        { title: "My Classes", href: "/teacher/classes", icon: GraduationCap },
        { title: "My Subjects", href: "/teacher/subjects", icon: BookOpen },
        { title: "Assignments", href: "/teacher/assignments", icon: ClipboardList },
        { title: "Submissions", href: "/teacher/submissions", icon: FileText },
        { title: "Profile", href: "/teacher/profile", icon: User },
    ],

    Student: [
        { title: "Dashboard", href: "/student/dashboard", icon: Home },
        { title: "My Classes", href: "/student/classes", icon: GraduationCap },
        { title: "My Subjects", href: "/student/subjects", icon: BookOpen },
        { title: "Assignments", href: "/student/assignments", icon: ClipboardList },
        { title: "Submissions", href: "/student/submissions", icon: FileText },
        { title: "Profile", href: "/student/profile", icon: User },
    ],
};