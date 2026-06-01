import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AppFeatures from '../../../widgets/app-features/AppFeatures.jsx';
import AppFooter from '../../../widgets/app-footer/AppFooter.jsx';
import AppHeader from '../../../widgets/app-header/AppHeader.jsx';
import AppNav from '../../../widgets/app-nav/AppNav.jsx';
import './FindPassword.scss';

const BACKEND_URL = import.meta.env.VITE_APP_API_URL;

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

// ==========================================
// [1단계] 이메일 입력 및 발송 컴포넌트
// ==========================================
function EmailStep({ onNext, setEmail }) {
    const [inputEmail, setInputEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!inputEmail) return alert('이메일을 입력해주세요.');

        setLoading(true);
        try {
            // 백엔드 명세에 맞춰 이메일과 목적(PASSWORDRESET) 전송
            await axios.post(`${BACKEND_URL}/api/auth/password-reset/email-request`, {
                email: inputEmail,
                purpose: 'PASSWORDRESET'
            });

            setEmail(inputEmail);
            onNext(); // 2단계(인증 대기)로 스위칭
        } catch (error) {
            console.error(error);
            alert('존재하지 않는 회원이거나 메일 발송 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
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
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            placeholder="이메일 주소를 입력하세요"
            disabled={loading}
          />
        </label>

          <button className="find-password-submit" type="submit" disabled={loading}>
              {loading ? '메일 발송 중...' : '인증메일 보내기'}
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

// ==========================================
// [2단계] 🎯 신규 추가: 이메일 링크 클릭 폴링 대기 컴포넌트
// ==========================================
function VerifyStep({ email, onNext, setToken }) {

    // 1. 재발송 관련 상태 추가 (초기값: 60초/비활성 상태로 시작)
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [resendTimer, setResendTimer] = useState(60);

    // 2. 초기 60초 쿨타임 및 타이머 로직
    useEffect(() => {
        const timer = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsResendDisabled(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // 3. 재발송 핸들러
    const handleResend = async () => {
        try {
            await axios.post(`${BACKEND_URL}/api/auth/password-reset/email-request`, {
                email: email,
                purpose: 'PASSWORDRESET'
            });
            alert('인증 메일이 재발송되었습니다.');
            setIsResendDisabled(true);
            setResendTimer(60);
        } catch (error) {
            alert('재발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
    };

    useEffect(() => {
        // 1.5초 간격으로 백엔드 테이블 감시 시작
        const pollingInterval = setInterval(async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/auth/password-reset/status?email=${email}`);

                // 💡 백엔드 응답: response.data.isVerified
                if (response.data.isVerified === true) {
                    if (response.data.token) {
                        setToken(response.data.token); // 💡 서버에서 온 토큰을 저장
                    }
                    clearInterval(pollingInterval);
                    onNext(); // 3단계(비밀번호 재설정 폼)로 이동
                }
            } catch (error) {
                console.log('인증 상태 확인 중...');
            }
        }, 1500);

        return () => clearInterval(pollingInterval); // 컴포넌트 언마운트 시 폴링 강제 해제 (메모리 누수 방지)
    }, [email, onNext, setToken]);

    return (
        <div className="find-password-content find-password-content-verify" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div className="find-password-form-card" style={{ width: '100%', maxWidth: '100%' }}>
                <div style={{ fontSize: '48px', color: '#0d6efd', marginBottom: '20px' }}>
                    <i className="bi bi-envelope-open-fill"></i>
                </div>
                <strong style={{ fontSize: '18px', display: 'block', marginBottom: '10px' }}>인증 메일이 발송되었습니다!</strong>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                    <span style={{ color: '#0d6efd', fontWeight: 'bold' }}>{email}</span> 주소로 발송된<br />
                    인증 링크를 클릭하시면 비밀번호 재설정 화면으로 자동 전환됩니다.
                </p>
                <div style={{ marginTop: '15px' }}>
                    <button
                        onClick={handleResend}
                        disabled={isResendDisabled}
                        style={{
                            background: 'none', border: 'none', textDecoration: 'underline',
                            color: isResendDisabled ? '#ccc' : '#0d6efd',
                            cursor: isResendDisabled ? 'not-allowed' : 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        {isResendDisabled ? `메일을 못 받으셨나요? 재발송 (${resendTimer}초)` : "메일을 못 받으셨나요? 재발송"}
                    </button>
                </div>
                <div style={{ marginTop: '15px', color: '#999', fontSize: '13px' }}>
                    <span className="spinner-border spinner-border-sm text-primary" role="status" style={{ marginRight: '8px' }}></span>
                    사용자의 메일 확인을 기다리는 중...
                </div>
            </div>
        </div>
    );
}

function ResetStep({ email, token, onNext }) {
    const [formData, setFormData] = useState({ newPassword: '', newPasswordConfirm: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // 간단한 유효성 검사
        if (formData.newPassword !== formData.newPasswordConfirm) {
            return alert('비밀번호가 일치하지 않습니다.');
        }

        try {
            // 백엔드 명세에 맞춰 요청
            await axios.post(`${BACKEND_URL}/api/auth/password-reset/complete`, {
                email: email,
                token: token,
                newPassword: formData.newPassword,
                newPasswordConfirm: formData.newPasswordConfirm
            });

            onNext(); // 완료 단계(4단계)로 이동
        } catch (error) {
            console.error(error);
            alert('비밀번호 재설정 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
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
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                />
            </label>

            <label className="find-password-reset-field" htmlFor="find-password-new-password-confirm">
                <i className="bi bi-lock" aria-hidden="true" />
                <input
                    id="find-password-new-password-confirm"
                    name="newPasswordConfirm"
                    type="password"
                    placeholder="새 비밀번호를 다시 입력하세요"
                    value={formData.newPasswordConfirm}
                    onChange={handleChange}
                    required
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

function FindPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');

    const nextStep = () => setStep((prev) => prev + 1);
      return (
        <main className="find-password-page">
          <AppHeader />
          <AppNav />

            <section className="find-password-shell content-container">
                <div className="find-password-panel">
                    <FindPasswordHeader currentStep={step} />

                    {/* 🎯 이 부분의 setEmail={setEmail} 정합성을 완벽하게 맞추었습니다. */}
                    {step === 1 && <EmailStep onNext={nextStep} setEmail={setEmail} />}
                    {step === 2 && <VerifyStep email={email} onNext={nextStep} setToken={setToken} />}
                    {step === 3 && <ResetStep email={email} token={token} onNext={nextStep} />}
                    {step === 4 && <CompleteStep />}
                </div>
            </section>

            <AppFeatures />
            <AppFooter />
        </main>
  );
}

export default FindPassword;
