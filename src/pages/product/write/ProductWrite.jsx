import { NavLink, useNavigate } from 'react-router-dom';
import AppFeatures from '../../../widgets/app-features/AppFeatures.jsx';
import AppFooter from '../../../widgets/app-footer/AppFooter.jsx';
import AppHeader from '../../../widgets/app-header/AppHeader.jsx';
import AppNav from '../../../widgets/app-nav/AppNav.jsx';
import './ProductWrite.scss';
import { useEffect, useState } from 'react';
import { apiClient } from '../../../api/apiClient.js';

const TRADE_TYPES = [
  {
    value: 'SALE',
    title: '판매하기',
    desc: '가격을 받고 판매해요',
    icon: 'bi-bag',
  },
  {
    value: 'GIVEAWAY',
    title: '나눔하기',
    desc: '필요한 분께 무료로 나눠요',
    icon: 'bi-heart',
  },
];

// 거래 종류 선택 카드를 재사용하기 위한 작은 컴포넌트
function TradeTypeCard({ type, checked, onChange }) {
  return (
    <label className="product-write-type">
      <input type="radio" name="type" value={type.value} checked={checked} onChange={onChange} />
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
  // 상품 등록 폼에서 사용자가 입력하는 값을 한 곳에서 관리
  const [form, setForm] = useState({
    type: 'SALE',
    categoryId: '',
    title: '',
    description: '',
    price: '',
  });

  // 백엔드에서 조회한 카테고리 목록
  const [categories, setCategories] = useState([]);
  // 사용자가 선택한 이미지 파일 목록
  const [imageFiles, setImageFiles] = useState([]);
  const navigate = useNavigate();

  // input/select/radio 값이 바뀔 때 form state를 갱신
  const handleChange = (event) => {
    const { name, value } = event.target;

    // 나눔하기를 선택하면 가격은 항상 0원으로 고정
    if (name === 'type' && value === 'GIVEAWAY') {
      setForm((prevForm) => ({
        ...prevForm,
        type: value,
        price: '0',
      }));
      return;
    }

    // name 값과 같은 form 필드만 동적으로 변경
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value }));
  };
  // 이미지 파일 선택 시 FileList를 배열로 바꿔 state에 저장
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    if (files.length > 10) {
      alert('이미지는 최대 10장까지 등록할 수 있습니다.');
      event.target.value = '';
      setImageFiles([]);
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    const hasOverSizeFile = files.some((file) => file.size > maxSize);

    if (hasOverSizeFile) {
      alert('이미지는 개당 5MB 이하만 등록할 수 있습니다.');
      event.target.value = '';
      setImageFiles([]);
      return;
    }

    setImageFiles(files);
  };
  // 상품 등록 버튼을 눌렀을 때 백엔드에 등록 요청
  const handleSubmit = async (event) => {
    event.preventDefault();
    // 백엔드 요청 전에 프론트에서 먼저 필수 입력값 확인
    if (!form.categoryId) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    if (!form.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!form.description.trim()) {
      alert('상품 설명을 입력해주세요.');
      return;
    }
    if (form.price === '') {
      alert('가격을 입력해주세요.');
      return;
    }

    try {
      // 이미지 업로드를 하지 않은 경우에는 빈 배열로 게시글 등록
      let imageUrls = [];

      if (imageFiles.length > 0) {
        // 파일은 JSON으로 보낼 수 없어서 FormData에 담아 전송
        const formData = new FormData();

        // 백엔드 @RequestParam("files") 이름과 맞춰 files로 추가
        imageFiles.forEach((file) => {
          formData.append('files', file);
        });

        const imageResponse = await apiClient.post('/uploads/images', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // 이미지 업로드 응답에서 게시글 등록에 사용할 이미지 URL 목록 추출
        imageUrls = imageResponse.data.data.imageUrls;
      }

      // 백엔드 ListingCreateRequest 형식에 맞춰 전송할 데이터 구성
      const payload = {
        categoryId: Number(form.categoryId),
        title: form.title,
        description: form.description,
        price: Number(form.price),
        type: form.type,
        imageUrls: imageUrls,
      };

      const response = await apiClient.post('/listings', payload);
      const listingId = response.data.data.listingId;
      alert('게시글이 등록되었습니다.');
      navigate(`/products/${listingId}`);
    } catch (error) {
      console.error('게시글 등록 실패:', error);
      alert('게시글 등록에 실패했습니다.');
    }
  };

  // 페이지가 처음 열릴 때 카테고리 목록을 한 번만 조회
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/categories');
        setCategories(response.data.data);
      } catch (error) {
        console.error('카테고리 목록 조회 실패', error);
        }
      };
      fetchCategories();
    }, []);

  return (
    <main className="product-write-page">
      <AppHeader />
      <AppNav />

      <section className="product-write content-container">
        <div className="product-write-head">
          <h1>글쓰기</h1>
          <p>세니마켓에 판매하거나 나눔할 물건을 올려보세요.</p>
        </div>

        <form className="product-write-layout" onSubmit={handleSubmit}>
          <section className="product-write-card product-write-main">
            <div className="product-write-field product-write-kind-field">
              <span className="product-write-label">거래 종류</span>
              <div className="product-write-type-list">
                {/* 선택된 거래 종류와 현재 카드의 value가 같으면 checked 처리 */}
                {TRADE_TYPES.map((type) => (
                  <TradeTypeCard type={type} checked={form.type === type.value}  onChange={handleChange} key={type.value} />
                ))}
              </div>
            </div>

            <label className="product-write-field product-write-category-field">
              <span className="product-write-label">카테고리</span>
              <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
                <option value="" disabled>
                  카테고리를 선택해주세요
                </option>
                {/* 백엔드에서 받은 카테고리 배열을 select 옵션으로 렌더링 */}
                {categories.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="product-write-field">
              <span className="product-write-label">제목</span>
              <span className="product-write-title-control">
                <input type="text" name="title" value={form.title} onChange={handleChange} maxLength="150" placeholder="제목을 입력해주세요 (최대 150자)" />
                {/* 백엔드 제목 제한과 맞춘 글자 수 표시 */}
                <span>{form.title.length}/150</span>
              </span>
            </label>

            <div className="product-write-field product-write-image-field">
              <span className="product-write-label">상품 이미지</span>
              <label className="product-write-dropzone">
                <input type="file" accept="image/*" multiple onChange={handleImageChange}/>
                <i className="bi bi-plus-circle" />
                <strong>
                  {imageFiles.length > 0
                    ? `${imageFiles[0].name}${imageFiles.length > 1 ? ` 외 ${imageFiles.length - 1}개` : ''}`
                    : '사진을 추가하세요'}
                </strong>
                <span>(최대 10장, 개당 5MB 이하)</span>
                <small>클릭해서 이미지를 선택해 주세요</small>
              </label>
            </div>

            <label className="product-write-field product-write-desc-field">
              <span className="product-write-label">상품 설명</span>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="상품에 대해 자세히 설명해주세요." />
            </label>
          </section>

          <aside className="product-write-card product-write-side">
            <label className="product-write-price-field">
              <span className="product-write-label">가격</span>
              {/* 나눔하기일 때는 가격을 수정하지 못하도록 비활성화 */}
              <input type="number" name="price" value={form.price} onChange={handleChange} min="0" inputMode="numeric" placeholder="가격을 입력해주세요" disabled={form.type === 'GIVEAWAY'} />
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
