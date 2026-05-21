import {NavLink} from "react-router-dom";

function TradeItem({ trade }) {
    return (
        <article className="mypage-trade-item">
            <img src={trade.image.imageUrl} alt="" />
            <div className="mypage-trade-info">
                <div className="mypage-trade-head">
                    <strong>{trade.title}</strong>
                    <span>{trade.completedAt.split('T', 1)}</span>
                </div>
                <span className="mypage-trade-status">판매 완료</span>
                <div className="mypage-trade-price">
                    <strong>{trade.price}</strong>
                    <span>원</span>
                </div>
            </div>
        </article>
    );
}

const RecentTrades = ({recentTrades = []}) => {
    return (
        <aside className="mypage-side-column">
            <section className="mypage-trades-panel">
                <div className="mypage-panel-head">
                    <h2>최근 거래 내역</h2>
                    <NavLink to="/mypage/trades">더보기 &gt;</NavLink>
                </div>
                <div className="mypage-trade-list">
                    {recentTrades.map((trade) => (
                        <TradeItem trade={trade} key={trade.transactionId} />
                    ))}
                </div>
            </section>
            <section className="mypage-donation-banner">
                <img src="/assets/images/mypage-banner.png" alt="" />
                <div className="mypage-donation-copy">
                    <strong>나눔으로 더 가까워지는 우리</strong>
                    <NavLink to="/mypage/donations">나눔 게시판 바로가기 &gt;</NavLink>
                </div>
            </section>
        </aside>
    );
}

export default RecentTrades;