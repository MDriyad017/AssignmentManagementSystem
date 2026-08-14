"use client";
import { createContext, ReactNode, useState, useEffect, useContext, useTransition } from "react";
import { AuthContextType, AuthUser } from "@/types/auth";
import apiClient from "@/lib/api-client";
import { usePathname, useRouter } from "next/navigation";
import { login as loginService } from "@/services/auth.service";

export const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
    children: ReactNode;
}

export function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [, startTransition] = useTransition();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (pathname === '/login') {
            startTransition(() => {
                setIsLoading(false);
            });
            return;
        }

        const checkAuth = async () => {
            try {
                console.log("[AuthContext] Checking auth...");
                const response = await apiClient.get('/Auth/me');
                console.log("[AuthContext] /Auth/me response:", response.data);

                if (response.data.success) {
                    startTransition(() => {
                        setUser({
                            id: response.data.data.id,
                            fullName: response.data.data.fullName,
                            email: response.data.data.email,
                            role: response.data.data.role,
                        });
                    });
                    console.log("[AuthContext] User set:", response.data.data);
                } else {
                    startTransition(() => {
                        setUser(null);
                    });
                }
            } catch (error) {
                console.error("[AuthContext] Auth check failed:", error);
                startTransition(() => {
                    setUser(null);
                });
            } finally {
                startTransition(() => {
                    setIsLoading(false);
                });
            }
        };

        checkAuth();
    }, [pathname]);

    const login = async (email: string, password: string): Promise<AuthUser> => {
        try {
            startTransition(() => {
                setIsLoading(true);
            });

            console.log("[AuthContext] Login attempt:", email);

            const response = await loginService(email, password);

            console.log("[AuthContext] Login response:", response);

            if (!response.success) {
                throw new Error(response.message || "Login failed.");
            }

            const userData = response.data;

            const authUser: AuthUser = {
                id: userData.id,
                fullName: userData.fullName,
                email: userData.email,
                role: userData.role,
            };

            startTransition(() => {
                setUser(authUser);
            });

            console.log("[AuthContext] Login successful:", authUser);

            return authUser;
        } finally {
            startTransition(() => {
                setIsLoading(false);
            });
        }
    };

    const logout = async () => {
        try {
            console.log("[AuthContext] Logout called");
            await apiClient.post('/Auth/logout');
        } catch (error) {
            console.error("[AuthContext] Logout error:", error);
        } finally {
            startTransition(() => {
                setUser(null);
            });
            console.log("[AuthContext] User cleared");
            router.push('/login');
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token: null,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}