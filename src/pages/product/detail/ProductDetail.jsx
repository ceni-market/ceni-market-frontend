import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import AppFeatures from '../../../widgets/app-features/AppFeatures.jsx';
import AppFooter from '../../../widgets/app-footer/AppFooter.jsx';
import AppHeader from '../../../widgets/app-header/AppHeader.jsx';
import AppNav from '../../../widgets/app-nav/AppNav.jsx';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './ProductDetail.scss';

const PRODUCT_IMAGES = [
  '/assets/images/detail-sample-img.png',
  '/assets/images/detail-sample-img.png',
  '/assets/images/detail-sample-img.png',
  '/assets/images/detail-sample-img.png',
];

const PRODUCT_DETAIL = {
  title: '맥북 에어 M1 13인치',
  price: '650,000',
  category: 'ITㆍ디지털',
  createdAt: '2026.05.06',
  views: 115,
  likes: 12,
  description:
    '2021년에 구매한 맥북 에어 M1 13인치 모델입니다. 사용감은 약간 있지만 전체적으로 깨끗한 편이고 성능 문제 전혀 없습니다. 구성품은 충전기, 케이블 포함입니다.',
};

function ProductGallery() {
  return (
    <div className="product-detail-gallery">
      <Swiper
        className="product-detail-gallery-main"
        cssMode
        navigation
        pagination
        mousewheel
        keyboard
        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
      >
        {PRODUCT_IMAGES.map((image, index) => (
          <SwiperSlide key={`${image}-${index}`}>
            <img src={image} alt={`${PRODUCT_DETAIL.title} 상품 이미지 ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="product-detail-info-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function ProductDetail() {
  return (
    <main className="product-detail-page">
      <AppHeader />
      <AppNav />

      <section className="product-detail-banner content-container" data-node-id="456:2058">
        <h1>나눔은 마음을 이어줍니다</h1>
        <img src="/assets/images/detail-banner-img.png" alt="" />
      </section>

      <section className="product-detail-body content-container" data-node-id="456:1999">
        <div className="product-detail-breadcrumb">홈 &gt; 전체 &gt; ITㆍ디지털</div>

        <div className="product-detail-layout">
          <article className="product-detail-card" data-node-id="456:2020">
            <ProductGallery />

            <section className="product-detail-info" aria-label="상품 정보" data-node-id="456:2022">
              <h2>{PRODUCT_DETAIL.title}</h2>
              <p className="product-detail-price">
                <strong>{PRODUCT_DETAIL.price}</strong>
                <span>원</span>
              </p>

              <dl className="product-detail-meta">
                <DetailRow label="카테고리" value={PRODUCT_DETAIL.category} />
                <DetailRow label="등록일" value={PRODUCT_DETAIL.createdAt} />
                <DetailRow label="조회수" value={PRODUCT_DETAIL.views} />
                <DetailRow label="관심수" value={PRODUCT_DETAIL.likes} />
              </dl>

              <div className="product-detail-description">
                <strong>상품설명</strong>
                <p>{PRODUCT_DETAIL.description}</p>
              </div>
            </section>
          </article>

          <aside className="product-detail-side" data-node-id="456:2002">
            <button className="product-detail-chat" type="button">
              <i className="bi bi-chat-dots" aria-hidden="true" />
              <span>1:1 채팅으로 문의하기</span>
            </button>
            <button className="product-detail-like" type="button">
              <i className="bi bi-heart" aria-hidden="true" />
              <span>찜하기</span>
            </button>

            <div className="product-detail-safe">
              <div className="product-detail-safe-copy">
                <span>세니마켓은</span>
                <strong>
                  ITCEN 구성원 간의 신뢰를 바탕으로
                  <br />
                  운영되는 안전한 중고거래 공간입니다.
                </strong>
                <p>
                  1:1 채팅을 통해 판매자와 직접 거래해주세요.
                  <br />
                  외부 링크, 계좌 거래 등은 주의해주세요.
                </p>
              </div>
              <img src="/assets/images/detail-right-banner.png" alt="" />
            </div>
          </aside>
        </div>
      </section>

      <AppFeatures />
      <AppFooter />
    </main>
  );
}

export default ProductDetail;
