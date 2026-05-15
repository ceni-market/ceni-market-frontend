import { NavLink } from 'react-router-dom';
import AppFeatures from '../../../widgets/app-features/AppFeatures.jsx';
import AppFooter from '../../../widgets/app-footer/AppFooter.jsx';
import AppHeader from '../../../widgets/app-header/AppHeader.jsx';
import AppNav from '../../../widgets/app-nav/AppNav.jsx';
import './ProductList.scss';

const CATEGORIES = [
  '전체',
  'ITㆍ디지털',
  '가전제품',
  '가구ㆍ인테리어',
  '생활ㆍ주방',
  '스포츠ㆍ취미',
  '도서ㆍ음반',
  '유아ㆍ기타',
];

const PRICE_FILTERS = ['1만원 이하', '1~5만원', '5~10만원', '10만원 이상'];

const PRODUCTS = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  title: '맥북 에어 M1 13인치',
  category: 'ITㆍ디지털',
  price: '650,000원',
  time: '2시간 전',
  likes: 12,
  image: '/assets/images/popular-sample.jpeg',
}));

function ProductCard({ product }) {
  return (
    <NavLink className="product-list-card" to={`/products/${product.id}`}>
      <div className="product-list-card-thumb">
        <img src={product.image} alt="" />
        <span className="product-list-card-like">
          <i className="bi bi-heart" />
          <span>{product.likes}</span>
        </span>
      </div>

      <div className="product-list-card-info">
        <strong>{product.title}</strong>
        <span className="product-list-card-category">{product.category}</span>
        <span className="product-list-card-meta">
          <span className="product-list-card-price">{product.price}</span>
          <span className="product-list-card-time">{product.time}</span>
        </span>
      </div>
    </NavLink>
  );
}

function ProductList() {
  return (
    <main className="product-list-page">
      <AppHeader />
      <AppNav />

      <section className="product-list-banner content-container">
        <h1>전체 상품</h1>
        <p>세니마켓의 모든 물품을 한눈에 확인하세요!</p>
      </section>

      <section className="product-list-body content-container">
        <aside className="product-list-sidebar">
          <div className="product-list-filter product-list-category-filter">
            <h2>카테고리</h2>
            <ul>
              {CATEGORIES.map((category) => (
                <li key={category}>
                  <button type="button">
                    <i className="bi bi-tag" />
                    <span>{category}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="product-list-filter product-list-price-filter">
            <h2>가격대</h2>
            <div className="product-list-price-inputs">
              <label className="product-list-min-price">
                <input type="text" />
                <span>원</span>
              </label>
              <div className="product-list-price-to">~</div>
              <label className="product-list-max-price">
                <input type="text" />
                <span>원</span>
              </label>
            </div>
            <div className="product-list-price-tags">
              {PRICE_FILTERS.map((filter) => (
                <button type="button" key={filter}>
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="product-list-panel">
          <div className="product-list-toolbar">
            <h2>
              전체 <strong>1,248</strong> 건
            </h2>
            <button className="product-list-sort" type="button">
              <span>최신 등록순</span>
              <i className="bi bi-chevron-down" />
            </button>
          </div>

          <div className="product-list-grid">
            {PRODUCTS.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </section>
      </section>

      <AppFeatures />
      <AppFooter />
    </main>
  );
}

export default ProductList;
