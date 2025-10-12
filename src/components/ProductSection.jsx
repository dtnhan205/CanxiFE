import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

// Mock data fallback nếu API fail (tùy chọn, xóa khi backend ổn định)
const mockProducts = [
  {
    _id: '68e2a6df7eb2c2c3d2e0b3b9',
    name: 'CANXI CƠM',
    stock: 100,
    sold: 0,
    origin: 'Nhật Bản',
    productCode: 'MASO01',
    usage: 'Bổ sung canxi hòa tan dễ hấp thu cho mọi lứa tuổi...',
    originalPrice: 100000,
    discountedPrice: 50000,
    specification: 'Hộp 20 gói * 200mg/gói',
    status: 'active',
    images: [
      'https://res.cloudinary.com/dogfp8dpa/image/upload/v1759684322/products/1759684316770-os64jn.jpg'
    ],
    createdAt: '2025-10-05T17:11:59.855Z',
    updatedAt: '2025-10-05T17:11:59.855Z'
  }
];

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products?limit=3', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers.get('content-type'));

        const contentType = response.headers.get('content-type');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Non-JSON response:', text.substring(0, 200));
          throw new Error('Server trả về không phải JSON (có thể là HTML lỗi)');
        }

        const data = await response.json();
        const filteredProducts = data.products || [];
        setProducts(filteredProducts);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setProducts(mockProducts); // Sử dụng mock data nếu API fail
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      // Cleanup
    };
  }, []);

  if (loading) {
    return (
      <section className="section" id="product">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Sản phẩm - Canxi Cơm</h2>
            <p className="section-subtitle">Bổ sung canxi và vitamin D3 giúp xương chắc khỏe, phù hợp mọi lứa tuổi.</p>
          </div>
          <p>Đang tải sản phẩm...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section" id="product">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Sản phẩm - Canxi Cơm</h2>
            <p className="section-subtitle">Bổ sung canxi và vitamin D3 giúp xương chắc khỏe, phù hợp mọi lứa tuổi.</p>
          </div>
          <p>Lỗi: {error}. Hiển thị dữ liệu tạm thời.</p>
          <div className="product-list">
            {mockProducts.map((product) => (
              <Link
                key={product._id}
                to={`/product-detail/${product._id}`}
                className="product-card-link"
                aria-label={`Xem chi tiết sản phẩm ${product.name}`}
              >
                <ProductCard
                  badge={product.note || 'Mới'}
                  image={product.images?.[0] || '/placeholder-image.jpg'}
                  title={product.name || 'Sản phẩm không tên'}
                  specification={product.specification || 'Chưa có thông tin quy cách'}
                  price={`${product.discountedPrice ? product.discountedPrice.toLocaleString('vi-VN') : product.originalPrice.toLocaleString('vi-VN')} đ`}
                  originalPrice={`${product.originalPrice.toLocaleString('vi-VN')} đ`}
                  _id={product._id} // Truyền _id để ProductCard sử dụng nếu cần
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="section" id="product">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Sản phẩm - Canxi Cơm</h2>
            <p className="section-subtitle">Bổ sung canxi và vitamin D3 giúp xương chắc khỏe, phù hợp mọi lứa tuổi.</p>
          </div>
          <p>Không có sản phẩm nào để hiển thị.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section" id="product">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Sản phẩm - Canxi Cơm</h2>
          <p className="section-subtitle">Bổ sung canxi và vitamin D3 giúp xương chắc khỏe, phù hợp mọi lứa tuổi.</p>
        </div>
        <div className="product-list">
          {products.map((product) => {
            console.log('Product ID for link:', product._id); // Log để debug
            return (
              <Link
                key={product._id}
                to={`/product-detail/${product._id}`} // Đảm bảo dùng _id
                className="product-card-link"
                aria-label={`Xem chi tiết sản phẩm ${product.name}`}
              >
                <ProductCard
                  badge={product.note || 'Mới'}
                  image={product.images?.[0] || '/placeholder-image.jpg'}
                  title={product.name || 'Sản phẩm không tên'}
                  specification={product.specification || 'Chưa có thông tin quy cách'}
                  price={`${product.discountedPrice ? product.discountedPrice.toLocaleString('vi-VN') : product.originalPrice.toLocaleString('vi-VN')} đ`}
                  originalPrice={`${product.originalPrice.toLocaleString('vi-VN')} đ`}
                  _id={product._id} // Truyền _id
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;