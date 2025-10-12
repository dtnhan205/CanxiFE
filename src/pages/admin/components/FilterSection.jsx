import React from 'react';

const FilterSection = () => {
  return (
    <div className="filter-section">
      <input type="text" placeholder="Tìm kiếm sản phẩm..." />
      <select>
        <option value="">Tất cả danh mục</option>
        <option value="calcium">Canxi</option>
        <option value="vitamin">Vitamin</option>
        <option value="other">Khác</option>
      </select>
      <select>
        <option value="">Tất cả trạng thái</option>
        <option value="in-stock">Còn hàng</option>
        <option value="out-of-stock">Hết hàng</option>
      </select>
      <button className="btn btn-confirm">Lọc</button>
    </div>
  );
};

export default FilterSection;