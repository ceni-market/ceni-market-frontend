import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppFeatures from '../../../widgets/app-features/AppFeatures.jsx';
import AppFooter from '../../../widgets/app-footer/AppFooter.jsx';
import AppHeader from '../../../widgets/app-header/AppHeader.jsx';
import AppNav from '../../../widgets/app-nav/AppNav.jsx';
import './EmailConfirm.scss';

function EmailConfirm({ redirectTo }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!redirectTo) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      navigate(redirectTo);
    }, 2000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [navigate, redirectTo]);

  return (
    <main className="email-confirm-page">
      <AppHeader />
      <AppNav />

      <section className="email-confirm-shell content-container" data-node-id="454:1750">
        <div className="email-confirm-panel" data-node-id="454:1752">
          <div className="email-confirm-icon" aria-hidden="true" data-node-id="454:1766">
            <i className="bi bi-envelope-check" />
          </div>

          <header className="email-confirm-head" data-node-id="454:1763">
            <h1>인증메일을 발송했습니다!</h1>
            <p>
              입력하신 이메일 주소로 인증메일을 발송했습니다.
              <span>메일함을 확인하여 인증을 완료해주세요.</span>
            </p>
          </header>

          <section className="email-confirm-notice" data-node-id="454:1756">
            <div className="email-confirm-notice-title">
              <i className="bi bi-info-circle" aria-hidden="true" />
              <strong>확인해주세요</strong>
            </div>
            <ul>
              <li>메일이 보이지 않는 경우 스팸메일함을 확인해주세요.</li>
              <li>인증메일의 유효시간은 10분입니다.</li>
            </ul>
          </section>

          <p className="email-confirm-resend" data-node-id="454:1754">
            <span>메일을 받지 못하셨나요?</span>
            <button type="button">재발송 (59초 후 가능)</button>
          </p>
        </div>
      </section>

      <AppFeatures />
      <AppFooter />
    </main>
  );
}

export default EmailConfirm;
