import { NavLink } from 'react-router-dom';
import './AppNav.scss';

const NAV_ITEMS = [
  { label: '전체', href: '/products' },
  { label: 'ITㆍ디지털', href: '/' },
  { label: '가전제품', href: '/' },
  { label: '가구ㆍ인테리어', href: '/' },
  { label: '생활ㆍ주방', href: '/' },
  { label: '스포츠ㆍ취미', href: '/' },
  { label: '도서ㆍ음반', href: '/' },
  { label: '유아ㆍ기타', href: '/' },
];

function AppNav() {
  return (
    <nav className="app-nav" aria-label="상품 카테고리" data-node-id="66:185">
      <div className="app-nav-inner content-container">
        <NavLink className="app-nav-home" to="/" aria-label="홈">
          <i className="app-nav-home-icon bi bi-house" aria-hidden="true" />
        </NavLink>

        {NAV_ITEMS.map((item) => (
          <NavLink className="app-nav-link" to={item.href} key={item.label}>
            {item.label}
          </NavLink>
        ))}

        <NavLink className="app-nav-donation" to="/donations">
          <i className="app-nav-donation-icon bi bi-heart-fill" aria-hidden="true" />
          <span className="app-nav-donation-label">나눔게시판</span>
        </NavLink>
      </div>
    </nav>
  );
}

export default AppNav;
