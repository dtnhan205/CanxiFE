import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    stock: '',
    origin: '',
    productCode: '',
    originalPrice: '',
    discountPrice: '', // Không bắt buộc, có thể để trống
    specification: '',
    usage: '',
    status: 'active', // Giá trị mặc định hợp lệ
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]); // Array { url, isLocal, index }
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://160.187.246.95:3000/api/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const productData = await response.json();
        if (!response.ok) throw new Error(productData.error || 'Không thể tải sản phẩm');

        // Làm sạch và kiểm tra status từ API
        let statusFromApi = productData.status && productData.status.length > 0 ? productData.status[0] : 'active';
        if (statusFromApi !== 'active' && statusFromApi !== 'inactive') {
          console.warn(`Trạng thái không hợp lệ "${statusFromApi}" từ API, gán mặc định "active"`);
          statusFromApi = 'active'; // Gán giá trị mặc định nếu không hợp lệ
        }

        setFormData({
          ...productData,
          status: statusFromApi,
          discountPrice: productData.discountedPrice || '', // Đặt giá trị mặc định nếu không có
        });
        // Set existing images as previews (URLs)
        const existingPreviews = productData.images.map((url, index) => ({
          url,
          isLocal: false,
          index,
        }));
        setImagePreviews(existingPreviews);
        setLoading(false);
      } catch (error) {
        alert(`Không thể tải dữ liệu sản phẩm: ${error.message}`);
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreviews.length > 4) { // Giới hạn 4 ảnh theo schema
      alert('Tối đa 4 hình ảnh!');
      return;
    }
    const newPreviews = [];
    const newImages = [];

    files.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert(`Hình ${file.name} quá lớn (tối đa 2MB)`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push({
          url: reader.result,
          isLocal: true,
          index: imagePreviews.length + newPreviews.length,
        });
        newImages.push(file);
        if (newPreviews.length === files.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
          setFormData({ ...formData, images: [...formData.images, ...newImages] });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== indexToRemove);
    const newImages = formData.images.filter((_, i) => i !== indexToRemove);
    setImagePreviews(newPreviews);
    setFormData({ ...formData, images: newImages });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Tên sản phẩm là bắt buộc';
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Số lượng phải là số dương';
    if (!formData.origin.trim()) newErrors.origin = 'Xuất xứ là bắt buộc';
    if (!formData.productCode.trim()) newErrors.productCode = 'Mã sản phẩm là bắt buộc';
    if (!formData.originalPrice || formData.originalPrice <= 0) newErrors.originalPrice = 'Giá gốc phải lớn hơn 0';
    if (formData.discountPrice && parseFloat(formData.discountPrice) < 0) newErrors.discountPrice = 'Giá khuyến mãi không được nhỏ hơn 0';
    if (formData.discountPrice && parseFloat(formData.discountPrice) > parseFloat(formData.originalPrice)) newErrors.discountPrice = 'Giá khuyến mãi không thể lớn hơn giá gốc';
    if (!formData.specification.trim() || formData.specification.length > 200) newErrors.specification = 'Quy cách là bắt buộc và không được vượt quá 200 ký tự';
    if (!formData.usage.trim()) newErrors.usage = 'Công dụng là bắt buộc';
    if (imagePreviews.length === 0) newErrors.images = 'Cần ít nhất một hình ảnh';
    if (formData.status !== 'active' && formData.status !== 'inactive') {
      newErrors.status = 'Trạng thái phải là "active" hoặc "inactive"';
      setFormData({ ...formData, status: 'active' }); // Gán lại giá trị hợp lệ
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      setSubmitLoading(false);
      return;
    }

    const data = new FormData();
    data.append('name', formData.name.trim());
    data.append('stock', parseInt(formData.stock));
    data.append('origin', formData.origin.trim());
    data.append('productCode', formData.productCode.trim());
    data.append('originalPrice', parseInt(formData.originalPrice));
    if (formData.discountPrice) data.append('discountedPrice', parseInt(formData.discountPrice));
    data.append('specification', formData.specification.trim());
    data.append('usage', formData.usage.trim());
    data.append('status', formData.status); // Đã được validate
    imagePreviews.forEach((preview, index) => {
      if (preview.isLocal) {
        data.append('images', formData.images[index]);
      } else {
        data.append('existingImages', preview.url);
      }
    });

    try {
      const response = await fetch(`http://160.187.246.95:3000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.error || 'Failed to update product');

      alert('Sản phẩm đã được cập nhật thành công!');
      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (err) {
      setErrors({ ...errors, apiError: err.message || 'Đã xảy ra lỗi khi cập nhật sản phẩm.' });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="product-form-container">
        <div className="loading">Đang tải dữ liệu sản phẩm...</div>
      </div>
    );
  }

  return (
    <div className="product-form-container">
      <div className="product-form-header">
        <h2>Chỉnh sửa sản phẩm</h2>
        <p className="product-id">ID: {id}</p>
        {errors.apiError && <div className="api-error">{errors.apiError}</div>}
      </div>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-section">
          <h3><i className="fas fa-info-circle"></i> Thông tin cơ bản</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name"><i className="fas fa-tag"></i> Tên sản phẩm <span className="required">*</span></label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Nhập tên sản phẩm" className={errors.name ? 'error' : ''} required />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="productCode"><i className="fas fa-barcode"></i> Mã sản phẩm <span className="required">*</span></label>
              <input type="text" id="productCode" name="productCode" value={formData.productCode} onChange={handleChange} placeholder="Nhập mã sản phẩm (ví dụ: ABC)" className={errors.productCode ? 'error' : ''} required />
              {errors.productCode && <span className="error-message">{errors.productCode}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="origin"><i className="fas fa-globe"></i> Xuất xứ <span className="required">*</span></label>
              <input type="text" id="origin" name="origin" value={formData.origin} onChange={handleChange} placeholder="Nhập xuất xứ (ví dụ: Nhật Bản)" className={errors.origin ? 'error' : ''} required />
              {errors.origin && <span className="error-message">{errors.origin}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="stock"><i className="fas fa-boxes"></i> Số lượng tồn kho <span className="required">*</span></label>
              <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} placeholder="Nhập số lượng (ví dụ: 100)" min="0" className={errors.stock ? 'error' : ''} required />
              {errors.stock && <span className="error-message">{errors.stock}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3><i className="fas fa-dollar-sign"></i> Giá cả</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="originalPrice"><i className="fas fa-tag"></i> Giá gốc (VNĐ) <span className="required">*</span></label>
              <input type="number" id="originalPrice" name="originalPrice" value={formData.originalPrice} onChange={handleChange} placeholder="Nhập giá gốc (ví dụ: 1200000)" min="0" className={errors.originalPrice ? 'error' : ''} required />
              {errors.originalPrice && <span className="error-message">{errors.originalPrice}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="discountPrice"><i className="fas fa-percent"></i> Giá khuyến mãi (VNĐ)</label>
              <input type="number" id="discountPrice" name="discountPrice" value={formData.discountPrice} onChange={handleChange} placeholder="Nhập giá khuyến mãi (tùy chọn)" min="0" className={errors.discountPrice ? 'error' : ''} />
              {errors.discountPrice && <span className="error-message">{errors.discountPrice}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3><i className="fas fa-cogs"></i> Chi tiết sản phẩm</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="specification"><i className="fas fa-info-circle"></i> Quy cách <span className="required">*</span></label>
              <textarea id="specification" name="specification" value={formData.specification} onChange={handleChange} placeholder="Nhập quy cách (tối đa 200 ký tự)" rows="4" className={errors.specification ? 'error' : ''} required />
              {errors.specification && <span className="error-message">{errors.specification}</span>}
              <small className="form-help-text">Mô tả chi tiết về sản phẩm, lợi ích, cách sử dụng</small>
            </div>
            <div className="form-group">
              <label htmlFor="usage"><i className="fas fa-info-circle"></i> Công dụng <span className="required">*</span></label>
              <textarea id="usage" name="usage" value={formData.usage} onChange={handleChange} placeholder="Nhập công dụng" rows="2" className={errors.usage ? 'error' : ''} required />
              {errors.usage && <span className="error-message">{errors.usage}</span>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="status"><i className="fas fa-toggle-on"></i> Trạng thái <span className="required">*</span></label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} className={errors.status ? 'error' : ''} required>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
            {errors.status && <span className="error-message">{errors.status}</span>}
          </div>
          <div className="form-group full-width">
            <label htmlFor="images"><i className="fas fa-images"></i> Hình ảnh sản phẩm <span className="required">*</span></label>
            <input type="file" id="images" name="images" accept="image/*" multiple onChange={handleImageChange} className={errors.images ? 'error' : ''} />
            {errors.images && <span className="error-message">{errors.images}</span>}
            <small className="form-help-text">Chọn nhiều hình ảnh (từ 1 đến 4 hình, kích thước &lt; 2MB mỗi hình)</small>
            <div className="image-preview-container">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="image-preview-item">
                  <img src={preview.url} alt="Preview" className="image-preview" />
                  <button type="button" onClick={() => removeImage(index)} className="remove-image-btn">×</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-formadmin btn-secondary" onClick={() => window.history.back()}>
            <i className="fas fa-arrow-left"></i> Hủy
          </button>
          <button type="submit" className="btn-formadmin btn-primary" disabled={submitLoading}>
            {submitLoading ? <><i className="fas fa-spinner fa-spin"></i> Đang cập nhật...</> : <><i className="fas fa-save"></i> Cập nhật sản phẩm</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;