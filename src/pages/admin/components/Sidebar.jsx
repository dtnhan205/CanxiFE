import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { withAuth } from '../../../utils/authUtils'; // Đảm bảo đã import HOC

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Lấy trang hiện tại từ /admin/{page}, nếu không có thì mặc định là 'dashboard'
  const activePage = location.pathname.split('/')[2] || 'dashboard';

  const menuItems = [
    { id: 'dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { id: 'products', icon: 'fas fa-box', label: 'Sản phẩm' },
    { id: 'orders', icon: 'fas fa-shopping-cart', label: 'Đơn hàng' },
    { id: 'contacts', icon: 'fas fa-envelope', label: 'Liên hệ' },
  ];

  const handleNavigation = (target) => {
    navigate(`/admin/${target}`); // Điều hướng đến /admin/{target}
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Xóa token
    navigate('/admin/login'); // Chuyển hướng về trang đăng nhập
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <i className="fas fa-cube"></i>
        <h2>Admin Panel</h2>
      </div>
      <div className="sidebar-menu">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={item.id === activePage ? 'active' : ''}
              onClick={() => handleNavigation(item.id)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default withAuth(Sidebar); // Bọc với withAuth