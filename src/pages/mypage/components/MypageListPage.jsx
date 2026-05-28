import MypageLayout from './MypageLayout.jsx';
import MypagePostRow from './MypagePostRow.jsx';

function MypageListPage({
                            title,
                            total,
                            tabs,
                            items = [],
                            handleTabChange,
                            selectedTab,
                            page = 0,
                            totalPages = 0,
                            last = true,
                            onPageChange,
                        }) {

    // 여기서부터
    const visiblePageCount = 5;
    const currentPage = Math.max(page, 0);
    const pageStart = Math.max(
        Math.min(
            currentPage - Math.floor(visiblePageCount / 2),
            totalPages - visiblePageCount,
        ),
        0,
    );
    const pageNumbers = Array.from(
        {length: Math.min(visiblePageCount, totalPages)},
        (_, index) => pageStart + index,
    );
    // 여기까지는 페이지 버튼 5개만 보여주기 위한 계산을 위한 코드

    // 여기서부터
    const handlePageChange = (nextPage) => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        onPageChange(nextPage);
    };
    // 여기까지는 페이지 변경 시 스크롤 맨 위로 초기화

    return (
        <MypageLayout>
            <section className="mypage-detail-panel">
                <div className="mypage-detail-title">
                    <h2>{title}</h2>
                    <span>
              전체 <strong>{total}</strong>
            </span>
                </div>

                <div className="mypage-detail-toolbar">
                    <div className="mypage-detail-tabs">
                        {tabs.map((tab, index) => (
                            <button className={tab === selectedTab ? 'is-active' : ''} type="button" key={tab}
                                    onClick={() => handleTabChange(tab)}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    <button className="mypage-sort-button" type="button">
                        <span>최신 등록순</span>
                        <i className="bi bi-chevron-down"/>
                    </button>
                </div>

                <div className="mypage-detail-list">
                    {items.map((item) => (
                        <MypagePostRow item={item} wide key={item.id || item.transactionId}/>
                    ))}
                </div>
                {totalPages > 1 && (
                    <div className="mypage-pagination">
                        <button
                            className="mypage-pagination-arrow"
                            type="button"
                            disabled={page === 0}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            이전
                        </button>

                        {pageNumbers.map((pageNumber) => (
                            <button
                                type="button"
                                key={pageNumber}
                                className={pageNumber === currentPage ? 'is-active' : ''}
                                onClick={() => handlePageChange(pageNumber)}
                            >
                                {pageNumber + 1}
                            </button>
                        ))}

                        <button
                            className="mypage-pagination-arrow"
                            type="button"
                            disabled={last}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            다음
                        </button>
                    </div>
                )}
            </section>
        </MypageLayout>
    );
}

export default MypageListPage;
