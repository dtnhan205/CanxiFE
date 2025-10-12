import React from 'react';

const TopBar = () => {
  return (
    <div className="top-bar">
      <div className="container top-bar-content">
        <div className="contact-info">
          <a href="tel:0123456789" className="top-bar-link">
            <i className="fas fa-phone"></i>
            <span>0862766839</span>
          </a>
          <a href="mailto:info@spanguyenhuyen.com" className="top-bar-link">
            <i className="fas fa-envelope"></i>
            <span>dailynguyenhuyen@gmail.com</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;