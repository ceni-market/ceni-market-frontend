import MypageLayout from '../components/MypageLayout.jsx';
import '../Mypage.scss';
import React, { useState } from 'react';
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
          <button type="button">회원 탈퇴하기</button>
        </section>
      </section>
    </MypageLayout>
  );
}

export default AccountSettings;
