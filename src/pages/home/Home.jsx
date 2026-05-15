import AppFeatures from '../../widgets/app-features/AppFeatures.jsx';
import AppFooter from '../../widgets/app-footer/AppFooter.jsx';
import AppHeader from '../../widgets/app-header/AppHeader.jsx';
import AppNav from '../../widgets/app-nav/AppNav.jsx';
import HomePopular from './sections/home-popular/HomePopular.jsx';
import HomeSub from './sections/home-sub/HomeSub.jsx';
import HomeVisual from './sections/home-visual/HomeVisual.jsx';

function Home() {
  return (
    <main>
      <AppHeader />
      <AppNav />
      <HomeVisual />
      <HomePopular />
      <HomeSub />
      <AppFeatures />
      <AppFooter />
    </main>
  );
}

export default Home;
