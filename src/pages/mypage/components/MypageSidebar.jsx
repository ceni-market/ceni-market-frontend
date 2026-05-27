import { NavLink } from 'react-router-dom';

const menuGroups = [
  {
    title: '거래 관리',
    items: [
      { label: '내가 등록한 글', href: '/mypage/posts' },
      { label: '관심 상품', href: '/mypage/likes' },
      { label: '거래 내역', href: '/mypage/trades' },
    ],
  },
  {
    title: '나눔 관리',
    items: [
      { label: '나눔한 글', href: '/mypage/donations' },
      { label: '나눔 받은 글', href: '/mypage' },
    ],
  },
  {
    title: '활동 관리',
    items: [
      { label: '찜한 게시글', href: '/mypage' },
      { label: '최근 본 상품', href: '/mypage' },
    ],
  },
  {
    title: '설정',
    items: [
      { label: '계정 설정', href: '/mypage/account' },
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
                    <i className="bi bi-tag" />
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
