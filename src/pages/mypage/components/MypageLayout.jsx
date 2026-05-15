import AppFeatures from '../../../widgets/app-features/AppFeatures.jsx';
import AppFooter from '../../../widgets/app-footer/AppFooter.jsx';
import AppHeader from '../../../widgets/app-header/AppHeader.jsx';
import AppNav from '../../../widgets/app-nav/AppNav.jsx';
import MypageSidebar from './MypageSidebar.jsx';

function MypageLayout({ children, variant = 'default' }) {
  return (
    <main className={`mypage mypage-${variant}-page`}>
      <AppHeader />
      <AppNav />

      <section className="mypage-body content-container">
        <MypageSidebar />
        {children}
      </section>

      <AppFeatures />
      <AppFooter />
    </main>
  );
}

export default MypageLayout;
