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
import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {apiClient} from "../../../api/apiClient.js";

// 상품 이미지가 없을 때는 기본 이미지를 넣어서 Swiper가 비지 않게 처리
function ProductGallery({ product }) {
  const images = product.images?.length > 0
      ? product.images
      : [{ imageUrl: '/assets/images/product-default-img.png' }];

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
          {images.map((image, index) => (
              <SwiperSlide key={image.id || `${image.imageUrl}-${index}`}>
                <img src={image.imageUrl} alt={`${product.title} 상품 이미지 ${index + 1}`} />
              </SwiperSlide>
          ))}
        </Swiper>
      </div>
  );
}

// createdAt을 상세 화면에 맞는 yyyy.mm.dd 형식으로 변환
function formatDate(dateText) {
  const date = new Date(dateText);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
}

// 상세 정보 영역의 라벨/값 한 줄을 재사용하기 위한 컴포넌트
function DetailRow({ label, value }) {
  return (
    <div className="product-detail-info-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function ProductDetail() {
  // URL의 /products/:productId 에서 productId 값을 가져옴
  const { productId } = useParams();
  // 백엔드에서 받아온 상품 상세 데이터
  const [product, setProduct] = useState(null);
  // 상세 조회 실패 시 화면에 보여줄 메시지
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const handleDeleteClick = async () => {
      const confirmed = window.confirm('게시글을 삭제하시겠습니까?');

      if (!confirmed) {
          return;
      }

      try {
          await apiClient.delete(`/listings/${productId}`);
          alert('게시글이 삭제되었습니다.');
          navigate('/products');
      } catch (error) {
          console.error('게시글 삭제 실패', error);
          alert('게시글 삭제에 실패했습니다.');
      }
  };

  const handleLikeClick = async () => {
      try {
          const response = product.likedByMe
              ? await apiClient.delete(`/listings/${productId}/likes`)
              : await apiClient.post(`/listings/${productId}/likes`);

          const likeResult = response.data.data;

          setProduct((prevProduct) => ({
              ...prevProduct,
              likedByMe: likeResult.liked,
              likeCount: likeResult.likeCount,
          }));
      } catch (error) {
          console.error('관심 처리 실패',error);
          alert('관심 처리에 실패했습니다.');
      }
  };

  // productId가 바뀔 때마다 해당 상품 상세 정보를 조회
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await apiClient.get(`/listings/${productId}`);
        setProduct(response.data.data);
      } catch (error) {
        console.error('상품 상세 조회 실패', error);
        setErrorMessage('상품 정보를 불러오지 못했습니다.');
      }
    };

    fetchProductDetails();
  }, [productId]);

  // 에러가 있으면 상세 화면 대신 에러 메시지 표시
  if (errorMessage) {
    return (
        <main className="product-detail-page">
          <AppHeader />
          <AppNav />
          <section className="product-detail-body content-container">
            <p>{errorMessage}</p>
          </section>
          <AppFooter />
        </main>
    );
  }
  // 아직 API 응답이 오기 전에는 로딩 메시지 표시
  if (!product) {
    return (
        <main className="product-detail-page">
          <AppHeader />
          <AppNav />
          <section className="product-detail-body content-container">
            <p>상품 정보를 불러오는 중입니다.</p>
          </section>
          <AppFooter />
        </main>
    );
  }
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
	            {/* 상세 데이터 전체를 넘겨서 갤러리에서 images/title을 사용 */}
	            <ProductGallery product={product} />

            <section className="product-detail-info" aria-label="상품 정보" data-node-id="456:2022">
              <h2>{product.title}</h2>
                <p className="product-detail-price">
                    {product.type === 'GIVEAWAY' ? (
                        <strong>나눔</strong>
                    ) : (
                        <>
                            <strong>{product.price?.toLocaleString()}</strong>
                            <span>원</span>
                        </>
                    )}
                </p>

              <dl className="product-detail-meta">
                <DetailRow label="카테고리" value={product.category?.name} />
                <DetailRow label="등록일" value={formatDate(product.createdAt)} />
                <DetailRow label="조회수" value={product.viewCount} />
                <DetailRow label="관심수" value={product.likeCount} />
              </dl>

              <div className="product-detail-description">
                <strong>상품설명</strong>
                <p>{product.description}</p>
              </div>
            </section>
          </article>

	          <aside className="product-detail-side" data-node-id="456:2002">
	            {product.owner ? (
	              <>
                      <button
                          className="product-detail-edit"
                          type="button"
                          onClick={() => navigate(`/products/${productId}/edit`)}
                      >
                          <i className="bi bi-pencil-square" aria-hidden="true" />
                          <span>수정하기</span>
                      </button>
	                <button className="product-detail-delete" type="button" onClick={handleDeleteClick}>
	                  <i className="bi bi-trash" aria-hidden="true" />
	                  <span>삭제하기</span>
	                </button>
	              </>
	            ) : (
	              <>
	                <button className="product-detail-chat" type="button">
	                  <i className="bi bi-chat-dots" aria-hidden="true" />
	                  <span>1:1 채팅으로 문의하기</span>
	                </button>
                      <button
                          className="product-detail-like"
                          type="button"
                          onClick={handleLikeClick}
                      >
                          <i
                              className={`bi ${product.likedByMe ? 'bi-heart-fill' : 'bi-heart'}`}
                              aria-hidden="true"
                          />
                          <span>{product.likedByMe ? '찜 취소' : '찜하기'}</span>
                      </button>
	              </>
	            )}

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
