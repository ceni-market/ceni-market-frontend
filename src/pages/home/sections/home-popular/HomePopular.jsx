import { NavLink } from 'react-router-dom';
import './HomePopular.scss';
import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../../../../api/apiClient.js";


function HomePopular() {

  const { data: homeRecent } = useQuery({
    queryKey: ['homeRecent'],
    queryFn: async () => {
      const response = await apiClient.get(`/listings?type=SALE&size=6`)
      return response.data.data;
    }
  })

  return (
    <section className="home-popular" data-node-id="425:2079">
      <div className="home-popular-inner content-container">
        <div className="home-popular-header" data-node-id="425:2160">
          <h2 className="home-popular-title">최근 등록 글</h2>
          <NavLink className="home-popular-more" to="/products">
            더 보기 &gt;
          </NavLink>
        </div>

        <div className="home-popular-list" data-node-id="425:2081">
          {homeRecent?.content?.map((product) => (
            <NavLink className="home-popular-card" to={`products/${product?.id}`} key={product?.id}>
              <div className="home-popular-thumb">
                <img
                  className="home-popular-thumb-image"
                  src={product?.image?.imageUrl|| "/assets/images/product-default-img.png"}
                  alt=""
                />
                <span className="home-popular-like">
                  <i
                    className={`home-popular-like-icon bi ${product?.likedByMe ? 'bi-heart-fill' : 'bi-heart'}`}
                    aria-hidden="true"
                  />
                  <span className="home-popular-like-count">{product?.likeCount}</span>
                </span>
              </div>

              <div className="home-popular-info">
                <strong className="home-popular-card-title">{product?.title}</strong>
                <span className="home-popular-category">{product?.category?.name}</span>
                <span className="home-popular-meta">
                  <span className="home-popular-price">{product?.price} 원</span>
                  <span className="home-popular-time">{product.createdAt?.split('T', 1)}</span>
                </span>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomePopular;
