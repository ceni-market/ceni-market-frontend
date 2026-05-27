import axios from "axios";
import { useAuthStore } from "../store/authStore";

// 1. 우리 프로젝트 전용 공통 Axios 인스턴스 생성
export const apiClient = axios.create({
    // baseURL: "http://localhost:8088/api", // 백엔드 포트와 API 루트 경로
    baseURL: "https://api.ceni-market.site", // 백엔드 포트와 API 루트 경로
    timeout: 5000,                       // 5초 동안 응답이 없으면 타임아웃
    headers: {
        "Content-Type": "application/json",
    },
});

// 2. 요청 인터셉터 설정
apiClient.interceptors.request.use(
    (config) => {
        // ✨ [핵심] 1단계에서 만든 Zustand 스토어에서 실시간 accessToken 꺼내기
        const { accessToken } = useAuthStore.getState();

        // 토큰이 존재한다면, 백엔드가 요구하는 규격(Bearer )에 맞춰 헤더에 주입
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // 세팅이 완료된 원래 요청(config)을 그대로 출항시킵니다.
        return config;
    },
    (error) => {
        // 요청 자체에서 에러가 발생한 경우 에러를 반환
        return Promise.reject(error);
    }
);

// 응답(Response) 인터셉터: 백엔드의 응답 결과를 가로채서 401 처리 수행
apiClient.interceptors.response.use(
    // 200번대 정상 응답은 아무 작업 없이 그대로 통과시킵니다.
    (response) => response,

    // 에러 발생 시 (400, 401, 500 등) 이쪽 핸들러로 진입합니다.
    async (error) => {
        const originalRequest = error.config; // 에러가 발생한 원래 요청의 모든 설정 정보

        // 🚨 401 Unauthorized 에러가 발생했고, 이 요청이 재시도된 적이 없다면 실행
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // 💡 [방어 코드] 무한 루프 방지용 재시도 플래그 설정

            try {
                // Zustand 스토어에서 refresh 함수 및 토큰들을 호출 (.getState() 사용)
                const { refreshToken, login, logout } = useAuthStore.getState();

                if (!refreshToken) {
                    throw new Error("리프레시 토큰이 스토어에 존재하지 않습니다.");
                }

                // 🔄 백엔드에 토큰 재발급(Refresh) API 호출
                // 순환 호출 에러를 방지하기 위해 apiClient 대신 순수 전역 axios를 사용합니다.
                const refreshResponse = await axios.post("https://api.ceni-market.site/api/auth/refresh", {
                    refreshToken: refreshToken
                });

                // 백엔드가 { accessToken: '...', refreshToken: '...', user: {...} } 형태로 준다고 가정
                const newAuthData = refreshResponse.data;

                // 1단계 스토어의 login 액션을 재사용하여 새 토큰들을 스토어와 LocalStorage에 갱신
                login(newAuthData);

                // 실패했던 원래 요청의 헤더를 새 발급받은 핫한 accessToken으로 교체
                originalRequest.headers.Authorization = `Bearer ${newAuthData.accessToken}`;

                // ✨ 원래 실패했던 API 요청을 새 토큰과 함께 그대로 백엔드에 재전송!
                return apiClient(originalRequest);

            } catch (refreshError) {
                // ❌ 리프레시 토큰마저 만료되었거나 서버 인증에 실패한 경우 완전히 세션이 죽은 것입니다.
                console.error("🚨 세션이 만료되었습니다. 로그아웃 처리됩니다.", refreshError);

                // 스토어 및 로컬스토리지 청소
                useAuthStore.getState().logout();

                // 로그인 페이지로 강제 리다이렉트 (컴포넌트 밖이므로 window.location 사용)
                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        // 401 에러가 아니거나 이미 재시도했는데도 실패한 경우 에러를 컴포넌트(리액트쿼리)로 던짐
        return Promise.reject(error);
    }
);