import { create } from "zustand";

// 💡 안전하게 양쪽 스토리지에서 토큰을 모두 조회하는 헬퍼 함수
const getAuthItem = (key) => localStorage.getItem(key) || sessionStorage.getItem(key);

export const useAuthStore = create((set) => ({
    // 1. 초기 상태: 새로고침 시 브라우저 내 저장소(localStorage)에서 값을 꺼내옵니다.
    accessToken: getAuthItem("accessToken"),
    refreshToken: getAuthItem("refreshToken"),
    expireTime: getAuthItem("expireTime") ? Number(getAuthItem("expireTime")) : null,
    user: getAuthItem("user") ? JSON.parse(getAuthItem("user")) : null,

    // 2. 로그인 액션: 백엔드 로그인 API가 던져준 성공 데이터를 그대로 받아 저장합니다.
    login: (data) => {
        const { accessToken, refreshToken, accessTokenExpiresIn, keepLogin } = data;

        // 💡 true면 localStorage, false면 sessionStorage를 타겟으로 지정
        const storage = keepLogin ? localStorage : sessionStorage;
        const oppositeStorage = keepLogin ? sessionStorage : localStorage;

        // 🚨 [방어 코드] 혹시 반대쪽 창고에 남아있을지 모르는 옛날 토큰 흔적을 완전히 박멸
        oppositeStorage.removeItem("accessToken");
        oppositeStorage.removeItem("refreshToken");
        oppositeStorage.removeItem("expireTime");
        oppositeStorage.removeItem("user");

        // 새로고침 대비: 현재 시간(ms)에 만료 시간(초 * 1000)을 더해 '절대 만료 타임스탬프' 구축
        const expireTime = Date.now() + (Number(accessTokenExpiresIn) * 1000);

        // 💡 선택된 창고에 백엔드가 준 LoginResponseDTO 토큰 세트 저장
        storage.setItem("accessToken", accessToken);
        storage.setItem("refreshToken", refreshToken);
        storage.setItem("expireTime", String(expireTime));

        // Zustand 전역 메모리 상태 업데이트
        set({ accessToken, refreshToken, expireTime });
    },

    // 3. 유저 정보 세팅 액션 (마이페이지나 유저 정보 조회 API 호출 후 사용)
    setUser: (userData) => {
        const storage = localStorage.getItem("accessToken") ? localStorage : sessionStorage;
        storage.setItem("user", JSON.stringify(userData));
        set({ user: userData });
    },

    // 4. 로그아웃 액션: 모든 저장 공간을 깨끗하게 청소합니다.
    logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("expireTime");
        localStorage.removeItem("user");

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("expireTime");
        sessionStorage.removeItem("user");

        set({ accessToken: null, refreshToken: null, expireTime: null, user: null });
    },
}));