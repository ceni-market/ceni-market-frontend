import axios from "axios";
import { useAuthStore } from "../store/authStore";

const BACKEND_URL = import.meta.env.VITE_APP_API_URL;

// 인터셉터가 없는 순수 axios 객체 (무한 루프 방지용)
const axiosInstance = axios.create({
    baseURL: `${BACKEND_URL}/api`,
    timeout: 5000,
});

export const apiClient = axios.create({
    baseURL: `${BACKEND_URL}/api`,
    timeout: 5000,
    headers: { "Content-Type": "application/json" },
});

// 공통 리프레시 함수 (중복 제거)
export const refreshAccessToken = async () => {
    const { refreshToken, login, logout } = useAuthStore.getState();
    if (!refreshToken) throw new Error("리프레시 토큰 없음");

    // 반드시 순수 axiosInstance를 사용
    const response = await axiosInstance.post("/auth/refresh", { refreshToken });
    const { accessToken, refreshToken: newRefreshToken, accessTokenExpiresIn } = response.data;

    login({
        accessToken,
        refreshToken: newRefreshToken,
        accessTokenExpiresIn,
        keepLogin: !!localStorage.getItem("accessToken")
    });
    return accessToken;
};

// Request 인터셉터
apiClient.interceptors.request.use(async (config) => {
    const { accessToken, expireTime, refreshToken } = useAuthStore.getState();

    if (accessToken) {
        const isExpired = expireTime && Date.now() >= (expireTime - 60000);
        if (isExpired && refreshToken) {
            try {
                const newToken = await refreshAccessToken();
                config.headers['Authorization'] = `Bearer ${newToken}`;
            } catch (e) {
                useAuthStore.getState().logout();
                window.location.href = '/login?error=session_expired';
                return Promise.reject(e);
            }
        } else {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
    }
    return config;
});

// Response 인터셉터
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newToken = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest); // 재시도
            } catch (e) {
                useAuthStore.getState().logout();
                window.location.href = "/login?error=session_expired";
                return Promise.reject(e);
            }
        }
        return Promise.reject(error);
    }
);