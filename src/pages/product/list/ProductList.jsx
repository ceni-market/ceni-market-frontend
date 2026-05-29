import { NavLink } from 'react-router-dom';
import AppFeatures from '../../../widgets/app-features/AppFeatures.jsx';
import AppFooter from '../../../widgets/app-footer/AppFooter.jsx';
import AppHeader from '../../../widgets/app-header/AppHeader.jsx';
import AppNav from '../../../widgets/app-nav/AppNav.jsx';
import './ProductList.scss';
import {useState, useEffect} from "react";
import {apiClient} from "../../../api/apiClient.js";

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
const PAGE_SIZE = 10;

// createdAt을 "방금 전", "3시간 전"처럼 목록용 상대 시간으로 변환
function formatRelativeTime(dateText) {
  const date = new Date(dateText);
  const now = new Date();
  const diffMs = now - date;
  const diffMinutes = Math.floor(diffMs / 1000 / 60);

  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}일 전`;
}

// 목록에서 상품 하나를 카드 형태로 보여주는 컴포넌트
function ProductCard({ product }) {
  return (
    <NavLink className="product-list-card" to={`/products/${product.id}`}>
      <div className="product-list-card-thumb">
        <img src={product.image?.imageUrl || '/assets/images/product-default-img.png'} alt="" />
        <span className="product-list-card-like">
          <i className="bi bi-heart" />
          <span>{product.likeCount}</span>
        </span>
      </div>

      <div className="product-list-card-info">
        <strong>{product.title}</strong>
        <span className="product-list-card-category">{product.category?.name}</span>
        <span className="product-list-card-meta">
          <span className="product-list-card-price">
            {product.type === 'GIVEAWAY' ? '나눔' : `${product.price?.toLocaleString()}원`}
          </span>
          <span className="product-list-card-time">{formatRelativeTime(product.createdAt)}</span>
        </span>
      </div>
    </NavLink>
  );
}

function ProductList() {
  // 백엔드에서 받아온 상품 목록
  const [products, setProducts] = useState([]);
  // 페이지 상단에 보여줄 전체 상품 개수
  const [totalCount, setTotalCount] = useState(0);
  // 상품 목록 조회 실패 시 화면에 보여줄 메시지
  const [errorMessage, setErrorMessage] = useState('');
  // 페이징 처리를 위한 변수들
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_GROUP_SIZE = 5;
  const currentGroup = Math.floor(currentPage / PAGE_GROUP_SIZE);
  const startPage = currentGroup * PAGE_GROUP_SIZE;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE, totalPages);
  const hasPrevGroup = startPage > 0;
  const hasNextGroup = endPage < totalPages;

  // 상품 목록 페이지가 처음 열릴 때 상품 목록을 한 번 조회
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/listings',{
          params: {
            page: currentPage,
            size: PAGE_SIZE,
          },
        });
        // ApiResponse.data 안의 Page.content가 실제 상품 배열
        setProducts(response.data.data.content);
        // totalElements는 전체 상품 개수
        setTotalCount(response.data.data.totalElements);
        // totalPages는 전체 페이지 개수
        setTotalPages(response.data.data.totalPages);
      } catch (error) {
        console.error('상품 목록 조회 실패', error);
        setErrorMessage('상품 목록을 불러오지 못했습니다.');
      }
    };
    fetchProducts();
  }, [currentPage]);

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
              전체 <strong>{totalCount}</strong> 건
            </h2>
            <button className="product-list-sort" type="button">
              <span>최신 등록순</span>
              <i className="bi bi-chevron-down" />
            </button>
          </div>

          <div className="product-list-grid">
            {/* 에러, 빈 목록, 정상 목록 상태를 나눠서 렌더링 */}
            {errorMessage ? (
                <p>{errorMessage}</p>
            ) : products.length === 0 ? (
                <p>등록된 상품이 없습니다.</p>
            ) : (
                products.map((product) => (
                    <ProductCard product={product} key={product.id} />
                ))
            )}
          </div>
          {/* 페이지네이션 */}
          {totalPages > 1 && (
              <div className="product-list-pagination">
                <button
                    className="product-list-page-control"
                    type="button"
                    disabled={!hasPrevGroup}
                    onClick={() => setCurrentPage(startPage - PAGE_GROUP_SIZE)}
                    aria-label="이전 페이지 그룹"
                >
                  <i className="bi bi-chevron-left" />
                </button>

                {Array.from({ length: endPage - startPage }, (_, index) => {
                  const pageNumber = startPage + index;

                  return (
                      <button
                          type="button"
                          key={pageNumber}
                          className={currentPage === pageNumber ? 'product-list-page-number active' : 'product-list-page-number'}
                          onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber + 1}
                      </button>
                  );
                })}

                <button
                    className="product-list-page-control"
                    type="button"
                    disabled={!hasNextGroup}
                    onClick={() => setCurrentPage(endPage)}
                    aria-label="다음 페이지 그룹"
                >
                  <i className="bi bi-chevron-right" />
                </button>
              </div>
          )}
        </section>
      </section>

      <AppFeatures />
      <AppFooter />
    </main>
  );
}

export default ProductList;
