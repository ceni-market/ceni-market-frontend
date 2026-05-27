import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ChatModal from '../chat-modal/ChatModal.jsx';
import './AppHeader.scss';
import {useAuthStore} from "../../store/authStore.js";

const AUTH_STORAGE_KEY = 'ceni-market-auth';
const AUTH_CHANGE_EVENT = 'ceni-market-auth-change';

const NAV_ACTIONS = [
  {
    label: '로그인',
    icon: 'bi-person',
    className: 'site-header-button site-header-button-ghost',
    href: '/login',
  },
  {
    label: '회원가입',
    icon: 'bi-person-add',
    className: 'site-header-button site-header-button-primary',
    href: '/signup',
  },
];

const LOGGED_IN_ACTIONS = [
  {
    label: '채팅',
    icon: 'bi-chat-dots',
    className: 'site-header-menu-button site-header-menu-button-active',
    action: 'chat',
  },
  {
    label: '마이페이지',
    icon: 'bi-person',
    className: 'site-header-menu-button',
    href: '/mypage',
  },
  {
    label: '글쓰기',
    icon: 'bi-pencil',
    className: 'site-header-write-button',
    href: '/posts/new',
  },
];

function AppHeader() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const isLoggedIn = !!accessToken;

  const actions = isLoggedIn ? LOGGED_IN_ACTIONS : NAV_ACTIONS;

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner content-container">
          <Link className="site-header-brand" to="/">
            <span className="site-header-logo">
              <img className="site-header-logo-image" src="/assets/images/logo.png" alt="ITCEN" />
            </span>
            <span className="site-header-title">세니마켓</span>
          </Link>

          <form className="site-header-search" role="search">
            <label className="sr-only" htmlFor="site-search">
              상품 검색
            </label>
            <input
              className="site-header-search-input"
              id="site-search"
              type="search"
              placeholder="상품명, 키워드로 검색해보세요"
            />
            <button className="site-header-search-button" type="submit">
              <i className="site-header-search-icon bi bi-search" aria-hidden="true" />
            </button>
          </form>

          <nav className={`site-header-actions${isLoggedIn ? ' site-header-actions-logged-in' : ''}`}>
            {actions.map((action) =>
              action.action === 'chat' ? (
                <button
                  className={action.className}
                  type="button"
                  key={action.label}
                  onClick={() => setIsChatOpen(true)}
                >
                  <i className={`site-header-button-icon bi ${action.icon}`} aria-hidden="true" />
                  <span className="site-header-button-label">{action.label}</span>
                </button>
              ) : (
                <NavLink className={action.className} to={action.href} key={action.label}>
                  <i className={`site-header-button-icon bi ${action.icon}`} aria-hidden="true" />
                  <span className="site-header-button-label">{action.label}</span>
                </NavLink>
              ),
            )}
          </nav>
        </div>
      </header>

      {isChatOpen && <ChatModal onClose={() => setIsChatOpen(false)} />}
    </>
  );
}

export default AppHeader;
