import axios from "axios";
import { getToken, removeToken } from "@/lib/auth";
import { USER_KEY } from "@/utils/constants";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
    config => {
        const token = getToken();

        if (token)
            config.headers.Authorization = `Bearer ${token}`;

        return config;
    },
    error => Promise.reject(error)
);

apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            removeToken();

            if (typeof window !== "undefined")
                localStorage.removeItem(USER_KEY);
        }

        return Promise.reject(error);
    }
);

export default apiClient;