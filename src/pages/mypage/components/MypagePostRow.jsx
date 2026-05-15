import { NavLink } from 'react-router-dom';

function MypagePostRow({ item, wide = false }) {
  return (
    <article className={`mypage-post-item${wide ? ' mypage-post-item-wide' : ''}`}>
      <NavLink className="mypage-post-thumb" to={`/products/${item.id}`}>
        <img src={item.image} alt="" />
      </NavLink>

      <div className="mypage-post-info">
        <NavLink className="mypage-post-title" to={`/products/${item.id}`}>
          {item.title}
        </NavLink>
        <div className="mypage-post-meta">
          <span>{item.category}</span>
          <span>{item.date}</span>
        </div>
        <div className="mypage-post-price">
          <strong>{item.price}</strong>
          <span>원</span>
        </div>
      </div>

      <div className="mypage-post-side">
        <div className="mypage-post-actions">
          <span className={`mypage-post-status${item.done ? ' mypage-post-status-done' : ''}`}>
            {item.status}
          </span>
          <button type="button">
            <i className="bi bi-three-dots-vertical" />
          </button>
        </div>
        <div className="mypage-post-stats">
          <span>
            <i className="bi bi-eye" />
            {item.views}
          </span>
          <span>
            <i className="bi bi-heart" />
            {item.likes}
          </span>
        </div>
      </div>
    </article>
  );
}

export default MypagePostRow;
