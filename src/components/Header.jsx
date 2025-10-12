import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (e, targetId, path, scrollToTop = false) => {
    e.preventDefault();
    navigate(path); // Điều hướng đến path tương ứng
    // Đợi DOM sẵn sàng và scroll
    setTimeout(() => {
      if (scrollToTop) {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll lên đầu trang
      } else if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const headerHeight = 60; // Chiều cao header cố định (bao gồm padding)
          const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: elementPosition - headerHeight, behavior: 'smooth' });
        }
      }
    }, 300); // Tăng thời gian chờ lên 300ms để DOM tải
    if (isOpen) setIsOpen(false); // Đóng menu nếu đang mở
  };

  return (
    <header className="header">
      <div className="header-content">
        <a href="/" className="logo" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          <i className="fas fa-clinic-medical logo-icon"></i>
          <span className="logo-text">Đại Lý Nguyễn Huyền</span>
        </a>
        <nav className={`nav ${isOpen ? 'active' : ''}`}>
          <ul className="nav-list">
            <li>
              <a
                href="/"
                className="nav-link"
                onClick={(e) => handleNavClick(e, null, '/', true)} // Scroll lên đầu trang
              >
                Trang chủ
              </a>
            </li>
            <li>
              <a
                href="/#product"
                className="nav-link"
                onClick={(e) => handleNavClick(e, 'product', '/')}
              >
                Sản phẩm
              </a>
            </li>
            <li>
              <a
                href="/#usage-guide"
                className="nav-link"
                onClick={(e) => handleNavClick(e, 'usage-guide', '/')}
              >
                Cách dùng
              </a>
            </li>
            <li>
              <a
                href="/#unical-info"
                className="nav-link"
                onClick={(e) => handleNavClick(e, 'unical-info', '/')}
              >
                Tác dụng
              </a>
            </li>
            <li>
              <a
                href="/#opinion"
                className="nav-link"
                onClick={(e) => handleNavClick(e, 'opinion', '/')}
              >
                Ý kiến
              </a>
            </li>
            <li>
              <a
                href="/#certificate"
                className="nav-link"
                onClick={(e) => handleNavClick(e, 'certificate', '/')}
              >
                Chứng nhận
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="nav-link"
                onClick={(e) => handleNavClick(e, null, '/contact', true)} // Scroll lên đầu trang
              >
                Liên hệ
              </a>
            </li>
          </ul>
        </nav>
        <div className="header-actions">
          <button onClick={() => setIsOpen(!isOpen)} className="hamburger">
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;