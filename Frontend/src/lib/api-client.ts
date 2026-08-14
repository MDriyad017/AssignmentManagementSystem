import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

apiClient.interceptors.request.use(
    (config) => {
        console.log(
            "[API] Request:",
            config.method?.toUpperCase(),
            config.url
        );

        console.log(
            "[API] withCredentials:",
            config.withCredentials
        );

        return config;
    },
    (error) => {
        console.error("[API] Request Error:", error);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        console.log(
            "[API] Response:",
            response.status,
            response.config.url
        );

        return response;
    },
    (error) => {
        console.error("[API] API Error:", {
            status: error.response?.status,
            url: error.response?.config?.url,
            method: error.response?.config?.method,
            data: error.response?.data
        });

        return Promise.reject(error);
    }
);

export default apiClient;