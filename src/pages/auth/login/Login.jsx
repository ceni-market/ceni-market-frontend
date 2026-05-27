import AppFeatures from '../../../widgets/app-features/AppFeatures.jsx';
import AppFooter from '../../../widgets/app-footer/AppFooter.jsx';
import AppHeader from '../../../widgets/app-header/AppHeader.jsx';
import AppNav from '../../../widgets/app-nav/AppNav.jsx';
import { Link } from 'react-router-dom';
import './Login.scss';
import React, { useState } from 'react';
import { useLoginMutation } from '../../../hooks/useLoginMutation';

function LoginField({ id, type, placeholder, icon, value, onChange }) {
  return (
    <label className="login-field" htmlFor={id}>
      <i className={`login-field-icon bi ${icon}`} aria-hidden="true" />
      <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}       // 값 바인딩
          onChange={onChange} // 입력 전파
          required
      />
    </label>
  );
}

function Login() {
  // 입력값을 기억할 State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 로그인 상태 유지 체크 여부를 관리할 State 추가 (기본값: false)
  const [keepLogin, setKeepLogin] = useState(false);

  // 리액트 쿼리 커스텀 훅 연결
  const { mutate, isPending, error } = useLoginMutation();

  // 💡 4. 실제 백엔드 로그인 요청으로 핸들러 교체
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) return;

    // React Query mutation 실행 (이메일, 비밀번호 전달)
    mutate({ email, password, keepLogin });
  };

  // 소셜 로그인 연동 핸들러 함수
  // 스프링 시큐리티 OAuth2 기본 규격 엔드포인트로 브라우저 주소를 강제 이동시킵니다.
  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost:8088/oauth2/authorization/${provider}`;
  };

  return (
    <main className="login-page">
      <AppHeader />
      <AppNav />

      <section className="login-shell content-container" data-node-id="444:2417">
        <div className="login-panel" data-node-id="444:2424">
          <div className="login-card" data-node-id="444:2426">
            <header className="login-card-header">
              <h1>로그인</h1>
              <p>세니마켓에 오신 것을 환영합니다</p>
            </header>

            <form className="login-form" onSubmit={handleSubmit}>
              {/* 💡 1. 이메일 필드에 상호작용 프롭스(value, onChange) 주입 */}
              <LoginField
                  id="login-email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  icon="bi-person"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
              {/* 💡 2. 비밀번호 필드에 상호작용 프롭스 주입 */}
              <LoginField
                  id="login-password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  icon="bi-lock"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />

              <div className="login-options">
                <label className="login-keep" htmlFor="login-keep">
                  {/* 💡 3. 체크박스 엘리먼트에 리액트 State 바인딩 */}
                  <input
                      id="login-keep"
                      name="keepLogin"
                      type="checkbox"
                      checked={keepLogin}
                      onChange={(e) => setKeepLogin(e.target.checked)}
                  />
                  <span>로그인 상태 유지</span>
                </label>
                <Link className="login-find" to="/find-password">
                  비밀번호 찾기 &gt;
                </Link>
              </div>

              {/* 🚨 3. 에러 발생 시 UI 경고 박스 노출 (스프링 부트 한글 에러 메시지와 연동) */}
              {error && (
                  <div className="login-error-alert" style={{ color: '#dc3545', fontSize: '14px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="bi bi-exclamation-circle-fill"></i>
                    <span>{error.response?.data?.message || '이메일 또는 비밀번호가 일치하지 않습니다.'}</span>
                  </div>
              )}

              {/* 💡 4. 버튼 비활성화 처리 및 텍스트 변경으로 분기 처리 (연타 방지) */}
              <button
                  className="login-submit"
                  type="submit"
                  disabled={isPending}
              >
                {isPending ? '로그인 중...' : '로그인'}
              </button>
            </form>

            <div className="login-divider" aria-hidden="true">
              <span />
              <em>또는</em>
              <span />
            </div>

            {/* 소셜 로그인 버튼에 onClick 핸들러 바인딩 */}
            <div className="login-socials">
              <button
                  className="login-social login-social-google"
                  type="button"
                  onClick={() => handleSocialLogin('google')}
              >
                <img src="/assets/images/google-icon.png" alt="" />
                <span>Google 계정으로 로그인</span>
              </button>

              <button
                  className="login-social login-social-kakao"
                  type="button"
                  onClick={() => handleSocialLogin('kakao')}
              >
                <img src="/assets/images/kakao-icon.png" alt="" />
                <span>Kakao 계정으로 로그인</span>
              </button>
            </div>

            <p className="login-signup">
              <span>아직 계정이 없으신가요?</span>
              <Link to="/signup">회원가입 &gt;</Link>
            </p>
          </div>
        </div>

        <aside className="login-intro" data-node-id="444:2419">
          <div className="login-intro-copy">
            <strong>
              세니마켓은 ITCEN 구성원을 위한
              <span>따뜻한 나눔과 순환의 공간입니다</span>
            </strong>
            <p>
              안 쓰는 물건은 나누고
              <span>필요한 물건은 합리적으로 구매하세요</span>
            </p>
          </div>
          <div className="login-intro-image">
            <img src="/assets/images/login-background.png" alt="" />
          </div>
        </aside>
      </section>

      <AppFeatures />
      <AppFooter />
    </main>
  );
}

export default Login;
