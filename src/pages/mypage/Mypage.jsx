import MypageLayout from './components/MypageLayout.jsx';
import { mypagePosts, recentTrades } from './mypageData.js';
import './Mypage.scss';
import MyPosts from "./components/MyPosts.jsx";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import RecentTrades from "./components/RecentTrades.jsx";
import ProfileSummary from "./components/ProfileSummary.jsx";
import {useAuthStore} from "../../store/authStore.js";
import {apiClient} from "../../api/apiClient.js";

function Mypage() {
    const { data: myPosts, isLoading: myPostsLoading, error: myPostsError } = useQuery({
        queryKey: ['myPosts'],
        queryFn: async () => {
            const response = await apiClient.get(`/mypage/listings?size=3`)
            return response.data.data;
        }
    })

    const {data : recentTrades, isLoading : recentTradesLoading, error : recentTradesError} = useQuery({
        queryKey: ['recentTrades'],
        queryFn: async () => {
            const response = await apiClient.get(`/mypage/transactions?size=3`)
            return response.data.data.content;
        }
    })

    const {data : profileSummary} = useQuery({
        queryKey: ['profileSummary'],
        queryFn: async () => {
            const response = await apiClient.get(`/mypage/summary`)
            return response.data.data;
        }
    })

    const {data : profilePanel} = useQuery({
        queryKey: ['profilePanel'],
        queryFn: async () => {
            const response = await apiClient.get(`/mypage/me`)
            return response.data.data;
        }
    })

  return (
    <MypageLayout>
      <div className="mypage-content">
        <ProfileSummary profileSummary={profileSummary} profilePanel={profilePanel}/>
        <div className="mypage-lower">
          <MyPosts myPosts = {myPosts?.content} />
          <RecentTrades recentTrades = {recentTrades} />
        </div>
      </div>
    </MypageLayout>
  );
}

export default Mypage;
