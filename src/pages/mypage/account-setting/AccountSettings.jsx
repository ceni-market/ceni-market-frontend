import MypageLayout from '../components/MypageLayout.jsx';
import '../Mypage.scss';
import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';

function PasswordInput({ label, placeholder, helper, value, onChange, name }) {
  return (
    <div className="mypage-account-field">
      <label>
        <span>{label}</span>
        <div className="mypage-account-input">
          <i className="bi bi-lock" />
          <input
              type="password"
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              name={name}
          />
        </div>
      </label>
      {helper && <em>{helper}</em>}
    </div>
  );
}

function AccountSettings() {

  const getToken = () => {
    // 먼저 localStorage 확인, 없으면 sessionStorage 확인
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  };

  const token = getToken();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const BACKEND_URL = import.meta.env.VITE_APP_API_URL;

  const handlePasswordUpdate = async () => {
    if (formData.newPassword !== formData.newPasswordConfirm) {
      return alert('새 비밀번호가 일치하지 않습니다.');
    }

    try {
      await axios.post(`${BACKEND_URL}/api/user/password/update`, formData,
          {
            headers: {
              'Authorization': `Bearer ${token}` // 💡 핵심: 헤더에 토큰 포함
            }
          }
      );
      alert('비밀번호가 성공적으로 변경되었습니다.');
      setFormData({ currentPassword: '', newPassword: '', newPasswordConfirm: '' });
    } catch (error) {
      alert(error.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    }
  };

  const [profileImageUrl, setProfileImageUrl] = useState('');

  useEffect(() => {
    const fetchMyPageInfo = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/mypage/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // 서버 응답 구조(ApiResponse)에 맞춰 data 접근
        const userInfo = response.data.data;
        setProfileImageUrl(userInfo.profileImageUrl);
      } catch (error) {
        console.error("사용자 정보를 불러오는데 실패했습니다.", error);
      }
    };

    if (token) {
      fetchMyPageInfo();
    }
  }, [BACKEND_URL, token]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileFormData = new FormData();
    fileFormData.append('file', file);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/user/imageUpdate`, fileFormData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // 💡 서버에서 받은 응답(imageUrls)을 처리
      const newImageUrl = response.data.imageUrls[0];
      alert('프로필 사진이 변경되었습니다.');

      // 상태 업데이트를 통해 화면 프리뷰 즉시 갱신
      setProfileImageUrl(newImageUrl);
    } catch (error) {
      alert('이미지 업로드에 실패했습니다.');
    }
  };
  const fileInputRef = useRef(null);

  const handleWithdraw = async () => {
    const password= prompt('회원 탈퇴를 위해 비밀번호를 입력해주세요.');
    if(!password) return;

    if(!confirm('절말 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.')) return;

    try {
      // 2. 서버에 탈퇴 요청
      await axios.post(`${BACKEND_URL}/api/user/withdraw`,
          { password }, // 비밀번호 DTO 전달
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
      );

      // 3. 로컬 저장소 토큰 삭제
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');

      alert('탈퇴가 완료되었습니다.');
      window.location.href = '/'; // 메인 페이지로 이동
    } catch (error) {
      alert(error.response?.data?.message || '탈퇴 처리에 실패했습니다. 비밀번호를 확인해주세요.');
    }
  };



  return (
    <MypageLayout variant="account">
      <section className="mypage-account">
        <h2>계정 설정</h2>

        <section className="mypage-account-card mypage-profile-photo-card">
          <h3>프로필 사진 변경</h3>
          <div className="mypage-profile-photo">
            <div className="mypage-profile-photo-preview">
              {profileImageUrl ? (
                  <img src={profileImageUrl} alt="프로필" style={{width: '100%', height: '100%', borderRadius: '50%'}} />
              ) : (
                  <i className="bi bi-person-fill" />
              )}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="image/jpg, image/png"
            />
            <button type="button" onClick={() => fileInputRef.current.click()}>
              <i className="bi bi-image" />
              <span>프로필 사진 변경</span>
            </button>
            <p>JPG, PNG 파일 (최대 2MB)</p>
          </div>
        </section>

        <section className="mypage-account-card mypage-password-card">
          <h3>비밀번호 변경</h3>
          <div className="mypage-password-form">
            <PasswordInput name="currentPassword"
                           label="현재 비밀번호"
                           placeholder="현재 비밀번호를 입력하세요"
                           value={formData.currentPassword}
                           onChange={handleChange} />
            <PasswordInput name="newPassword"
                           label="새 비밀번호"
                           placeholder="새 비밀번호를 입력하세요"
                           helper="영문, 숫자, 특수문자 포함 8~16자"
                           value={formData.newPassword}
                           onChange={handleChange} />
            <PasswordInput name="newPasswordConfirm"
                           label="새 비밀번호 확인"
                           placeholder="새 비밀번호를 다시 입력하세요"
                           value={formData.newPasswordConfirm}
                           onChange={handleChange} />
          </div>
          <button className="mypage-password-submit" type="button" onClick={handlePasswordUpdate}>비밀번호 변경</button>
        </section>

        <section className="mypage-account-card mypage-withdraw-card">
          <h3>회원 탈퇴</h3>
          <p>
            <span>세니마켓 회원 탈퇴를 진행합니다.</span>
            <span>탈퇴 시 모든 데이터가 삭제되며, 복구할 수 없습니다.</span>
          </p>
          <button type="button" onClick={handleWithdraw}>회원 탈퇴하기</button>
        </section>
      </section>
    </MypageLayout>
  );
}

export default AccountSettings;
