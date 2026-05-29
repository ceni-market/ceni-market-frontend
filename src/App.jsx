import {Route, Routes, Navigate} from "react-router-dom";
import Home from "./pages/home/Home.jsx"
import Login from "./pages/auth/login/Login.jsx";
import Signup from "./pages/auth/signup/Signup.jsx";
import FindPassword from "./pages/auth/find-password/FindPassword.jsx";
import EmailConfirm from "./pages/auth/email-confirm/EmailConfirm.jsx";
import SignupComplete from "./pages/auth/signup-complete/SignupComplete.jsx";
import ProductDetail from "./pages/product/detail/ProductDetail.jsx";
import ProductList from "./pages/product/list/ProductList.jsx";
import ProductWrite from "./pages/product/write/ProductWrite.jsx";
import Mypage from "./pages/mypage/my-info/Mypage.jsx";
import MyRegisteredPosts from "./pages/mypage/my-posts/MyRegisteredPosts.jsx";
import TradeHistory from "./pages/mypage/trade-history/TradeHistory.jsx";
import DonationPosts from "./pages/mypage/donation-history/DonationPosts.jsx";
import AccountSettings from "./pages/mypage/account-setting/AccountSettings.jsx";
import './App.css';
import {useEffect} from "react";
import LikePosts from "./pages/mypage/my-likes/LikePosts.jsx";

import { useAuthStore } from "./store/authStore";
import OAuth2RedirectHandler from "./pages/auth/login/OAuth2RedirectHandler.jsx";

// 🔒 [디펜시브 코드] 1차 주소창 방어벽
// 로그인 상태가 아니면 비정상적인 주소창 타이핑 접근을 차단하고 로그인 페이지로 강제 리다이렉트합니다.
const ProtectedRoute = ({ children }) => {
      const accessToken = useAuthStore((state) => state.accessToken);

      if (!accessToken) {
            //alert("로그인이 필요한 서비스입니다.");
            return <Navigate to="/login" replace />;
      }
      return children;
};

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
          {/* 🌍 1. 누구나 자유롭게 접근 가능한 공용(Public) 라우트 */}
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 🎯 이메일 인증 대기 및 가입 완료 라우터 주소 동기화 */}
          <Route path="/email-confirm" element={<EmailConfirm />} />
          <Route path="/signup-complete" element={<SignupComplete />} />

          <Route path="/find-password" element={<FindPassword />} />
          <Route path="/find-password/verify" element={<EmailConfirm />} />
          <Route path="/find-password/reset" element={<FindPassword step={3} />} />
          <Route path="/find-password/complete" element={<FindPassword step={4} />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/posts/:postId" element={<ProductDetail />} />

            {/* 🔄 2. [추가] 소셜 로그인 성공 시 백엔드가 프론트로 튕겨주는 전용 길목 */}
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

            {/* 🔒 3. [보안망 가동] 토큰이 없으면 주소창 타이핑 시 차단되는 회원 전용 라우트 */}
            <Route path="/posts/new" element={<ProtectedRoute><ProductWrite /></ProtectedRoute>} />
            <Route path="/mypage" element={<ProtectedRoute><Mypage /></ProtectedRoute>} />
            <Route path="/mypage/posts" element={<ProtectedRoute><MyRegisteredPosts /></ProtectedRoute>} />
            <Route path="/mypage/trades" element={<ProtectedRoute><TradeHistory /></ProtectedRoute>} />
            <Route path="/mypage/donations" element={<ProtectedRoute><DonationPosts /></ProtectedRoute>} />
            <Route path="/mypage/account" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
            <Route path="/mypage/likes" element={<ProtectedRoute><LikePosts /></ProtectedRoute>} />
      </Routes>
  )
}

export default App
