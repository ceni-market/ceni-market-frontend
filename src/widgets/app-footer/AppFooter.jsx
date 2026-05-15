import { Link } from 'react-router-dom';
import './AppFooter.scss';

function AppFooter() {
  return (
    <footer className="app-footer" data-node-id="425:2028">
      <div className="app-footer-inner content-container">
        <div className="app-footer-left">
          <Link className="app-footer-brand" to="/" aria-label="세니마켓 홈">
            <img className="app-footer-logo" src="/assets/images/footer-logo.png" alt="" />
          </Link>

          <p className="app-footer-desc">
            <span className="app-footer-desc-line">
              ITCEN 구성원을 위한 중고 거래 및 나눔 플랫폼
            </span>
            <span className="app-footer-desc-line">
              함께 나누고, 함께 성장하는 따뜻한 공간입니다.
            </span>
          </p>
        </div>

        <div className="app-footer-right">
          <strong className="app-footer-title">문의 안내</strong>
          <p className="app-footer-help">세니마켓 이용 관련 문의는 아래로 연락주세요.</p>

          <dl className="app-footer-info">
            <div className="app-footer-info-row">
              <dt className="app-footer-info-label">이메일</dt>
              <dd className="app-footer-info-value">sp2877@knou.ac.kr</dd>
            </div>
            <div className="app-footer-info-row">
              <dt className="app-footer-info-label">운영시간</dt>
              <dd className="app-footer-info-value">
                평일 09:00 - 18:00 (점심 12:00 - 13:00)
              </dd>
            </div>
          </dl>

          <p className="app-footer-copy">@ ITCEN. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
