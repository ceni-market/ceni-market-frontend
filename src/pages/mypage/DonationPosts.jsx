import MypageListPage from './components/MypageListPage.jsx';
import { donationRows } from './mypageData.js';
import './Mypage.scss';

function DonationPosts() {
  return (
    <MypageListPage
      title="나눔한 글"
      tabs={['전체', '나눔중인 글', '나눔 완료']}
      items={donationRows}
    />
  );
}

export default DonationPosts;
