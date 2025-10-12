import React, { useState, useEffect } from 'react';

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [totalSold, setTotalSold] = useState(0);

  // Gọi API để lấy tổng số lượng đã bán của tất cả sản phẩm
  useEffect(() => {
    const fetchTotalSold = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Lỗi khi gọi API: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Dữ liệu từ API:', data); // Log dữ liệu để debug

        // Lấy danh sách sản phẩm từ trường 'products' trong data
        const products = Array.isArray(data.products) ? data.products : [];
        console.log('Danh sách sản phẩm:', products); // Log danh sách sản phẩm

        // Tính tổng số lượng đã bán
        const total = products.reduce((sum, item) => {
          console.log('Sản phẩm hiện tại:', item, 'sold:', item.sold); // Log từng sản phẩm và sold
          return sum + (item.sold || 0);
        }, 0);
        setTotalSold(total);
        console.log('Tổng số lượng đã bán:', total); // Log tổng cuối cùng
      } catch (err) {
        console.error('Lỗi khi lấy tổng số lượng đã bán:', err);
        setTotalSold(0); // Đặt về 0 nếu có lỗi
      }
    };

    fetchTotalSold();
  }, []);

  return (
    <div className="detail-product-tabs">
      <div className="detail-tab-buttons">
        <button
          className={`detail-tab-btn ${activeTab === 'description' ? 'active' : ''}`}
          data-tab="description"
          onClick={() => setActiveTab('description')}
        >
          Mô tả
        </button>
        <button
          className={`detail-tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          data-tab="info"
          onClick={() => setActiveTab('info')}
        >
          Thông tin
        </button>
      </div>
      <div
        className={`detail-tab-content ${activeTab === 'description' ? 'active' : ''}`}
        id="description"
      >
        <h2>Mô tả sản phẩm</h2>
        <p>{product.usage || 'Chưa có mô tả'}</p>
      </div>
      <div
        className={`detail-tab-content ${activeTab === 'info' ? 'active' : ''}`}
        id="info"
      >
        <h2>Thông tin chi tiết</h2>
        <p>
          <strong>Xuất xứ:</strong> {product.origin || 'Chưa có thông tin'}
        </p>
        <p>
          <strong>Đóng gói:</strong> {product.specification || 'Chưa có thông tin'}
        </p>
        <p>
          <strong>Mã sản phẩm:</strong> {product.productCode || 'Chưa có thông tin'}
        </p>
        <p>
          <strong>Số lượng còn lại:</strong> {product.stock || 0}
        </p>
        
      </div>
    </div>
  );
};

export default ProductTabs;