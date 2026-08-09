import apiClient from "@/lib/api-client";

export const login = async (email: string, password: string) => {
    try {
        const response = await apiClient.post("/Auth/login", { email, password });
        return response.data;
    } catch (error) {
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
            if (axiosError.response?.status === 400) {
                const message = axiosError.response?.data?.message || "Invalid email or password";
                throw new Error(message);
            }
            if (axiosError.response?.status === 401) {
                throw new Error("Invalid credentials. Please check your email and password.");
            }
            if (axiosError.response?.status === 404) {
                throw new Error("User not found. Please check your email.");
            }
            throw new Error(axiosError.response?.data?.message || "Login failed. Please try again.");
        }
        throw new Error("An unexpected error occurred. Please try again.");
    }
};