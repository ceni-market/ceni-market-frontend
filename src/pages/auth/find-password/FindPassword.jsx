import { Link, useNavigate } from 'react-router-dom';
import AppFeatures from '../../../widgets/app-features/AppFeatures.jsx';
import AppFooter from '../../../widgets/app-footer/AppFooter.jsx';
import AppHeader from '../../../widgets/app-header/AppHeader.jsx';
import AppNav from '../../../widgets/app-nav/AppNav.jsx';
import './FindPassword.scss';

const PASSWORD_FIND_STEPS = [
  { number: 1, label: '이메일 입력' },
  { number: 2, label: '이메일 인증' },
  { number: 3, label: '비밀번호 재설정' },
  { number: 4, label: '완료' },
];

function StepItem({ step, currentStep, isLast }) {
  const isActive = step.number === currentStep;
  const isDone = step.number < currentStep;

  return (
    <>
      <div
        className={[
          'find-password-step',
          isActive ? 'find-password-step-active' : '',
          isDone ? 'find-password-step-done' : '',
        ].join(' ')}
      >
        <span className="find-password-step-number">
          {isDone ? <i className="bi bi-check-lg" aria-hidden="true" /> : step.number}
        </span>
        <span className="find-password-step-label">{step.label}</span>
      </div>
      {!isLast ? (
        <i className="find-password-step-arrow bi bi-chevron-right" aria-hidden="true" />
      ) : null}
    </>
  );
}

function FindPasswordHeader({ currentStep }) {
  return (
    <>
      <header className="find-password-header">
        <Link className="find-password-back" to="/login" aria-label="로그인으로 돌아가기">
          <i className="bi bi-arrow-left" aria-hidden="true" />
        </Link>
        <div className="find-password-title-box">
          <h1>비밀번호 찾기</h1>
          <p>가입하신 이메일 주소로 인증후 비밀번호를 재설정할 수 있습니다</p>
        </div>
      </header>

      <div className="find-password-steps" aria-label="비밀번호 찾기 단계">
        {PASSWORD_FIND_STEPS.map((step, index) => (
          <StepItem
            key={step.number}
            step={step}
            currentStep={currentStep}
            isLast={index === PASSWORD_FIND_STEPS.length - 1}
          />
        ))}
      </div>
    </>
  );
}

function EmailStep() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/find-password/verify');
  };

  return (
    <div className="find-password-content find-password-content-email">
      <form className="find-password-form-card" onSubmit={handleSubmit}>
        <div className="find-password-copy">
          <strong>이메일 주소 입력</strong>
          <p>가입 시 사용하신 이메일 주소를 입력해주세요.</p>
        </div>

        <label className="find-password-field" htmlFor="find-password-email">
          <i className="find-password-field-icon bi bi-envelope" aria-hidden="true" />
          <input
            id="find-password-email"
            name="email"
            type="email"
            placeholder="이메일 주소를 입력하세요"
          />
        </label>

        <button className="find-password-submit" type="submit">
          인증메일 보내기
        </button>
      </form>

      <aside className="find-password-guide-card">
        <div className="find-password-guide-top">
          <span className="find-password-guide-icon">
            <i className="bi bi-envelope-check" aria-hidden="true" />
          </span>
          <p>
            이메일 인증을 통해
            <span>비밀번호를 안전하게 찾을 수 있어요.</span>
          </p>
        </div>
        <ul className="find-password-guide-list">
          <li>입력하신 이메일로 인증메일이 발송됩니다.</li>
          <li>이메일 인증 후 새로운 비밀번호를 설정할 수 있습니다.</li>
        </ul>
      </aside>
    </div>
  );
}

function ResetStep() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/find-password/complete');
  };

  return (
    <form className="find-password-reset" onSubmit={handleSubmit}>
      <div className="find-password-reset-copy">
        <strong>새로운 비밀번호를 입력해주세요.</strong>
        <p>영문, 숫자, 특수문자를 포함한 8~16자리를 사용해주세요.</p>
      </div>

      <label className="find-password-reset-field" htmlFor="find-password-new-password">
        <i className="bi bi-lock" aria-hidden="true" />
        <input
          id="find-password-new-password"
          name="newPassword"
          type="password"
          placeholder="새 비밀번호를 입력하세요"
        />
      </label>

      <label className="find-password-reset-field" htmlFor="find-password-new-password-confirm">
        <i className="bi bi-lock" aria-hidden="true" />
        <input
          id="find-password-new-password-confirm"
          name="newPasswordConfirm"
          type="password"
          placeholder="새 비밀번호를 다시 입력하세요"
        />
      </label>

      <button className="find-password-wide-submit" type="submit">
        비밀번호 변경
      </button>
    </form>
  );
}

function CompleteStep() {
  return (
    <div className="find-password-complete">
      <span className="find-password-complete-icon">
        <i className="bi bi-check-lg" aria-hidden="true" />
      </span>
      <strong>비밀번호 재설정이 완료되었습니다!</strong>
      <p>
        새로운 비밀번호로 변경이 완료되었습니다.
        <span>이제 새 비밀번호로 로그인하실 수 있습니다.</span>
      </p>
      <Link className="find-password-login-link" to="/login">
        로그인 페이지로 이동
      </Link>
    </div>
  );
}

function FindPassword({ step = 1 }) {
  return (
    <main className="find-password-page">
      <AppHeader />
      <AppNav />

      <section className="find-password-shell content-container">
        <div className="find-password-panel">
          <FindPasswordHeader currentStep={step} />
          {step === 1 ? <EmailStep /> : null}
          {step === 3 ? <ResetStep /> : null}
          {step === 4 ? <CompleteStep /> : null}
        </div>
      </section>

      <AppFeatures />
      <AppFooter />
    </main>
  );
}

export default FindPassword;
