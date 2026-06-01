import { Link } from 'react-router-dom';
import './HomeSub.scss';
import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../../../../api/apiClient.js";

function HomeSub() {

  const { data: homeRecentDonations } = useQuery({
    queryKey: ['homeRecentDonations'],
    queryFn: async () => {
      const response = await apiClient.get(`/listings?type=GIVEAWAY&size=4`)
      return response.data.data;
    }
  })


  return (
    <section className="home-sub" data-node-id="425:2031">
      <div className="home-sub-inner content-container">
        <div className="home-sub-content">
          <Link className="home-sub-banner home-sub-donation" to="/donations">
            <img
              className="home-sub-banner-image"
              src="/assets/images/sub-donation.png"
              alt=""
            />
            <strong className="home-sub-banner-title home-sub-donation-title">
              나눔은 마음을 이어줍니다
            </strong>
            <span className="home-sub-banner-desc home-sub-donation-desc">
              필요한 분께 따뜻한 나눔을 실천해보세요.
            </span>
            <span className="home-sub-banner-button home-sub-donation-button">
              나눔 게시판 바로가기 &gt;
            </span>
          </Link>

          <Link className="home-sub-banner home-sub-guide" to="/" onClick={()=>window.alert("준비중입니다.")}>
            <img
              className="home-sub-banner-image"
              src="/assets/images/sub-guide.png"
              alt=""
            />
            <strong className="home-sub-banner-title home-sub-guide-title">
              세니마켓 이용 가이드
            </strong>
            <span className="home-sub-banner-desc home-sub-guide-desc">
              <span className="home-sub-guide-desc-line">
                처음이신가요? 간단한 가이드를
              </span>
              <span className="home-sub-guide-desc-line">
                확인하고 안전하게 거래해요!
              </span>
            </span>
            <span className="home-sub-banner-button home-sub-guide-button">
              가이드 보기 &gt;
            </span>
          </Link>

          <section className="home-sub-recent" aria-labelledby="recent-share-title">
            <div className="home-sub-recent-header">
              <h2 className="home-sub-recent-title" id="recent-share-title">
                최근 나눔 글
              </h2>
              <Link className="home-sub-recent-more" to="/donations">
                더 보기 &gt;
              </Link>
            </div>

            <div className="home-sub-recent-list">
              {homeRecentDonations?.content?.map((product) => (
                <Link className="home-sub-recent-item" to={`/products/${product?.id}`} key={product?.id}>
                  <span className="home-sub-recent-left">
                    <span className="home-sub-recent-badge">나눔</span>
                    <span className="home-sub-recent-name">{product?.title}</span>
                  </span>
                  <span className="home-sub-recent-time">{product.createdAt?.split('T', 1)}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default HomeSub;
