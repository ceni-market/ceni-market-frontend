import { create } from "zustand";

const TEMP_USER = {
    id: 1,
    nickname: "테스트유저",
    email: "test@ceni.com",
    accessToken: "temp-token",
};

export const useAuthStore = create((set) => ({
    user: TEMP_USER,

    login: (userData) =>
        set({
            user: userData,
        }),

    logout: () =>
        set({
            user: null,
        }),
}));