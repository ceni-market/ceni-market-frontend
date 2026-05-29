import AppFeatures from '../../widgets/app-features/AppFeatures.jsx';
import AppFooter from '../../widgets/app-footer/AppFooter.jsx';
import AppHeader from '../../widgets/app-header/AppHeader.jsx';
import AppNav from '../../widgets/app-nav/AppNav.jsx';
import './DonationList.scss';
import DonationCard from "./components/DonationCard.jsx";
import DonationSide from "./components/DonationSide.jsx";
import {useState} from "react";
import {apiClient} from "../../api/apiClient.js";
import {useQuery} from "@tanstack/react-query";

const categories = [
  { name: '전체', id: null },
  { name: 'ITㆍ디지털', id: 1 },
  { name: '가전제품', id: 2 },
  { name: '가구ㆍ인테리어', id: 3 },
  { name: '생활ㆍ주방', id: 4 },
  { name: '스포츠ㆍ취미', id: 5 },
  { name: '도서ㆍ음반', id: 6 },
  { name: '유아ㆍ기타', id: 7 },
];

const price_filters = ['1만원 이하', '1~5만원', '5~10만원', '10만원 이상'];

function DonationList() {
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(0);
  const size = 10;
  const type = 'GIVEAWAY';

  const fetchDonations = async (categoryId) => {
    const response = await apiClient.get(
        `/listings`,
        {
          params: {
            page,
            size,
            type,
            ...(categoryId && {categoryId}),
          }
        }
    )
    setTotal(response.data.data.totalElements)
    return response.data.data
  }

  const {data, isLoading, error} = useQuery({
    queryKey: ['donations', selectedCategory, page, size],
    queryFn: () => fetchDonations(selectedCategory),
  })

  // 여기서부터
  const visiblePageCount = 5;
  const currentPage = Math.max(page, 0);
  const pageStart = Math.max(
      Math.min(
          currentPage - Math.floor(visiblePageCount / 2),
          data?.totalPages - visiblePageCount,
      ),
      0,
  );

  const pageNumbers = Array.from(
      {length: Math.min(visiblePageCount, data?.totalPages)},
      (_, index) => pageStart + index,
  );
  // 여기까지는 페이지 버튼 5개만 보여주기 위한 계산을 위한 코드

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(0);
  }


  return (
    <main className="product-list-page">
      <AppHeader />
      <AppNav />

      <section className="product-list-banner content-container">
        <h1>나눔 상품</h1>
        <p>필요한 사람에게 따뜻한 마음을 전해보세요</p>
      </section>

      <section className="product-list-body content-container">
        <DonationSide categories = {categories} price_filters = {price_filters} selectedCategory = {selectedCategory} handleCategoryChange = {handleCategoryChange} />

        <section className="product-list-panel">
          <div className="product-list-toolbar">
            <h2>
              전체 <strong>{total}</strong> 건
            </h2>
            <button className="product-list-sort" type="button">
              <span>최신 등록순</span>
              <i className="bi bi-chevron-down" />
            </button>
          </div>

          <div className="product-list-grid">
            {data?.content?.map((item) => (
              <DonationCard item={item} key={item.id} />
            ))}
          </div>
          {data?.totalPages > 1 && (
              <div className="mypage-pagination">
                <button
                    className="mypage-pagination-arrow"
                    type="button"
                    disabled={page === 0}
                    onClick={() => setPage(currentPage - 1)}
                >
                  이전
                </button>

                {pageNumbers.map((pageNumber) => (
                    <button
                        type="button"
                        key={pageNumber}
                        className={pageNumber === currentPage ? 'is-active' : ''}
                        onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber + 1}
                    </button>
                ))}

                <button
                    className="mypage-pagination-arrow"
                    type="button"
                    disabled={data?.last}
                    onClick={() => setPage(currentPage + 1)}
                >
                  다음
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

export default DonationList;
