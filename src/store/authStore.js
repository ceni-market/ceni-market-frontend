import { create } from "zustand";

const TEMP_USER = {
    id: 1,
    nickname: "테스트유저",
    email: "test@ceni.com",
    accessToken: "temp-token",
};

export const useAuthStore = create((set) => ({
    user: TEMP_USER,

    token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzcDI4NzdAa25vdS5hYy5rciIsImlhdCI6MTc3OTQxMzAwMiwiZXhwIjoxNzc5NTkzMDAyfQ.f0v_gvdRcQscXhxhhkgroOaxq1-VvWv4YwmcLLEXHDs",

    login: (userData) =>
        set({
            user: userData,
        }),

    logout: () =>
        set({
            user: null,
        }),
}));