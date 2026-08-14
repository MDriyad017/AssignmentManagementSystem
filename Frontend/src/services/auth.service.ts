import apiClient from "@/lib/api-client";
import axios from "axios";

export const login = async (email: string, password: string) => {
    try {
        const response = await apiClient.post("/Auth/login", { email, password });
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data?.message;

            if (message) {
                throw new Error(message);
            }

            switch (status) {
                case 400:
                    throw new Error("Invalid email or password.");
                case 401:
                    throw new Error("Invalid credentials. Please check your email and password.");
                case 404:
                    throw new Error("User not found. Please check your email.");
                case 500:
                    throw new Error("Server error. Please try again later.");
                default:
                    throw new Error("Login failed. Please try again.");
            }
        }

        if (error instanceof Error) {
            throw error;
        }

        throw new Error("An unexpected error occurred. Please try again.");
    }
};