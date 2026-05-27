import { create } from "zustand";

const TEMP_USER = {
    id: 1,
    nickname: "테스트유저",
    email: "test@ceni.com",
    accessToken: "temp-token",
};

export const useAuthStore = create((set) => ({
    user: TEMP_USER,

    token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzcDI4NzdAa25vdS5hYy5rciIsImlhdCI6MTc3OTc1Nzg2OCwiZXhwIjoxNzc5OTM3ODY4fQ.4YcLC-6blNWutVD2GdG41aIBXRKZ2KzXEcdwbY7NyIw",

    login: (userData) =>
        set({
            user: userData,
        }),

    logout: () =>
        set({
            user: null,
        }),
}));