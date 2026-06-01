import { NavLink, useSearchParams } from 'react-router-dom';
import AppFeatures from '../../../widgets/app-features/AppFeatures.jsx';
import AppFooter from '../../../widgets/app-footer/AppFooter.jsx';
import AppHeader from '../../../widgets/app-header/AppHeader.jsx';
import AppNav from '../../../widgets/app-nav/AppNav.jsx';
import './ProductList.scss';
import {useState, useEffect} from "react";
import {apiClient} from "../../../api/apiClient.js";

const CATEGORIES = [
  { name: '전체', id: null },
  { name: 'ITㆍ디지털', id: 1 },
  { name: '가전제품', id: 2 },
  { name: '가구ㆍ인테리어', id: 3 },
  { name: '생활ㆍ주방', id: 4 },
  { name: '스포츠ㆍ취미', id: 5 },
  { name: '도서ㆍ음반', id: 6 },
  { name: '유아ㆍ기타', id: 7 },
];

const DEFAULT_SORT = 'createdAt,desc';
const SORT_OPTIONS = [
  { label: '최신 등록순', value: DEFAULT_SORT },
  { label: '낮은 가격순', value: 'price,asc' },
  { label: '높은 가격순', value: 'price,desc' },
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
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query를 목록 조회 조건으로 사용한다.
  const currentPage = searchParams.get('page')
      ? Number(searchParams.get('page'))
      : 0;
  const selectedCategoryId = searchParams.get('categoryId')
      ? Number(searchParams.get('categoryId'))
      : null;
  const currentSort = searchParams.get('sort') || DEFAULT_SORT;

  // 서버 응답 데이터
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // 페이지 버튼을 5개씩 묶어서 보여주기 위한 계산값
  const PAGE_GROUP_SIZE = 5;
  const currentGroup = Math.floor(currentPage / PAGE_GROUP_SIZE);
  const startPage = currentGroup * PAGE_GROUP_SIZE;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE, totalPages);
  const hasPrevGroup = startPage > 0;
  const hasNextGroup = endPage < totalPages;

  // 카테고리를 바꾸면 첫 페이지부터 다시 조회한다.
  const handleCategoryClick = (categoryId) => {
    const nextParams = new URLSearchParams(searchParams);

    if (categoryId) {
      nextParams.set('categoryId', String(categoryId));
    } else {
      nextParams.delete('categoryId');
    }

    nextParams.set('page', '0');
    setSearchParams(nextParams);
  };

  // 페이지 이동도 URL query에 저장해서 뒤로가기/새로고침 시 유지한다.
  const handlePageClick = (pageNumber) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(pageNumber));
    setSearchParams(nextParams);
  };

  const handleSortChange = (event) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('sort', event.target.value);
    nextParams.set('page', '0');
    setSearchParams(nextParams);
  };

  // URL query 조건이 바뀔 때마다 상품 목록을 다시 조회한다.
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/listings',{
          params: {
            page: currentPage,
            size: PAGE_SIZE,
            sort: currentSort,
            type: 'SALE',
            ...(selectedCategoryId && { categoryId: selectedCategoryId }),
          },
        });
        setProducts(response.data.data.content);
        setTotalCount(response.data.data.totalElements);
        setTotalPages(response.data.data.totalPages);
      } catch (error) {
        console.error('상품 목록 조회 실패', error);
        setErrorMessage('상품 목록을 불러오지 못했습니다.');
      }
    };
    fetchProducts();
  }, [currentPage, selectedCategoryId, currentSort]);

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
                  <li key={category.name}>
                    <button
                        type="button"
                        onClick={() => handleCategoryClick(category.id)}
                        className={selectedCategoryId === category.id ? 'active' : ''}
                    >
                      <i className="bi bi-tag" />
                      <span>{category.name}</span>
                    </button>
                  </li>
              ))}
            </ul>
          </div>

          {/*<div className="product-list-filter product-list-price-filter">*/}
          {/*  <h2>가격대</h2>*/}
          {/*  <div className="product-list-price-inputs">*/}
          {/*    <label className="product-list-min-price">*/}
          {/*      <input type="text" />*/}
          {/*      <span>원</span>*/}
          {/*    </label>*/}
          {/*    <div className="product-list-price-to">~</div>*/}
          {/*    <label className="product-list-max-price">*/}
          {/*      <input type="text" />*/}
          {/*      <span>원</span>*/}
          {/*    </label>*/}
          {/*  </div>*/}
          {/*  <div className="product-list-price-tags">*/}
          {/*    {PRICE_FILTERS.map((filter) => (*/}
          {/*      <button type="button" key={filter}>*/}
          {/*        {filter}*/}
          {/*      </button>*/}
          {/*    ))}*/}
          {/*  </div>*/}
          {/*</div>*/}
        </aside>

        <section className="product-list-panel">
          <div className="product-list-toolbar">
            <h2>
              전체 <strong>{totalCount}</strong> 건
            </h2>
            <label className="product-list-sort">
              <select value={currentSort} onChange={handleSortChange} aria-label="상품 정렬">
                {SORT_OPTIONS.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <i className="bi bi-chevron-down" aria-hidden="true" />
            </label>
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
                    onClick={() => handlePageClick(startPage - PAGE_GROUP_SIZE)}
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
                          onClick={() => handlePageClick(pageNumber)}
                      >
                        {pageNumber + 1}
                      </button>
                  );
                })}

                <button
                    className="product-list-page-control"
                    type="button"
                    disabled={!hasNextGroup}
                    onClick={() => handlePageClick(endPage)}
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
