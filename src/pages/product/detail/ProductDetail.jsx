import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import AppFeatures from '../../../widgets/app-features/AppFeatures.jsx';
import AppFooter from '../../../widgets/app-footer/AppFooter.jsx';
import AppHeader from '../../../widgets/app-header/AppHeader.jsx';
import AppNav from '../../../widgets/app-nav/AppNav.jsx';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../../api/apiClient.js';
import { useAuthStore } from '../../../store/authStore';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './ProductDetail.scss';
import ChatModal from "../../../widgets/chat-modal/ChatModal.jsx";

// 상품 이미지가 없을 때는 기본 이미지를 넣어서 Swiper가 비지 않게 처리
function ProductGallery({ product }) {
  const images =
    product.images?.length > 0 ? product.images : [{ imageUrl: '/assets/images/product-default-img.png' }];
  const hasMultipleImages = images.length > 1;

  return (
    <div className="product-detail-gallery">
      <Swiper
        className="product-detail-gallery-main"
        slidesPerView={1}
        spaceBetween={30}
        loop={hasMultipleImages}
        pagination={{
          clickable: true,
        }}
        navigation={hasMultipleImages}
        modules={[Pagination, Navigation]}
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
  const { productId } = useParams();
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.user);     

  const accessToken = useAuthStore((state) => state.accessToken);
  // 서버 응답 데이터
  const [product, setProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

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
    if (!accessToken) {
      alert('관심 등록은 로그인 후 이용할 수 있습니다.');
      navigate('/login');
      return;
    }

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
      console.error('관심 처리 실패', error);
      alert('관심 처리에 실패했습니다.');
    }
  };

  // 상세 데이터는 URL의 productId 기준으로 조회한다.
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

  //해당 게시물에 대한 채팅방 생성 or 입장 하는 코드
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [createdChatRoomId, setCreatedChatRoomId] = useState(0);

  const chatStart = async () => {
    await apiClient.post(`/chat`, {
      listingId: Number(productId),
      sellerId: Number(product.seller.id),
      buyerId: Number(authUser.id)
    }).then((res) => {
      setIsChatOpen(true);
      setCreatedChatRoomId(res.data.data.chatRoomId);
    }).catch((err) => {
      console.error(err);
    })
  }

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

      <section className="product-detail-banner content-container">
        <h1>나눔은 마음을 이어줍니다</h1>
        <img src="/assets/images/detail-banner-img.png" alt="" />
      </section>

      <section className="product-detail-body content-container">
        <div className="product-detail-breadcrumb">
          홈 &gt; {product.type === 'GIVEAWAY' ? '나눔' : '상품'} &gt; {product.category?.name}
        </div>

        <div className="product-detail-layout">
          <article className="product-detail-card">
            <ProductGallery product={product} />

            <section className="product-detail-info">
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

          <aside className="product-detail-side">
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
                <button className="product-detail-chat" type="button" onClick={chatStart}>
                  <i className="bi bi-chat-dots" aria-hidden="true" />
                  <span>1:1 채팅으로 문의하기</span>
                </button>
                { isChatOpen && (<ChatModal isChatOpen={isChatOpen}
                                            onClose={() => setIsChatOpen(false)}
                                            createdChatRoomId={createdChatRoomId}
                                            setCreatedChatRoomId={setCreatedChatRoomId}
                />)}
                <button className="product-detail-like" type="button" onClick={handleLikeClick}>
                  <i
                    className={`bi ${product.likedByMe ? 'bi-heart-fill' : 'bi-heart'}`}
                    aria-hidden="true"
                  />
                  <span>{product.likedByMe ? '관심 취소' : '관심 등록'}</span>
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
