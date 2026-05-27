import { create } from "zustand";

const TEMP_USER = {
    id: 1,
    nickname: "테스트유저",
    email: "test@ceni.com",
    accessToken: "temp-token",
};

export const useAuthStore = create((set) => ({
    // 1. 초기 상태: 새로고침 시 브라우저 내 저장소(localStorage)에서 값을 꺼내옵니다.
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    accessTokenExpiresIn: localStorage.getItem("accessTokenExpiresIn") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,

    // 2. 로그인 액션: 백엔드 로그인 API가 던져준 성공 데이터를 그대로 받아 저장합니다.
    login: (data) => {
        const { accessToken, refreshToken, accessTokenExpiresIn } = data;

        // 브라우저를 껐다 켜도 유지되도록 로컬스토리지에 저장
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("accessTokenExpiresIn", accessTokenExpiresIn);

        set({ accessToken, refreshToken, accessTokenExpiresIn });
    },

    // 3. 유저 정보 세팅 액션 (마이페이지나 유저 정보 조회 API 호출 후 사용)
    setUser: (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        set({ user: userData });
    },

    // 4. 로그아웃 액션: 모든 저장 공간을 깨끗하게 청소합니다.
    logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessTokenExpiresIn");
        localStorage.removeItem("user");

        set({ accessToken: null, refreshToken: null, accessTokenExpiresIn: null, user: null });
    },
}));