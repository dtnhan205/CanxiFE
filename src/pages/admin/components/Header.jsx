import React from 'react';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case '/admin':
      case '/admin/dashboard':
        return 'Tổng quan';
      case '/admin/products':
        return 'Quản lý sản phẩm';
      case '/admin/orders':
        return 'Quản lý đơn hàng';
      case '/admin/contacts':
        return 'Quản lý liên hệ';
      default:
        return 'Admin Panel';
    }
  };

  return (
    <div
      className="header"
      style={{
        margin: '20px',
      }}
    >
      <h1 style={{ fontSize: '30px', color: '#333', margin: 0 }}>{getTitle()}</h1>

      <div
        className="user-info"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          className="user-avatar"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#007bff',
            color: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
          }}
        >
          AD
        </div>
        <span style={{ fontSize: '16px', color: '#555' }}>Admin User</span>
      </div>
    </div>
  );
};

export default Header;
