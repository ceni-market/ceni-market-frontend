import {NavLink, useNavigate} from "react-router-dom";
import {useAuthStore} from "../../../store/authStore.js";

const ProfileSummary = ({profileSummary = [], profilePanel = []}) => {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const summaryItems = [
        { id: 1, label: '판매한 상품', count: profileSummary.soldListingCount, href: '/mypage/trades' },
        { id: 2, label: '관심 상품', count: profileSummary.likedListingCount, href: '/mypage' },
        { id: 3, label: '나눔한 글', count: profileSummary.donatedListingCount, href: '/mypage/donations' },
        { id: 4, label: '나눔 받은 글', count: profileSummary.receivedDonationCount, href: '/mypage' },
    ];

    return (
        <section className="mypage-profile-panel">
            <div className="mypage-profile">
                <div className="mypage-profile-avatar">
                    {profilePanel.profileImageUrl ? (
                        <img src={profilePanel.profileImageUrl} alt="" />
                    ) : (
                        <i className="bi bi-person-fill" />
                    )}
                </div>

                <div className="mypage-profile-copy">
                    <strong>
                        {profilePanel.name} 님 <span>👋</span>
                    </strong>
                    <p>안녕하세요! 세니마켓에서 즐거운 거래와 나눔을 경험하세요.</p>
                    <button className="mypage-logout-button" type="button" onClick={handleLogout}>
                        로그아웃
                    </button>
                </div>
            </div>

            <div className="mypage-summary-list">
                {summaryItems.map((item) => (
                    <NavLink className="mypage-summary-card" to={item.href} key={item.id}>
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

export default ProfileSummary;