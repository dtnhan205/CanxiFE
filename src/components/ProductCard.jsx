import React from 'react';
import { Link } from 'react-router-dom'; // Thêm react-router-dom

const ProductCard = ({ badge, image, title, specification, price, originalPrice, _id }) => {
  console.log('ProductCard props:', { badge, image, title, specification, price, originalPrice, _id }); // Log để debug

  return (
    <div className="product-card">
      <Link to={`/product-detail/${_id}`} className="product-card-link">
        <span className="product-badge">{badge}</span>
        <div className="product-image">
          <img src={image} alt={title} />
        </div>
        <div className="product-info">
          <h3 className="product-title">{title}</h3>
          <div className="product-specification">{specification || 'Chưa có thông tin'}</div>
          <div className="product-price">
            <span className="current-price">{price}</span>
            <span className="original-price">{originalPrice}</span>
          </div>
          <button className="add-to-cart">
            <i className="fas fa-shopping-cart"></i> MUA NGAY
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;