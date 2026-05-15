import { NavLink } from 'react-router-dom';
import AppFeatures from '../../../widgets/app-features/AppFeatures.jsx';
import AppFooter from '../../../widgets/app-footer/AppFooter.jsx';
import AppHeader from '../../../widgets/app-header/AppHeader.jsx';
import AppNav from '../../../widgets/app-nav/AppNav.jsx';
import './ProductWrite.scss';

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

const TRADE_TYPES = [
  {
    value: 'sale',
    title: '판매하기',
    desc: '가격을 받고 판매해요',
    icon: 'bi-bag',
  },
  {
    value: 'donation',
    title: '나눔하기',
    desc: '필요한 분께 무료로 나눠요',
    icon: 'bi-heart',
  },
];

function TradeTypeCard({ type, checked }) {
  return (
    <label className="product-write-type">
      <input type="radio" name="tradeType" value={type.value} defaultChecked={checked} />
      <span className="product-write-type-icon">
        <i className={`bi ${type.icon}`} />
      </span>
      <span className="product-write-type-copy">
        <strong>{type.title}</strong>
        <span>{type.desc}</span>
      </span>
      <span className="product-write-type-radio" />
    </label>
  );
}

function ProductWrite() {
  return (
    <main className="product-write-page">
      <AppHeader />
      <AppNav />

      <section className="product-write content-container">
        <div className="product-write-head">
          <h1>글쓰기</h1>
          <p>세니마켓에 판매하거나 나눔할 물건을 올려보세요.</p>
        </div>

        <form className="product-write-layout">
          <section className="product-write-card product-write-main">
            <div className="product-write-field product-write-kind-field">
              <span className="product-write-label">거래 종류</span>
              <div className="product-write-type-list">
                {TRADE_TYPES.map((type) => (
                  <TradeTypeCard type={type} checked={type.value === 'sale'} key={type.value} />
                ))}
              </div>
            </div>

            <label className="product-write-field product-write-category-field">
              <span className="product-write-label">카테고리</span>
              <select defaultValue="">
                <option value="" disabled>
                  카테고리를 선택해주세요
                </option>
                {CATEGORIES.map((category) => (
                  <option value={category} key={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="product-write-field">
              <span className="product-write-label">제목</span>
              <span className="product-write-title-control">
                <input type="text" maxLength="10" placeholder="제목을 입력해주세요 (최대 10자)" />
                <span>0/10</span>
              </span>
            </label>

            <div className="product-write-field product-write-image-field">
              <span className="product-write-label">상품 이미지</span>
              <label className="product-write-dropzone">
                <input type="file" accept="image/*" multiple />
                <i className="bi bi-plus-circle" />
                <strong>사진을 추가하세요</strong>
                <span>(최대 10장, 개당 10MB 이하)</span>
                <small>드래그 앤 드롭으로 이미지를 추가할 수 있어요</small>
              </label>
            </div>

            <label className="product-write-field product-write-desc-field">
              <span className="product-write-label">상품 설명</span>
              <textarea placeholder="상품에 대해 자세히 설명해주세요." />
            </label>
          </section>

          <aside className="product-write-card product-write-side">
            <label className="product-write-price-field">
              <span className="product-write-label">가격</span>
              <input type="text" inputMode="numeric" placeholder="가격을 입력해주세요" />
            </label>

            <div className="product-write-guide">
              <i className="bi bi-heart" />
              <div>
                <strong>따뜻한 나눔과 신뢰의 거래</strong>
                <p>
                  아이티센 구성원 간의 신뢰를 바탕으로
                  <br />
                  서로에게 필요한 물건을 나누고 거래해요.
                </p>
              </div>
            </div>

            <div className="product-write-actions">
              <NavLink className="product-write-back" to="/products">
                <i className="bi bi-arrow-left" />
                <span>뒤로가기</span>
              </NavLink>
              <button className="product-write-submit" type="submit">
                등록하기
              </button>
            </div>
          </aside>
        </form>
      </section>

      <AppFeatures />
      <AppFooter />
    </main>
  );
}

export default ProductWrite;
