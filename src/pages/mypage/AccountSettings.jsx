import MypageLayout from './components/MypageLayout.jsx';
import './Mypage.scss';

function PasswordInput({ label, placeholder, helper }) {
  return (
    <div className="mypage-account-field">
      <label>
        <span>{label}</span>
        <div className="mypage-account-input">
          <i className="bi bi-lock" />
          <input type="password" placeholder={placeholder} />
        </div>
      </label>
      {helper && <em>{helper}</em>}
    </div>
  );
}

function AccountSettings() {
  return (
    <MypageLayout variant="account">
      <section className="mypage-account">
        <h2>계정 설정</h2>

        <section className="mypage-account-card mypage-profile-photo-card">
          <h3>프로필 사진 변경</h3>
          <div className="mypage-profile-photo">
            <div className="mypage-profile-photo-preview">
              <i className="bi bi-person-fill" />
            </div>
            <button type="button">
              <i className="bi bi-image" />
              <span>프로필 사진 변경</span>
            </button>
            <p>JPG, PNG 파일 (최대 2MB)</p>
          </div>
        </section>

        <section className="mypage-account-card mypage-password-card">
          <h3>비밀번호 변경</h3>
          <div className="mypage-password-form">
            <PasswordInput label="현재 비밀번호" placeholder="현재 비밀번호를 입력하세요" />
            <PasswordInput
              label="새 비밀번호"
              placeholder="새 비밀번호를 입력하세요"
              helper="영문, 숫자, 특수문자 포함 8~16자"
            />
            <PasswordInput label="새 비밀번호 확인" placeholder="새 비밀번호를 다시 입력하세요" />
          </div>
          <button className="mypage-password-submit" type="button">비밀번호 변경</button>
        </section>

        <section className="mypage-account-card mypage-withdraw-card">
          <h3>회원 탈퇴</h3>
          <p>
            <span>세니마켓 회원 탈퇴를 진행합니다.</span>
            <span>탈퇴 시 모든 데이터가 삭제되며, 복구할 수 없습니다.</span>
          </p>
          <button type="button">회원 탈퇴하기</button>
        </section>
      </section>
    </MypageLayout>
  );
}

export default AccountSettings;
