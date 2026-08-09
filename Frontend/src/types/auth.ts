import { UserRole } from "@/config/menu";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    id: string;
    fullName: string;
    email: string;
    role: string;
    token: string;
}

export interface AuthUser {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
}

export interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<AuthUser>;
    logout: () => void;
}