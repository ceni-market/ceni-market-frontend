import { NavLink } from 'react-router-dom';
import MypageLayout from './components/MypageLayout.jsx';
import MypagePostRow from './components/MypagePostRow.jsx';
import { mypagePosts, recentTrades } from './mypageData.js';
import './Mypage.scss';
import MyPosts from "./components/MyPosts.jsx";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import RecentTrades from "./components/RecentTrades.jsx";

const AUTH_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzcDI4NzdAa25vdS5hYy5rciIsImlhdCI6MTc3OTI2NDEwMCwiZXhwIjoxNzc5NDQ0MTAwfQ.QuwJEfC10HZNVnMipjOM5DdBjyIjSA684WiNb57b4B8';
const AUTH_CHANGE_EVENT = 'ceni-market-auth-change';

const summaryItems = [
  { label: '판매한 상품', count: 8, href: '/mypage/trades' },
  { label: '관심 상품', count: 5, href: '/mypage' },
  { label: '나눔한 글', count: 3, href: '/mypage/donations' },
  { label: '나눔 받은 글', count: 2, href: '/mypage' },
];

function ProfileSummary() {
  const handleLogout = () => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  };

  return (
    <section className="mypage-profile-panel">
      <div className="mypage-profile">
        <div className="mypage-profile-avatar">
          <i className="bi bi-person-fill" />
        </div>

        <div className="mypage-profile-copy">
          <strong>
            이동규 님 <span>👋</span>
          </strong>
          <p>안녕하세요! 세니마켓에서 즐거운 거래와 나눔을 경험하세요.</p>
          <button className="mypage-logout-button" type="button" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>

      <div className="mypage-summary-list">
        {summaryItems.map((item) => (
          <NavLink className="mypage-summary-card" to={item.href} key={item.label}>
            <i className="bi bi-tag" />
            <strong>{item.count}</strong>
            <span>{item.label}</span>
            <em>자세히 보기 &gt;</em>
          </NavLink>
        ))}
      </div>
    </section>
  );
}

function Mypage() {
    const {data : myPosts, isLoading : myPostsLoading, error : myPostsError} = useQuery({
        queryKey: ['myPosts'],
        queryFn: async () => {
            const response = await axios.get(`https://api.ceni-market.site/api/mypage/listings?size=3`, {
                headers: {
                    Authorization: `Bearer ${AUTH_STORAGE_KEY}`,
                }
            })
            // console.log(response.data.data.content)
            return response.data.data.content;
        }
    })

    const {data : recentTrades, isLoading : recentTradesLoading, error : recentTradesError} = useQuery({
        queryKey: ['recentTrades'],
        queryFn: async () => {
            const response = await axios.get(`https://api.ceni-market.site/api/mypage/transactions?size=3`, {
                headers: {
                    Authorization: `Bearer ${AUTH_STORAGE_KEY}`,
                }
            })
            console.log(response.data.data.content)
            return response.data.data.content;
        }
    })

    if (recentTradesError) {
        console.log(recentTradesError);
    }

  return (
    <MypageLayout>
      <div className="mypage-content">
        <ProfileSummary />
        <div className="mypage-lower">
          <MyPosts myPosts = {myPosts} />
          <RecentTrades recentTrades = {recentTrades} />
        </div>
      </div>
    </MypageLayout>
  );
}

export default Mypage;
