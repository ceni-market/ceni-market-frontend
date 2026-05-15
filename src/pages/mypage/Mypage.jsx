import { NavLink } from 'react-router-dom';
import MypageLayout from './components/MypageLayout.jsx';
import MypagePostRow from './components/MypagePostRow.jsx';
import { mypagePosts, recentTrades } from './mypageData.js';
import './Mypage.scss';

const AUTH_STORAGE_KEY = 'ceni-market-auth';
const AUTH_CHANGE_EVENT = 'ceni-market-auth-change';

const summaryItems = [
  { label: '판매한 상품', count: 8, href: '/mypage/trades' },
  { label: '관심 상품', count: 5, href: '/mypage' },
  { label: '나눔한 글', count: 3, href: '/mypage/donations' },
  { label: '나눔 받은 글', count: 2, href: '/mypage' },
];

function ProfileSummary() {
  const handleLogout = () => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  };

  return (
    <section className="mypage-profile-panel">
      <div className="mypage-profile">
        <div className="mypage-profile-avatar">
          <i className="bi bi-person-fill" />
        </div>

        <div className="mypage-profile-copy">
          <strong>
            이동규 님 <span>👋</span>
          </strong>
          <p>안녕하세요! 세니마켓에서 즐거운 거래와 나눔을 경험하세요.</p>
          <button className="mypage-logout-button" type="button" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>

      <div className="mypage-summary-list">
        {summaryItems.map((item) => (
          <NavLink className="mypage-summary-card" to={item.href} key={item.label}>
            <i className="bi bi-tag" />
            <strong>{item.count}</strong>
            <span>{item.label}</span>
            <em>자세히 보기 &gt;</em>
          </NavLink>
        ))}
      </div>
    </section>
  );
}

function MyPosts() {
  return (
    <section className="mypage-posts-panel">
      <div className="mypage-posts-tabs">
        <button className="is-active" type="button">내가 등록한 글</button>
        <button type="button">나눔한 글</button>
      </div>

      <div className="mypage-posts-list">
        {mypagePosts.map((post) => (
          <MypagePostRow item={post} key={post.id} />
        ))}
      </div>

      <NavLink className="mypage-more-link" to="/mypage/posts">
        더보기 &gt;
      </NavLink>
    </section>
  );
}

function TradeItem({ trade }) {
  return (
    <article className="mypage-trade-item">
      <img src={trade.image} alt="" />
      <div className="mypage-trade-info">
        <div className="mypage-trade-head">
          <strong>{trade.title}</strong>
          <span>{trade.date}</span>
        </div>
        <span className="mypage-trade-status">판매 완료</span>
        <div className="mypage-trade-price">
          <strong>{trade.price}</strong>
          <span>원</span>
        </div>
      </div>
    </article>
  );
}

function RecentTrades() {
  return (
    <aside className="mypage-side-column">
      <section className="mypage-trades-panel">
        <div className="mypage-panel-head">
          <h2>최근 거래 내역</h2>
          <NavLink to="/mypage/trades">더보기 &gt;</NavLink>
        </div>

        <div className="mypage-trade-list">
          {recentTrades.map((trade) => (
            <TradeItem trade={trade} key={trade.id} />
          ))}
        </div>
      </section>

      <section className="mypage-donation-banner">
        <img src="/assets/images/mypage-banner.png" alt="" />
        <div className="mypage-donation-copy">
          <strong>나눔으로 더 가까워지는 우리</strong>
          <NavLink to="/mypage/donations">나눔 게시판 바로가기 &gt;</NavLink>
        </div>
      </section>
    </aside>
  );
}

function Mypage() {
  return (
    <MypageLayout>
      <div className="mypage-content">
        <ProfileSummary />

        <div className="mypage-lower">
          <MyPosts />
          <RecentTrades />
        </div>
      </div>
    </MypageLayout>
  );
}

export default Mypage;
