import MypageListPage from './components/MypageListPage.jsx';
import './Mypage.scss';
import {useAuthStore} from "../../store/authStore.js";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {useState} from "react";

function MyRegisteredPosts() {
  const { token } = useAuthStore();
  const [myPosts, setMyPosts] = useState([]);

  const {data, isLoading : myPostsLoading, error : myPostsError} = useQuery({
    queryKey: ['myPosts'],
    queryFn: async () => {
      const response = await axios.get(`https://api.ceni-market.site/api/mypage/listings?size=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      setMyPosts(response.data.data.content);
      return response.data.data;
    }
  })

  const handleTabChange = (status, type) => {
    if(status === "ACTIVE")


  }
  return (
    <MypageListPage
      title="내가 등록한 글"
      total={data?.totalElements ?? 0}
      tabs={['전체', '판매 중', '나눔 중','판매 완료', '나눔 완료']}
      items={myPosts}
    />
  );
}

export default MyRegisteredPosts;
