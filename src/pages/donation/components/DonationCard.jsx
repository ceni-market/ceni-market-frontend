import {NavLink} from "react-router-dom";

const DonationCard = ({ item }) => {
    return (
        <NavLink className="product-list-card" to={`/products/${item?.id}`}>
            <div className="product-list-card-thumb">
                <img src={item?.image?.imageUrl|| "/assets/images/product-default-img.png"} alt="" />
                <span className="product-list-card-like">
          <i className={`bi ${item?.likedByMe ? 'bi-heart-fill' : 'bi-heart'}`} />
          <span>{item?.likeCount}</span>
        </span>
            </div>

            <div className="product-list-card-info">
                <strong>{item?.title}</strong>
                <span className="product-list-card-category">{item?.category?.name}</span>
                <span className="product-list-card-meta">
          <span className="product-list-card-price">{item?.price} 원</span>
          <span className="product-list-card-time">{item?.updatedAt?.split('T', 1)}</span>
        </span>
            </div>
        </NavLink>
    );
}

export default DonationCard;
