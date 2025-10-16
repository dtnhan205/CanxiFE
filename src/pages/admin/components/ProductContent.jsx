import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock data fallback nếu API fail (có thể xóa khi backend ổn định)
const mockProducts = [
  {
    _id: 'mock-1',
    name: 'Canxi Cơm Nhật Bản',
    stock: 125,
    sold: 75,
    origin: 'Nhật Bản',
    productCode: 'CAL001',
    originalPrice: 450000,
    discountPrice: 405000,
    specification: 'Bổ sung canxi từ cơm Nhật Bản, dễ hấp thụ',
    status: 'active',
    images: ['https://via.placeholder.com/50?text=CAL001'],
    createdAt: '2025-09-23T19:27:04.859Z',
    updatedAt: '2025-09-23T19:27:04.859Z'
  },
  {
    _id: 'mock-2',
    name: 'Vitamin D3 + K2',
    stock: 89,
    sold: 45,
    origin: 'Việt Nam',
    productCode: 'VIT002',
    originalPrice: 320000,
    discountPrice: 288000,
    specification: 'Kết hợp vitamin D3 và K2 hỗ trợ xương chắc khỏe',
    status: 'active',
    images: ['https://via.placeholder.com/50?text=VIT002'],
    createdAt: '2025-09-24T10:15:30.123Z',
    updatedAt: '2025-09-24T10:15:30.123Z'
  },
  {
    _id: 'mock-3',
    name: 'Canxi Hữu Cơ Tảo Biển',
    stock: 0,
    sold: 120,
    origin: 'Nhật Bản',
    productCode: 'CAL003',
    originalPrice: 520000,
    discountPrice: 468000,
    specification: 'Canxi hữu cơ từ tảo biển, không chất bảo quản',
    status: 'inactive',
    images: ['https://via.placeholder.com/50?text=CAL003'],
    createdAt: '2025-09-22T14:30:45.678Z',
    updatedAt: '2025-09-25T09:00:00.000Z'
  },
  {
    _id: 'mock-4',
    name: 'Collagen Type 1 & 3',
    stock: 42,
    sold: 30,
    origin: 'Việt Nam',
    productCode: 'COL004',
    originalPrice: 680000,
    discountPrice: 612000,
    specification: 'Collagen loại 1&3 hỗ trợ da và xương',
    status: 'active',
    images: ['https://via.placeholder.com/50?text=COL004'],
    createdAt: '2025-09-23T11:45:20.456Z',
    updatedAt: '2025-09-23T11:45:20.456Z'
  }
];

const ProductContent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const navigate = useNavigate();

  // Fetch products từ API với query params
  const fetchProducts = async (page = currentPage, search = searchTerm, category = selectedCategory, status = selectedStatus) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: search || '',
        ...(category && { category }),
        ...(status && { status })
      });

      const apiUrl = `https://canxiapi.site/api/products/?${params.toString()}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error('API trả về không phải JSON');
      }

      const data = await response.json();

      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      } else {
        throw new Error('Dữ liệu trả về không đúng định dạng');
      }
    } catch (err) {
      setError(err.message);
      setProducts(mockProducts);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, searchTerm, selectedCategory, selectedStatus);
  }, [searchTerm, selectedCategory, selectedStatus]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchProducts(newPage, searchTerm, selectedCategory, selectedStatus);
    }
  };

  const handleButtonClick = async (action, productIndex = null) => {
    const product = products[productIndex];
    if (action === 'Thêm sản phẩm') {
      navigate('/admin/products/create');
    } else if (action === 'Lọc') {
      fetchProducts(currentPage, searchTerm, selectedCategory, selectedStatus);
    } else if (action === 'Sửa') {
      navigate(`/admin/products/edit/${product?._id}`);
    } else if (action === 'Xóa') {
      if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product?.name}"?`)) {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            alert('Vui lòng đăng nhập để thực hiện xóa.');
            navigate('/admin/login');
            return;
          }

          const response = await fetch(`https://canxiapi.site/api/products/${product?._id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          const responseData = await response.json();
          if (!response.ok) throw new Error(responseData.error || 'Không thể xóa sản phẩm');

          alert('Xóa sản phẩm thành công!');
          // Làm mới danh sách sau khi xóa
          fetchProducts(currentPage, searchTerm, selectedCategory, selectedStatus);
        } catch (err) {
          alert(`Lỗi khi xóa sản phẩm: ${err.message}`);
        }
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.origin === selectedCategory;
    const matchesStatus = !selectedStatus || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div id="products" className="content-section active">
        <div className="loading-container">
          <p>Đang tải danh sách sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="products" className="content-section active">
      {error && (
        <div className="error-banner">
          <p>Lỗi khi tải dữ liệu: {error}</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      )}
      <div className="header">
        <button className="btn-admin-product btn-admin-product-confirm" onClick={() => handleButtonClick('Thêm sản phẩm')}>
          <i className="fas fa-plus"></i> Thêm sản phẩm
        </button>
      </div>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleButtonClick('Lọc')}
        />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">Tất cả xuất xứ</option>
          <option value="Nhật Bản">Nhật Bản</option>
          <option value="Việt Nam">Việt Nam</option>
          <option value="Khác">Khác</option>
        </select>
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>
        <button className="btn-admin-product btn-admin-product-confirm" onClick={() => handleButtonClick('Lọc')}>
          Lọc
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Xuất xứ</th>
              <th>Mã sản phẩm</th>
              <th>Giá gốc</th>
              <th>Giá KM</th>
              <th>Số lượng</th>
              <th>Đã bán</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={product._id || index}>
                <td>
                  <img 
                    src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/50'} 
                    alt="Product" 
                    className="product-img" 
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.origin}</td>
                <td>{product.productCode}</td>
                <td>{product.originalPrice?.toLocaleString()} VNĐ</td>
                <td>{product.discountPrice?.toLocaleString()} VNĐ</td>
                <td>{product.stock}</td>
                <td>{product.sold || 0}</td>
                <td>
                  <span className={`status ${product.status}`}>
                    {product.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </td>
                <td className="action-buttons">
                  <button className="btn-admin-product btn-admin-product-edit" onClick={() => handleButtonClick('Sửa', index)}>Sửa</button>
                  <button className="btn-admin-product btn-admin-product-delete" onClick={() => handleButtonClick('Xóa', index)}>Xóa</button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', color: '#999' }}>Không tìm thấy sản phẩm nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Trước
          </button>
          <span>Trang {currentPage} / {totalPages}</span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductContent;