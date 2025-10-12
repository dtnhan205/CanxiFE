import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// API địa chỉ Việt Nam
const fetchProvinces = async () => {
  const response = await fetch('https://provinces.open-api.vn/api/?depth=2');
  if (!response.ok) throw new Error('Không thể tải danh sách địa chỉ.');
  return response.json();
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const checkoutPopupRef = useRef(null); // Ref cho popup thanh toán
  const successPopupRef = useRef(null); // Ref cho popup thành công
  const [product, setProduct] = useState(null);
  const [boxCount, setBoxCount] = useState(1);
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    province: '',
    district: '',
    address: '',
    note: '',
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [totalSold, setTotalSold] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    console.log('Received id:', id);

    if (!id) {
      console.error('ID is undefined. Redirecting to home.');
      setError('Không tìm thấy ID sản phẩm. Vui lòng kiểm tra đường dẫn.');
      setLoading(false);
      navigate('/');
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/products/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);
        console.log('Response body:', await response.clone().text());

        const contentType = response.headers.get('content-type');
        if (!response.ok) {
          throw new Error(`Lỗi HTTP! Trạng thái: ${response.status} - ${await response.text()}`);
        }
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server trả về không phải JSON');
        }

        const data = await response.json();
        console.log('Fetched data:', data);
        if (!data || typeof data !== 'object') {
          throw new Error('Dữ liệu trả về không hợp lệ');
        }
        setProduct(data);
        if (data.name && /combo.*10/i.test(data.name)) {
          setBoxCount(10);
        } else if (data.name && /combo.*5/i.test(data.name)) {
          setBoxCount(5);
        }
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm:', err);
        setError(err.message || 'Lỗi máy chủ.');
        setLoading(false);
      }
    };

    const loadProvinces = async () => {
      try {
        const data = await fetchProvinces();
        setProvinces(data);
      } catch (err) {
        setError(err.message);
      }
    };

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

    fetchProduct();
    loadProvinces();
    fetchTotalSold();
  }, [id, navigate]);

  // Xử lý click ngoài popup để đóng
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (checkoutPopupRef.current && !checkoutPopupRef.current.contains(event.target)) {
        setShowCheckoutPopup(false);
        setError(null);
      }
      if (successPopupRef.current && !successPopupRef.current.contains(event.target)) {
        setShowSuccessPopup(false);
      }
    };

    if (showCheckoutPopup || showSuccessPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCheckoutPopup, showSuccessPopup]);

  const handleBoxChange = (e) => {
    setBoxCount(parseInt(e.target.value, 10));
  };

  const handleAddToCart = () => {
    if (product) {
      console.log(`Đã thêm ${boxCount} ${product.name} vào giỏ hàng!`);
    } else {
      console.log(`Đã thêm ${boxCount} sản phẩm vào giỏ hàng!`);
    }
  };

  const handleThumbnailClick = (index) => {
    setActiveThumbIndex(index);
    const mainImage = document.querySelector('.detail-gallery-main');
    if (mainImage && product.images[index]) {
      mainImage.src = product.images[index];
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'province' && provinces.length > 0) {
      const province = provinces.find(p => p.code === parseInt(value));
      setDistricts(province?.districts || []);
      setFormData(prev => ({ ...prev, district: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.province || !formData.district) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    try {
      const unitPrice = product.discountedPrice || product.originalPrice || 0;
      const totalPrice = product.name?.toLowerCase().includes('combo') ? unitPrice : unitPrice * boxCount;
      const orderData = {
        productId: product._id,
        productName: product.name,
        boxCount,
        totalPrice,
        fullName: formData.fullName,
        phone: formData.phone,
        address: `${formData.address}, ${districts.find(d => d.code === parseInt(formData.district))?.name || ''}, ${provinces.find(p => p.code === parseInt(formData.province))?.name || ''}`,
        note: formData.note,
      };

      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Đặt hàng thất bại.');
      }

      setShowCheckoutPopup(false);
      setShowSuccessPopup(true);
      setError(null);
      setFormData({
        fullName: '',
        phone: '',
        province: '',
        district: '',
        address: '',
        note: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBuyNow = () => {
    setShowCheckoutPopup(true);
  };

  const closeCheckoutPopup = () => {
    setShowCheckoutPopup(false);
    setError(null);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    navigate('/');
  };

  if (loading) {
    return <div className="detail-container"><p>Đang tải chi tiết sản phẩm...</p></div>;
  }

  if (error && !showCheckoutPopup) {
    return (
      <div className="detail-container">
        <p>Lỗi: {error}. <button onClick={() => navigate('/')}>Quay lại trang chủ</button></p>
      </div>
    );
  }

  if (!product) {
    return <div className="detail-container"><p>Sản phẩm không tồn tại.</p></div>;
  }

  const isSingleProduct = !product.name?.toLowerCase().includes('combo');
  const displayBoxCount = isSingleProduct ? boxCount : (/10/i.test(product.name) ? 10 : /5/i.test(product.name) ? 5 : 1);
  const unitPrice = product.discountedPrice || product.originalPrice || 0;
  const displayPrice = isSingleProduct ? unitPrice * boxCount : unitPrice;

  return (
    <div className="detail-container">
      <div className="detail-product-detail">
        <div className="detail-product-gallery">
          <img
            className="detail-gallery-main"
            src={product.images?.[activeThumbIndex] || '/image/chitiet1.jpg'}
            alt={product.name || 'Canxi Cơm'}
          />
          <div className="detail-gallery-thumbs">
            {product.images?.map((img, index) => (
              <img
                key={index}
                className={`detail-thumb ${index === activeThumbIndex ? 'active' : ''}`}
                src={img}
                alt={`${product.name || 'Canxi Cơm'} Thumb ${index + 1}`}
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </div>
        </div>
        <div className="detail-product-info">
          <h1 className="detail-product-title">{product.name || 'Sản phẩm không tên'}</h1>
          <div className="detail-product-specification">Thông tin đóng gói: {product.specification || 'Chưa có thông tin'}</div>
          <div className="detail-product-price">
            <span className="detail-current-price">
              {product.discountedPrice
                ? `${product.discountedPrice.toLocaleString('vi-VN')}đ`
                : `${product.originalPrice?.toLocaleString('vi-VN') || '0'}đ`}
            </span>
            <span className="detail-original-price">{`${product.originalPrice?.toLocaleString('vi-VN') || '0'}đ`}</span>
          </div>
          <p className="detail-total-sold">Đã bán: {totalSold}</p>
          <p className="detail-product-description"><strong>Mô tả sản phẩm:</strong> {product.usage || 'Chưa có mô tả'}</p>
          <p><strong>Xuất xứ:</strong> {product.origin || 'Chưa có thông tin'}</p>
          <p><strong>Mã sản phẩm:</strong> {product.productCode || 'Chưa có thông tin'}</p>
          <p><strong>Số lượng còn lại:</strong> {product.stock || 0}</p>
          <div className="detail-product-quantity">
            {isSingleProduct && (
              <>
                <label>Số hộp:</label>
                <select value={boxCount} onChange={handleBoxChange} className="detail-box-select">
                  <option value={1}>1 hộp</option>
                  <option value={5}>5 hộp</option>
                  <option value={10}>10 hộp</option>
                </select>
              </>
            )}
            {!isSingleProduct && (
              <p>Số hộp: {displayBoxCount} hộp</p>
            )}
          </div>
          <button className="detail-add-to-cart" onClick={handleBuyNow}>
            <i className="fas fa-shopping-cart"></i> Mua ngay
          </button>
        </div>
      </div>

      {showCheckoutPopup && (
        <div className="popup-overlay">
          <div className="popup-content-checkout" ref={checkoutPopupRef}>
            <h2>Thanh toán</h2>
            <div className="checkout-product">
              <img src={product.images[activeThumbIndex] || product.images[0]} alt={product.name} className="checkout-product-image" />
              <div>
                <h3>{product.name}</h3>
                <p>Số hộp: {boxCount}</p>
                <p>Giá: {displayPrice.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-column">
                <div className="form-group">
                  <label>Họ và tên *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Tỉnh/Thành phố *</label>
                  <select name="province" value={formData.province} onChange={handleChange} required>
                    <option value="">Chọn tỉnh/thành</option>
                    {provinces.map(province => (
                      <option key={province.code} value={province.code}>{province.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Địa chỉ chi tiết (số nhà, đường, phường/xã) *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Ví dụ: 123 Đường Láng, Phường Láng Thượng"
                  />
                </div>
              </div>
              <div className="form-column">
                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Quận/Huyện *</label>
                  <select name="district" value={formData.district} onChange={handleChange} required disabled={!formData.province}>
                    <option value="">Chọn quận/huyện</option>
                    {districts.map(district => (
                      <option key={district.code} value={district.code}>{district.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Ghi chú</label>
                  <textarea name="note" value={formData.note} onChange={handleChange}></textarea>
                </div>
              </div>
              <button type="submit" className="checkout-button">Đặt hàng ngay</button>
              {error && <p className="checkout-error">{error}</p>}
            </form>
            <button className="popup-close" onClick={closeCheckoutPopup}>Đóng</button>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-content-success" ref={successPopupRef}>
            <h2>Đặt hàng thành công</h2>
            <p>Chúng tôi sẽ liên hệ để xác nhận đơn hàng.</p>
            <button className="back-home-button" onClick={closeSuccessPopup}>
              Quay lại trang chủ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;