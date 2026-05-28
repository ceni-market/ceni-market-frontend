import AppFeatures from '../../../widgets/app-features/AppFeatures.jsx';
import AppFooter from '../../../widgets/app-footer/AppFooter.jsx';
import AppHeader from '../../../widgets/app-header/AppHeader.jsx';
import AppNav from '../../../widgets/app-nav/AppNav.jsx';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.scss';
import React, { useState } from 'react';
import { useSignUpMutation } from '../../../hooks/useSignUpMutation';
import { useSendVerificationEmailMutation } from '../../../hooks/useSendVerificationEmailMutation';

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

function SignupField({ id, label, type = 'text', placeholder, icon, help, value, onChange, error }) {
  return (
    <label className="signup-field" htmlFor={id}>
      <span className="signup-field-label">{label}</span>
      <span className="signup-field-control" style={error ? { borderColor: '#dc3545' } : {}}>
        <i className={`signup-field-icon bi ${icon}`} aria-hidden="true" />
        <input
            id={id}
            name={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required
        />
      </span>
      {error ? (
          <span className="signup-field-help" style={{ color: '#dc3545', fontWeight: '500' }}>{error}</span>
      ) : help ? (
          <span className="signup-field-help">{help}</span>
      ) : null}
    </label>
  );
}

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // 프론트엔드 자체 유효성 체크 에러 상태
  const [validationErrors, setValidationErrors] = useState({});

  // 💡 3. 이미 구현된 백엔드 API를 호출할 리액트 쿼리 Mutation 커스텀 훅 연결
  const { mutate, isPending, error: serverError } = useSendVerificationEmailMutation();

  const handleSubmit = (event) => {
    event.preventDefault();
    const errors = {};

    // 비밀번호 정규식 검증 (영문, 숫자, 특수문자 포함 8~16자)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
    if (!passwordRegex.test(password)) {
      errors.password = '비밀번호는 영문, 숫자, 특수문자를 포함한 8~16자여야 합니다.';
    }

    if (name.trim().length < 2) {
      errors.name = '이름을 정확히 입력해주세요.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});

    // 백엔드로 이메일 인증 발송 요청
    mutate(email, {
      onSuccess: () => {
        // 메일 발송 성공 시 사용자가 입력했던 정보들을 들고 다음 확인 페이지로 이동시킵니다.
        // (가입을 마칠 때 이 정보들을 한 번에 백엔드로 다시 던지기 위함)
        navigate('/email-confirm', { state: { email, password, name } });
      }
    });
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <SignupField
                id="signup-password"
                label="비밀번호"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                icon="bi-lock"
                help="영문, 숫자, 특수문자 포함 8~16자"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={validationErrors.password}
              />
              <SignupField
                id="signup-name"
                label="이름"
                placeholder="이름을 입력해주세요"
                icon="bi-person"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={validationErrors.name}
              />


              {/* 🚨 5. 중복된 이메일 등 백엔드 BusinessException 예외 발생 시 가시적인 얼럿창 출력 */}
              {serverError && (
                  <div className="signup-server-error" style={{ color: '#dc3545', fontSize: '13px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="bi bi-exclamation-circle-fill"></i>
                    <span>{serverError.response?.data?.message || '이미 가입된 이메일이거나 사용할 수 없는 계정 정보입니다.'}</span>
                  </div>
              )}

              {/* API 전송 중 연타 및 중복 클릭(Double Submit) 방지 처리 */}
              <button className="signup-submit" type="submit" disabled={isPending}>
                {isPending ? '인증 메일 전송 중...' : '이메일 인증하기'}
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
