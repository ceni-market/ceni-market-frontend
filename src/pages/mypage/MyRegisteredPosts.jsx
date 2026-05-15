import MypageListPage from './components/MypageListPage.jsx';
import { productRows } from './mypageData.js';
import './Mypage.scss';

function MyRegisteredPosts() {
  return (
    <MypageListPage
      title="내가 등록한 글"
      total="12"
      tabs={['전체', '판매 중', '거래 완료']}
      items={productRows}
    />
  );
}

export default MyRegisteredPosts;
