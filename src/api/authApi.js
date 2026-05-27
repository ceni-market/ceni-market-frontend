import { apiClient } from "./apiClient";

/**
 * 로그인 API 호출 함수
 * @param {Object} credentials - 이메일과 비밀번호를 담은 객체
 */
export const loginApi = async ({ email, password }) => {
    // 2단계에서 만든 apiClient를 사용하므로 baseURL 뒤의 주소만 적어주면 됩니다.
    const response = await apiClient.post("/auth/login", {
        email,
        password,
    });

    // 백엔드 응답(Response Body) 데이터 반환
    // 예: { accessToken: "...", refreshToken: "...", user: { id: 1, email: "..." } }
    return response.data;
};