import AppFeatures from '../../../widgets/app-features/AppFeatures.jsx';
import AppFooter from '../../../widgets/app-footer/AppFooter.jsx';
import AppHeader from '../../../widgets/app-header/AppHeader.jsx';
import AppNav from '../../../widgets/app-nav/AppNav.jsx';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.scss';

const SIGNUP_STEPS = [
  { number: 1, label: '이메일 인증', active: true },
  { number: 2, label: '가입 완료', active: false },
];

function SignupStep({ step }) {
  return (
    <div className={`signup-steps-item${step.active ? ' signup-steps-item-active' : ''}`}>
      <span className="signup-steps-number">{step.number}</span>
      <span className="signup-steps-label">{step.label}</span>
    </div>
  );
}

function SignupField({ id, label, type = 'text', placeholder, icon, help }) {
  return (
    <label className="signup-field" htmlFor={id}>
      <span className="signup-field-label">{label}</span>
      <span className="signup-field-control">
        <i className={`signup-field-icon bi ${icon}`} aria-hidden="true" />
        <input id={id} name={id} type={type} placeholder={placeholder} />
      </span>
      {help ? <span className="signup-field-help">{help}</span> : null}
    </label>
  );
}

function Signup() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/email-confirm');
  };

  return (
    <main className="signup-page">
      <AppHeader />
      <AppNav />

      <section className="signup-shell content-container" data-node-id="435:2279">
        <div className="signup-panel" data-node-id="435:2286">
          <div className="signup-card" data-node-id="435:2288">
            <header className="signup-card-header">
              <h1>회원가입</h1>
              <p>세니마켓을 이용하려면 회원가입이 필요합니다</p>
            </header>

            <div className="signup-steps" aria-label="회원가입 단계">
              <SignupStep step={SIGNUP_STEPS[0]} />
              <span className="signup-steps-line" aria-hidden="true" />
              <SignupStep step={SIGNUP_STEPS[1]} />
            </div>

            <form className="signup-form" onSubmit={handleSubmit}>
              <SignupField
                id="signup-email"
                label="이메일(아이디)"
                type="email"
                placeholder="이메일을 입력해주세요 (example@itcen.com)"
                icon="bi-envelope"
              />
              <SignupField
                id="signup-password"
                label="비밀번호"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                icon="bi-lock"
                help="영문, 숫자, 특수문자 포함 8~16자"
              />
              <SignupField
                id="signup-name"
                label="이름"
                placeholder="이름을 입력해주세요"
                icon="bi-person"
              />

              <button className="signup-submit" type="submit">
                이메일 인증하기
              </button>
            </form>

            <p className="signup-login">
              <span>이미 계정이 있으신가요?</span>
              <Link to="/login">로그인 &gt;</Link>
            </p>
          </div>
        </div>

        <aside className="signup-intro" data-node-id="435:2281">
          <div className="signup-intro-copy">
            <strong>
              세니마켓은 ITCEN 구성원을 위한
              <span>따뜻한 나눔과 신뢰의 공간입니다</span>
            </strong>
            <p>
              안 쓰는 물건은 나누고
              <span>필요한 물건은 알뜰하게 구매하세요</span>
            </p>
          </div>
          <div className="signup-intro-image">
            <img src="/assets/images/login-background.png" alt="" />
          </div>
        </aside>
      </section>

      <AppFeatures />
      <AppFooter />
    </main>
  );
}

export default Signup;
