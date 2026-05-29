import { NavLink } from 'react-router-dom';

const menuGroups = [
  {
    title: '상품 관리',
    items: [
      { label: '내가 등록한 글', href: '/mypage/posts', icon: 'bi-box' },
      { label: '관심 상품', href: '/mypage/likes', icon: 'bi-tag' }
    ],
  },
  {
    title: '내역 관리',
    items: [
      { label: '거래 내역', href: '/mypage/trades', icon: 'bi-clock' },
      { label: '나눔 내역', href: '/mypage/donations', icon: 'bi-heart' },
    ],
  },
  {
    title: '설정',
    items: [
      { label: '계정 설정', href: '/mypage/account', icon: 'bi-gear' },
    ],
  },
];

function MypageSidebar() {
  return (
    <aside className="mypage-sidebar">
      <h1>마이페이지</h1>

      <NavLink className="mypage-sidebar-profile" to="/mypage">
        <i className="bi bi-person" />
        <span>내 정보</span>
      </NavLink>

      <div className="mypage-sidebar-groups">
        {menuGroups.map((group) => (
          <section className="mypage-sidebar-group" key={group.title}>
            <h2>{group.title}</h2>
            <ul>
              {group.items.map((item) => (
                <li key={item.label}>
                  <NavLink to={item.href}>
                    <i className={`bi ${item.icon}`} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </aside>
  );
}

export default MypageSidebar;
