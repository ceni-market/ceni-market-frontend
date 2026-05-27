import {Route, Routes} from "react-router-dom";
import Home from "./pages/home/Home.jsx"
import Login from "./pages/auth/login/Login.jsx";
import Signup from "./pages/auth/signup/Signup.jsx";
import FindPassword from "./pages/auth/find-password/FindPassword.jsx";
import EmailConfirm from "./pages/auth/email-confirm/EmailConfirm.jsx";
import SignupComplete from "./pages/auth/signup-complete/SignupComplete.jsx";
import ProductDetail from "./pages/product/detail/ProductDetail.jsx";
import ProductList from "./pages/product/list/ProductList.jsx";
import ProductWrite from "./pages/product/write/ProductWrite.jsx";
import Mypage from "./pages/mypage/Mypage.jsx";
import MyRegisteredPosts from "./pages/mypage/MyRegisteredPosts.jsx";
import TradeHistory from "./pages/mypage/TradeHistory.jsx";
import DonationPosts from "./pages/mypage/DonationPosts.jsx";
import AccountSettings from "./pages/mypage/AccountSettings.jsx";
import './App.css';
import {useEffect} from "react";
import LikePosts from "./pages/mypage/LikePosts.jsx";

function App() {
      useEffect(() => {
            const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            const hostname = window.location.hostname;

            // 이미 모바일 도메인이면 리다이렉트 안함
            if (hostname === "m.ceni-market.site") {
                  return;
            }

            // 모바일 기기로 접속했을 때만 모바일 페이지 이동
            if (
                isMobile &&
                hostname.endsWith("ceni-market.site")
            ) {
                  window.location.href = "https://m.ceni-market.site/mobile/login";
            }
      }, []);
  return (
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/email-confirm" element={<EmailConfirm redirectTo="/signup/complete" />} />
        <Route path="/signup/complete" element={<SignupComplete />} />
        <Route path="/find-password" element={<FindPassword />} />
        <Route path="/find-password/verify" element={<EmailConfirm />} />
        <Route path="/find-password/reset" element={<FindPassword step={3} />} />
        <Route path="/find-password/complete" element={<FindPassword step={4} />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/posts/new" element={<ProductWrite />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/posts/:postId" element={<ProductDetail />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/mypage/posts" element={<MyRegisteredPosts />} />
        <Route path="/mypage/trades" element={<TradeHistory />} />
        <Route path="/mypage/donations" element={<DonationPosts />} />
        <Route path="/mypage/account" element={<AccountSettings />} />
        <Route path="/mypage/likes" element={<LikePosts />} />
      </Routes>
  )
}

export default App
