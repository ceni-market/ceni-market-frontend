import { NavLink } from 'react-router-dom';

function MypagePostRow({ item, wide = false }) {
  const productId = item.listingId ?? item.id;

  return (
    <article className={`mypage-post-item${wide ? ' mypage-post-item-wide' : ''}`}>
      <NavLink className="mypage-post-thumb" to={`/products/${productId}`}>
        <img src={item.image?.imageUrl|| "/assets/images/product-default-img.png"} alt="" />
      </NavLink>

      <div className="mypage-post-info">
        <NavLink className="mypage-post-title" to={`/products/${productId}`}>
          {item.title}
        </NavLink>
        <div className="mypage-post-meta">
          <span>{item.category?.name||item.categoryName}</span>
          <span>{item.updatedAt?.split('T', 1)||item.completedAt.split('T', 1)}</span>
        </div>
        <div className="mypage-post-price">
          <strong>{item.price}</strong>
          <span>원</span>
        </div>
      </div>

      <div className="mypage-post-side">
        <div className="mypage-post-actions">
          <span className={`mypage-post-status${item.status !== 'ACTIVE' ? ' mypage-post-status-done' : ''}`}>
            {item.status||item.transactionType}
          </span>
        </div>
        <div className="mypage-post-stats">
          <span>
            <i className="bi bi-eye" />
            {item.viewCount}
          </span>
          <span>
            <i className="bi bi-heart" />
            {item.likeCount}
          </span>
        </div>
      </div>
    </article>
  );
}

export default MypagePostRow;
