import MypageListPage from './components/MypageListPage.jsx';
import { tradeRows } from './mypageData.js';
import './Mypage.scss';

function TradeHistory() {
  return (
    <MypageListPage
      title="거래 내역"
      tabs={['전체', '판매한 상품', '구매한 상품']}
      items={tradeRows}
    />
  );
}

export default TradeHistory;
