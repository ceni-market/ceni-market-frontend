import { NavLink } from 'react-router-dom';
import './HomeVisual.scss';

const QUICK_ITEMS = [
  { label: '전체보기', icon: 'bi-grid', href: '/products' },
  { label: '나눔게시판', icon: 'bi-heart', href: '/' },
  { label: '인기매물', icon: 'bi-fire', href: '/' },
  { label: '최근 등록', icon: 'bi-clock', href: '/' },
  { label: '거래 가이드', icon: 'bi-book', href: '/' },
  { label: '이용 안내', icon: 'bi-info-circle', href: '/' },
];

function HomeVisual() {
  return (
    <section className="home-visual" data-node-id="425:2164">
      <div className="home-visual-inner content-container">
        <NavLink className="home-visual-banner" to="/" aria-label="세니마켓 안내 배너">
          <img className="home-visual-banner-image" src="/assets/images/visual-banner.png" alt="" />
        </NavLink>

        <nav className="home-visual-quick" aria-label="빠른 메뉴">
          {QUICK_ITEMS.map((item) => (
            <NavLink className="home-visual-quick-item" to={item.href} key={item.label}>
              <i className={`home-visual-quick-icon bi ${item.icon}`} aria-hidden="true" />
              <span className="home-visual-quick-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </section>
  );
}

export default HomeVisual;
