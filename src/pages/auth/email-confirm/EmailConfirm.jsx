import { useEffect, useRef } from 'react'; // 🎯 useRef 추가
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AppFeatures from '../../../widgets/app-features/AppFeatures.jsx';
import AppFooter from '../../../widgets/app-footer/AppFooter.jsx';
import AppHeader from '../../../widgets/app-header/AppHeader.jsx';
import AppNav from '../../../widgets/app-nav/AppNav.jsx';
import { useSignUpMutation } from '../../../hooks/useSignupMutation.js';
import axios from 'axios'; // 🎯 주기적으로 백엔드를 찌르기 위한 axios 사용
import './EmailConfirm.scss';

function EmailConfirm() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Signup.jsx에서 라우터를 타고 넘어온 사용자의 임시 입력 데이터 추출
  const { email, password, name } = location.state || {};

  // 2. SignUpController를 호출할 리액트 쿼리 Mutation 훅 연결
  const { mutate, isPending, error: serverError } = useSignUpMutation();

  // 디펜시브 가드: 한 번 가입 API가 트리거되면 폴링이 중복 요청을 보내지 않도록 잠그는 플래그
  const isJoining = useRef(false);

  // 3. 🔄 1.5초마다 백엔드의 verified_at 상태를 직접 확인하는 폴링(Polling) 훅
  useEffect(() => {
    if (!email || !password || !name) {
      alert('가입 정보가 유실되었습니다. 처음부터 다시 가입을 진행해 주세요.');
      navigate('/signup');
      return undefined;
    }

    console.log("⏱️ [EmailConfirm] 이메일 인증 확인용 자동 폴링을 시작합니다.");

    const pollingInterval = setInterval(async () => {
      // 최종 회원가입이 이미 진행 중이라면 더 이상 백엔드를 찌르지 않고 대기
      if (isJoining.current) return;

      try {
        // 📡 백엔드에 현재 이메일의 verified_at이 채워졌는지 상태 체크 요청
        const baseUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:8088'
            : 'https://api.cenimarket.com';

        const response = await axios.get(`${baseUrl}/api/auth/signup/status?email=${email}`);

        // 백엔드에서 인증 완료 플래그(예: true)가 넘어오면 자동 회원가입 절차 가동
        if (response.data && response.data.isVerified === true) {
          console.log("✨ [EmailConfirm] 백엔드 DB의 verified_at 확인 완료! 가입을 완료합니다.");

          isJoining.current = true; // 중복 진입 차단 잠금
          clearInterval(pollingInterval); // 주기적 폴링 타이머 중단

          // 🚀 사용자가 버튼을 누르지 않아도 최종 회원가입 API 자동 호출
          mutate({ email, password, name }, {
            onSuccess: () => {
              console.log("🎉 [EmailConfirm] 가입 종결 완료! 축하 페이지로 이동합니다.");
              navigate('/signup-complete');
            },
            onError: (err) => {
              console.error("❌ [EmailConfirm] 최종 회원가입 저장 중 예외 발생:", err);
              isJoining.current = false; // 에러 발생 시 재시도할 수 있도록 잠금 해제
            }
          });
        }
      } catch (err) {
        // 아직 메일 링크를 누르지 않아 에러가 뜨는 것은 정상적인 대기 상태이므로 패스합니다.
        console.log("⏳ [EmailConfirm] 아직 인증을 대기 중입니다...");
      }
    }, 1500); // 1.5초마다 한 번씩 백엔드에 노크

    // 컴포넌트 해제(언마운트) 시 타이머를 반드시 클리어하여 메모리 누수를 방지합니다.
    return () => {
      console.log("🧹 [EmailConfirm] 폴링 타이머를 해제합니다.");
      clearInterval(pollingInterval);
    };
  }, [email, password, name, navigate, mutate]);

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
              <li>인증메일의 유효시간은 5분입니다.</li>
            </ul>
          </section>



          <div className="email-confirm-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '320px', margin: '0 auto' }}>


            <p className="email-confirm-resend" data-node-id="454:1754" style={{ marginTop: '10px' }}>
              <span>메일을 받지 못하셨나요?</span>
              <button type="button" style={{ background: 'none', border: 'none', textDecoration: 'underline', color: '#666', cursor: 'pointer' }}>
                재발송 (59초 후 가능)
              </button>
            </p>
          </div>
        </div>
      </section>

      <AppFeatures />
      <AppFooter />
    </main>
  );
}

export default EmailConfirm;
