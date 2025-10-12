import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavClick = (e, targetId, path, scrollToTop = false) => {
    e.preventDefault();
    navigate(path);
    setTimeout(() => {
      if (scrollToTop) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const headerHeight = 60;
          const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: elementPosition - headerHeight, behavior: 'smooth' });
        }
      }
    }, 300);
  };

  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Cột 1 */}
          <div className="footer-column">
            <h3>Về chúng tôi</h3>
            <p>Đại Lý Nguyễn Huyền - Cung cấp Canxi Cơm chính hãng, hỗ trợ sức khỏe xương tối ưu.</p>
            <div className="social-icons">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/15GWbBhrQt7/?mibextid=wwXIfr"
                className="social-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/512px-2021_Facebook_icon.svg.png"
                  alt="Facebook"
                  style={{ width: '22px', height: '22px'}}
                />
              </a>

              {/* Zalo */}
              <a
                href="https://zalo.me/0862766839"
                className="social-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
                  alt="Zalo"
                  style={{ width: '22px', height: '22px' }}
                />
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@nguyenhuyenthaoduoc"
                className="social-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://cdn4.iconfinder.com/data/icons/social-media-flat-7/64/Social-media_Tiktok-512.png"
                  alt="TikTok"
                  style={{ width: '22px', height: '22px'}}
                />
              </a>
            </div>
          </div>

          {/* Cột 2: Liên kết điều hướng */}
          <div className="footer-column">
            <h3>Khám phá</h3>
            <ul className="footer-links">
              <li>
                <a href="/#usage-guide" onClick={(e) => handleNavClick(e, 'usage-guide', '/')}>
                  <i className="fas fa-chevron-right"></i> Cách sử dụng
                </a>
              </li>
              <li>
                <a href="/#unical-info" onClick={(e) => handleNavClick(e, 'unical-info', '/')}>
                  <i className="fas fa-chevron-right"></i> Tác dụng sản phẩm
                </a>
              </li>
              <li>
                <a href="/#opinion" onClick={(e) => handleNavClick(e, 'opinion', '/')}>
                  <i className="fas fa-chevron-right"></i> Ý kiến chuyên gia
                </a>
              </li>
              <li>
                <a href="/#bandean818" onClick={(e) => handleNavClick(e, 'bandean818', '/')}>
                  <i className="fas fa-chevron-right"></i> Ban đề án 818
                </a>
              </li>
              <li>
                <a href="/#unique" onClick={(e) => handleNavClick(e, 'unique', '/')}>
                  <i className="fas fa-chevron-right"></i> Sự độc đáo của sản phẩm
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ */}
          <div className="footer-column">
            <h3>Liên hệ</h3>
            <ul className="footer-contact">
              <li><i className="fas fa-map-marker-alt"></i> Đắk lim, Đăk ơ, Đồng Nai</li>
              <li><i className="fas fa-phone"></i> 0862 766 839</li>
              <li><i className="fas fa-envelope"></i> dailynguyenhuyen@gmail.com</li>
              <li><i className="fas fa-clock"></i> Thứ 2 - CN: 7:00 - 21:00</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Dailynguyenhuyen. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
