import MypageLayout from './MypageLayout.jsx';
import MypagePostRow from './MypagePostRow.jsx';

function MypageListPage({ title, total, tabs, items = [], handleTabChange, selectedTab}) {
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
              <button className={tab === selectedTab ? 'is-active' : ''} type="button" key={tab} onClick={() => handleTabChange(tab)}>
                {tab}
              </button>
            ))}
          </div>

          <button className="mypage-sort-button" type="button">
            <span>최신 등록순</span>
            <i className="bi bi-chevron-down" />
          </button>
        </div>

        <div className="mypage-detail-list">
          {items.map((item) => (
            <MypagePostRow item={item} wide key={item.id} />
          ))}
        </div>
      </section>
    </MypageLayout>
  );
}

export default MypageListPage;
