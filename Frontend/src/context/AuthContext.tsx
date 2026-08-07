"use client";

import { createContext, ReactNode, useState } from "react";
import { login as loginService } from "@/services/auth.service";
import { AuthContextType, AuthUser } from "@/types/auth";
import { getToken, removeToken, saveToken } from "@/lib/auth";
import { USER_KEY } from "@/utils/constants";
export const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
    children: ReactNode;
}

export function AuthProvider({ children }: Props) {
    const [token, setToken] = useState<string | null>(() => getToken());

    const [user, setUser] = useState<AuthUser | null>(() => {
        if (typeof window === "undefined") {
            return null;
        }

        const storedUser = localStorage.getItem(USER_KEY);
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [isLoading, setIsLoading] = useState(false);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await loginService(email, password);
            saveToken(response.token);

            localStorage.setItem(
                USER_KEY,
                JSON.stringify({
                    id: response.id,
                    fullName: response.fullName,
                    email: response.email,
                    role: response.role,
                })
            );

            setToken(response.token);

            setUser({
                id: response.id,
                fullName: response.fullName,
                email: response.email,
                role: response.role,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        removeToken();

        if (typeof window !== "undefined") {
            localStorage.removeItem(USER_KEY);
        }

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, logout,}}>
            {children}
        </AuthContext.Provider>
    );
}