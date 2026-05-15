import { NavLink } from 'react-router-dom';
import './HomePopular.scss';

const POPULAR_PRODUCTS = [
  {
    title: '맥북 에어 M1 13인치',
    category: 'ITㆍ디지털',
    price: '650,000원',
    time: '2시간 전',
    likes: 12,
  },
  {
    title: '맥북 에어 M1 13인치',
    category: 'ITㆍ디지털',
    price: '650,000원',
    time: '2시간 전',
    likes: 12,
  },
  {
    title: '맥북 에어 M1 13인치',
    category: 'ITㆍ디지털',
    price: '650,000원',
    time: '2시간 전',
    likes: 12,
  },
  {
    title: '맥북 에어 M1 13인치',
    category: 'ITㆍ디지털',
    price: '650,000원',
    time: '2시간 전',
    likes: 12,
  },
  {
    title: '맥북 에어 M1 13인치',
    category: 'ITㆍ디지털',
    price: '650,000원',
    time: '2시간 전',
    likes: 12,
  },
  {
    title: '맥북 에어 M1 13인치',
    category: 'ITㆍ디지털',
    price: '650,000원',
    time: '2시간 전',
    likes: 12,
  },
];

function HomePopular() {
  return (
    <section className="home-popular" data-node-id="425:2079">
      <div className="home-popular-inner content-container">
        <div className="home-popular-header" data-node-id="425:2160">
          <h2 className="home-popular-title">지금 인기 있는 상품</h2>
          <NavLink className="home-popular-more" to="/products">
            더 보기 &gt;
          </NavLink>
        </div>

        <div className="home-popular-list" data-node-id="425:2081">
          {POPULAR_PRODUCTS.map((product, index) => (
            <NavLink className="home-popular-card" to="/products/1" key={`${product.title}-${index}`}>
              <div className="home-popular-thumb">
                <img
                  className="home-popular-thumb-image"
                  src="/assets/images/popular-sample.jpeg"
                  alt=""
                />
                <span className="home-popular-like">
                  <i className="home-popular-like-icon bi bi-heart" aria-hidden="true" />
                  <span className="home-popular-like-count">{product.likes}</span>
                </span>
              </div>

              <div className="home-popular-info">
                <strong className="home-popular-card-title">{product.title}</strong>
                <span className="home-popular-category">{product.category}</span>
                <span className="home-popular-meta">
                  <span className="home-popular-price">{product.price}</span>
                  <span className="home-popular-time">{product.time}</span>
                </span>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomePopular;
