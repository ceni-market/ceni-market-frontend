import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import {apiClient} from "../../../api/apiClient.js";

function OAuth2RedirectHandler() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        // 1. URL 쿼리 스트링에서 백엔드가 실어 보낸 토큰 세트 추출
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const accessTokenExpiresIn = searchParams.get('accessTokenExpiresIn');

        // 2. 토큰이 모두 정상적으로 존재하면 Zustand 로그인 액션 가동
        if (accessToken && refreshToken && accessTokenExpiresIn) {
            login({
                accessToken,
                refreshToken,
                accessTokenExpiresIn,
                keepLogin: true // 소셜 로그어인은 브라우저를 껐다 켜도 유지되도록 true 설정
            });
            //mypage api에 요청해서 authStore에 User데이터 저장
            (async () => {
                try {
                    const userResponse = await apiClient.get("/mypage/me");
                    setUser(userResponse.data.data);
                } catch (userError) {
                    console.error("유저 정보를 불러오는데 실패했습니다:", userError);
                }
                // 3. 창고 저장 완료 후 주소창을 깨끗하게 밀고 메인 화면으로 리다이렉트
                navigate('/', { replace: true });
            })();

        } else {
            // 만약 토큰이 없다면 실패한 것이므로 로그인 페이지로 빽
            navigate('/login?error=oauth2_failed', { replace: true });
        }
    }, [searchParams, login, navigate]);

    return (
        <div style={loadingContainerStyle}>
            <div className="spinner"></div> {/* 기존 프로젝트의 CSS 스피너를 활용하세요 */}
            <p style={textStyle}>소셜 로그인을 안전하게 처리하고 있습니다.</p>
            <p style={subTextStyle}>잠시만 기다려주세요...</p>
        </div>
    );
}

// 레이아웃용 인라인 스타일
const loadingContainerStyle = {
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
    height: '100vh', backgroundColor: '#f9f9f9'
};
const textStyle = { marginTop: '20px', fontSize: '18px', fontWeight: 'bold', color: '#333' };
const subTextStyle = { marginTop: '8px', fontSize: '14px', color: '#888' };

export default OAuth2RedirectHandler;