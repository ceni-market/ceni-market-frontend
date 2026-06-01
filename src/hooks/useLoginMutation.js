import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import {apiClient} from "../api/apiClient.js";

export const useLoginMutation = () => {
    const navigate = useNavigate();

    // Zustand 스토어의 login 함수 가져오기
    const login = useAuthStore((state) => state.login);

    const setUser = useAuthStore((state) => state.setUser);

    return useMutation({
        // 1. 실행할 비동기 API 함수
        mutationFn: loginApi,


        // 2. 로그인 성공 시 실행될 콜백 함수
        onSuccess: async (data,{ keepLogin }) => {
            // 스토어와 로컬스토리지에 토큰 및 유저 정보 자동 저장
            login({ ...data, keepLogin });
            try {
                // ② [디펜시브/추천] 로그인 직후, 방금 받은 토큰을 들고 내 프로필 정보 채우기
                // (백엔드에 회원 정보 조회 엔드포인트가 구현되어 있다면 주석을 해제하세요)
                const userResponse = await apiClient.get("/mypage/me");
                setUser(userResponse.data.data);
            } catch (userError) {
                console.error("유저 정보를 불러오는데 실패했습니다:", userError);
            }

            // 저장 완료 후 메인(홈) 페이지로 안전하게 이동
            navigate("/");
        },

        // 3. 로그인 실패 시 실행될 콜백 함수
        onError: (error) => {
            // 백엔드가 던져준 에러 메시지가 있다면 출력, 없으면 기본 메시지
            const errorMessage = error.response?.data?.message || "로그인에 실패했습니다.";
            console.error("🚨 로그인 에러 발생:", errorMessage);
        },
    });
};