import { Link } from 'react-router-dom';
import AppFeatures from '../../../widgets/app-features/AppFeatures.jsx';
import AppFooter from '../../../widgets/app-footer/AppFooter.jsx';
import AppHeader from '../../../widgets/app-header/AppHeader.jsx';
import AppNav from '../../../widgets/app-nav/AppNav.jsx';
import './SignupComplete.scss';

function SignupComplete() {
  return (
    <main className="signup-complete-page">
      <AppHeader />
      <AppNav />

      <section className="signup-complete-shell content-container" data-node-id="455:1871">
        <div className="signup-complete-panel" data-node-id="455:1878">
          <div className="signup-complete-card">
            <header className="signup-complete-header" data-node-id="455:1900">
              <h1>회원가입</h1>
              <p>세니마켓을 이용하려면 회원가입이 필요합니다</p>
            </header>

            <div className="signup-complete-steps" aria-label="회원가입 단계" data-node-id="455:1890">
              <div className="signup-complete-step signup-complete-step-done">
                <span className="signup-complete-step-number">
                  <i className="bi bi-check-lg" aria-hidden="true" />
                </span>
                <span className="signup-complete-step-label">이메일 인증</span>
              </div>
              <span className="signup-complete-step-line" aria-hidden="true" />
              <div className="signup-complete-step signup-complete-step-active">
                <span className="signup-complete-step-number">2</span>
                <span className="signup-complete-step-label">가입 완료</span>
              </div>
            </div>

            <section className="signup-complete-message" data-node-id="455:1884">
              <span className="signup-complete-icon" aria-hidden="true">
                <i className="bi bi-envelope-check" />
              </span>
              <h2>회원가입이 완료되었습니다!</h2>
              <p>
                입력하신 이메일 인증이 완료되었습니다.
                <span>아래 버튼을 클릭하여 로그인을 진행해주세요.</span>
              </p>
            </section>

            <Link className="signup-complete-login" to="/login" data-node-id="455:1881">
              로그인 페이지로 이동하기
            </Link>
          </div>
        </div>

        <aside className="signup-complete-intro" data-node-id="455:1873">
          <div className="signup-complete-intro-copy">
            <strong>
              세니마켓은 ITCEN 구성원을 위한
              <span>따뜻한 나눔과 신뢰의 공간입니다</span>
            </strong>
            <p>
              안 쓰는 물건은 나누고
              <span>필요한 물건은 알뜰하게 구매하세요</span>
            </p>
          </div>
          <div className="signup-complete-intro-image">
            <img src="/assets/images/login-background.png" alt="" />
          </div>
        </aside>
      </section>

      <AppFeatures />
      <AppFooter />
    </main>
  );
}

export default SignupComplete;
