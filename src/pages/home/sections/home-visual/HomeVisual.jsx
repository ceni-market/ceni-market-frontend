import { NavLink } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './HomeVisual.scss';

const BANNERS = [
  { image: '/assets/images/banner-list.png', alt: '세니마켓 상품 목록 안내 배너', href: '/products' },
  { image: '/assets/images/banner-donation.png', alt: '세니마켓 나눔 안내 배너', href: '/donations' },
];

function HomeVisual() {
  return (
    <section className="home-visual" data-node-id="425:2164">
      <div className="home-visual-inner content-container">
        <Swiper
          className="home-visual-banner"
          loop
          pagination
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Pagination]}
        >
          {BANNERS.map((banner) => (
            <SwiperSlide key={banner.image}>
              <NavLink className="home-visual-banner-link" to={banner.href}>
                <img className="home-visual-banner-image" src={banner.image} alt={banner.alt} />
              </NavLink>
            </SwiperSlide>
          ))}
        </Swiper>

        {/*<nav className="home-visual-quick" aria-label="빠른 메뉴">*/}
        {/*  {QUICK_ITEMS.map((item) => (*/}
        {/*    <NavLink className="home-visual-quick-item" to={item.href} key={item.label}>*/}
        {/*      <i className={`home-visual-quick-icon bi ${item.icon}`} aria-hidden="true" />*/}
        {/*      <span className="home-visual-quick-label">{item.label}</span>*/}
        {/*    </NavLink>*/}
        {/*  ))}*/}
        {/*</nav>*/}
      </div>
    </section>
  );
}

export default HomeVisual;
