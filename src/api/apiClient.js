import axios from "axios";
import { useAuthStore } from "../store/authStore";

const IS_LOCAL = window.location.hostname === 'localhost';

const BACKEND_URL = IS_LOCAL
    ? "http://localhost:8088"
    : "https://api.ceni-market.site";

// 1. 우리 프로젝트 전용 공통 Axios 인스턴스 생성
export const apiClient = axios.create({
    baseURL: `${BACKEND_URL}/api`, // 백엔드 포트와 API 루트 경로
    timeout: 5000,                       // 5초 동안 응답이 없으면 타임아웃
    headers: {
        "Content-Type": "application/json",
    },
});

// 2. 요청 인터셉터 설정
// 💡 헬퍼 함수: 현재 로그인 유저가 '로그인 상태 유지(localStorage)'를 사용 중인지 감지
const checkKeepLogin = () => !!localStorage.getItem("accessToken");

// 2. [🔒 1차 방어벽] 요청(Request) 인터셉터 설정
apiClient.interceptors.request.use(
    async (config) => {
        // Zustand 스토어에서 실시간 상태 꺼내기
        const { accessToken, refreshToken, expireTime, login, logout } = useAuthStore.getState();

        // 토큰이 존재한다면, 백엔드가 요구하는 규격(Bearer )에 맞춰 헤더에 주입
        if (accessToken) {
            // 💡 디펜시브 체크: 만료 1분 전(60000ms)이거나 이미 만료되었다면 즉시 재발급 절차 가동
            const isExpired = expireTime && Date.now() >= (expireTime - 60000);

            if (isExpired && refreshToken) {
                try {
                    // 무한 루프 방지를 위해 순수 axios 객체로 로컬 백엔드 서버를 찌름
                    const response = await axios.post("https://api.ceni-market.site/api/auth/refresh", {
                        refreshToken: refreshToken
                    });

                    // 백엔드가 새로 던져준 토큰 세트 수령 (LoginResponseDTO 규격)
                    const {
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                        accessTokenExpiresIn
                    } = response.data;

                    const isKeepLogin = checkKeepLogin();

                    // Zustand 창고 동기화 및 갱신 (만료 시간 연장 완료)
                    login({
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                        accessTokenExpiresIn,
                        keepLogin: isKeepLogin
                    });

                    // 이번에 날리려던 원래 요청의 헤더에 신상 토큰을 장착
                    config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                } catch (error) {
                    // 리프레시 토큰마저 만료되었거나 DB 검증에 실패한 경우 완전히 튕겨내기
                    console.error('세션이 만료되어 자동 로그아웃됩니다.', error);
                    logout();
                    window.location.href = '/login?error=session_expired';
                    return Promise.reject(error);
                }
            } else {
                // 토큰 수명이 넉넉하게 남아있다면 기존 토큰을 헤더에 삽입
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
        }

        // 세팅이 완료된 원래 요청(config)을 그대로 출항
        return config;
    },
    (error) => {
        // 요청 자체에서 에러가 발생한 경우 에러를 반환
        return Promise.reject(error);
    }
);

// 3. [🔒 2차 방어벽] 응답(Response) 인터셉터: 백엔드의 응답 결과를 가로채서 401 처리 수행
apiClient.interceptors.response.use(
    // 200번대 정상 응답은 아무 작업 없이 그대로 통과
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

                // 🔄 📌 💡 서버 주소 동기화: 테스트 환경을 위해 로컬 호스트 주소로 통일합니다.
                const refreshResponse = await axios.post("https://api.ceni-market.site/api/auth/refresh", {
                    refreshToken: refreshToken
                });

                const {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                    accessTokenExpiresIn
                } = refreshResponse.data;

                const isKeepLogin = checkKeepLogin();

                // 📌 💡 규격 매칭 수정: 1단계 스토어의 객체 형태 규격에 맞추어 로그인 데이터를 주입합니다.
                login({
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                    accessTokenExpiresIn,
                    keepLogin: isKeepLogin
                });

                // 실패했던 원래 요청의 헤더를 새 발급받은 핫한 accessToken으로 교체
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // ✨ 원래 실패했던 API 요청을 새 토큰과 함께 그대로 백엔드에 재전송!
                return apiClient(originalRequest);

            } catch (refreshError) {
                // ❌ 리프레시 토큰마저 만료되었거나 서버 인증에 실패한 경우 완전히 세션이 죽은 것입니다.
                console.error("🚨 세션이 만료되었습니다. 로그아웃 처리됩니다.", refreshError);

                // 스토어 및 로컬스토리지 청소
                useAuthStore.getState().logout();

                // 로그인 페이지로 강제 리다이렉트 (컴포넌트 밖이므로 window.location 사용)
                window.location.href = "/login?error=session_expired";

                return Promise.reject(refreshError);
            }
        }

        // 401 에러가 아니거나 이미 재시도했는데도 실패한 경우 에러를 컴포넌트(리액트쿼리)로 던짐
        return Promise.reject(error);
    }
);