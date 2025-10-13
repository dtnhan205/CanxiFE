import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin/LoginAdmin.css';

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // Xóa lỗi khi người dùng nhập lại
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation cơ bản
    if (!formData.username || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    try {
      const response = await fetch('http://160.187.246.95:3000/api/admins/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại.');
      }

      // Lưu token vào localStorage (giả định backend trả về token trong data.token)
      localStorage.setItem('token', data.token);
      setError('');
      alert('Đăng nhập thành công!');
      navigate('/admin'); // Chuyển hướng đến trang admin
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Đăng nhập Admin</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Tài khoản</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập tài khoản của bạn"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;