import React from 'react';

const ProductHero = () => {
  return (
    <section className="product-hero">
      <div className="detail-container fade-in-up"> {/* Thay đổi container nếu cần */}
        <h1>Canxi Cơm</h1>
        <p className="breadcrumb">Trang chủ {'>'} Sản phẩm {'>'} Canxi Cơm</p>
      </div>
    </section>
  );
};

export default ProductHero;