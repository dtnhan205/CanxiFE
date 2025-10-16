import React, { useState, useEffect, useRef } from 'react';

const ContactContent = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    sdt: '',
    message: ''
  });
  const [captcha, setCaptcha] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [status, setStatus] = useState({ loading: false, success: false, error: null });
  const [showPopup, setShowPopup] = useState(false);
  const [popupTimeout, setPopupTimeout] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    email: '',
    sdt: '',
    captcha: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showErrors, setShowErrors] = useState(false); // State để control hiển thị lỗi
  const captchaButtonRef = useRef(null);

  // Tạo mã CAPTCHA ngẫu nhiên khi component mount
  useEffect(() => {
    generateCaptcha();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (status.success || status.error) {
      setShowPopup(true);
      const timeoutId = setTimeout(() => {
        setShowPopup(false);
        setStatus((prev) => ({ ...prev, success: false, error: null }));
      }, 6000);

      setPopupTimeout(timeoutId);
      
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }
  }, [status.success, status.error]);

  // Hàm kiểm tra số điện thoại Việt Nam
  const isValidVietnamPhone = (phone) => {
    if (!phone) return true; // Không bắt buộc
    
    const cleanedPhone = phone.replace(/[\s\-\(\)\.]+/g, '');
    const vietnamPhoneRegex = /^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
    
    return vietnamPhoneRegex.test(cleanedPhone);
  };

  // Hàm kiểm tra email hợp lệ (bao gồm Gmail)
  const isValidEmail = (email) => {
    if (!email) return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    
    const gmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@gmail\.com$/;
    if (email.toLowerCase().endsWith('@gmail.com')) {
      return gmailRegex.test(email);
    }
    
    return true;
  };

  // Hàm định dạng số điện thoại khi nhập
  const formatPhoneNumber = (value) => {
    if (!value) return '';
    
    const numbers = value.replace(/\D/g, '');
    if (numbers.length > 11) return numbers.slice(0, 11);
    
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
    return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7)}`;
  };

  // Hàm validate (không hiển thị lỗi realtime nữa)
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          error = 'Vui lòng nhập họ và tên.';
        } else if (value.trim().length < 2) {
          error = 'Họ và tên phải có ít nhất 2 ký tự.';
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value.trim())) {
          error = 'Họ và tên chỉ được chứa chữ cái và khoảng trắng.';
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          error = 'Vui lòng nhập email.';
        } else if (!isValidEmail(value.trim())) {
          if (value.toLowerCase().endsWith('@gmail.com')) {
            error = 'Địa chỉ Gmail không hợp lệ.';
          } else {
            error = 'Địa chỉ email không hợp lệ.';
          }
        }
        break;
        
      case 'sdt':
        if (value && !isValidVietnamPhone(value)) {
          error = 'Số điện thoại không hợp lệ. Ví dụ: 0912 345 678 hoặc 0123 456 789';
        }
        break;
        
      case 'captcha':
        if (!value) {
          error = 'Vui lòng nhập mã CAPTCHA.';
        } else if (value !== captcha) {
          error = 'Mã CAPTCHA không đúng.';
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  // Hàm validate toàn bộ form
  const validateForm = () => {
    const errors = {
      fullName: validateField('fullName', formData.fullName),
      email: validateField('email', formData.email),
      sdt: validateField('sdt', formData.sdt),
      captcha: validateField('captcha', userCaptcha)
    };

    setFieldErrors(errors);
    return errors;
  };

  // Hàm chống copy/paste cho CAPTCHA
  const handleCaptchaPaste = (e) => {
    e.preventDefault();
    return false;
  };

  const handleCaptchaCopy = (e) => {
    e.preventDefault();
    return false;
  };

  const handleCaptchaCut = (e) => {
    e.preventDefault();
    return false;
  };

  const handleCaptchaDrag = (e) => {
    e.preventDefault();
    return false;
  };

  const handleCaptchaContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  // Hàm tạo CAPTCHA chỉ số - 6 chữ số
  const generateCaptcha = React.useCallback(() => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    // Tạo mã CAPTCHA chỉ số (6 chữ số)
    let newCaptcha = '';
    for (let i = 0; i < 6; i++) {
      newCaptcha += Math.floor(Math.random() * 10); // Số từ 0-9
    }
    setCaptcha(newCaptcha);
    setUserCaptcha(''); // Reset input khi tạo mã mới
    
    // Reset trạng thái sau 300ms để tránh double click
    setTimeout(() => {
      setIsGenerating(false);
    }, 300);
  }, [isGenerating]);

  // Xử lý click với event prevention
  const handleCaptchaRefresh = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (captchaButtonRef.current) {
      captchaButtonRef.current.blur();
    }
    
    generateCaptcha();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Định dạng số điện thoại khi nhập
    if (name === 'sdt') {
      formattedValue = formatPhoneNumber(value);
    }
    
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    
    // Không validate real-time nữa, chỉ clear error nếu có
    if (showErrors && fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCaptchaChange = (e) => {
    // Chỉ cho phép nhập số
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Giới hạn 6 số
    setUserCaptcha(value);
    
    // Không validate real-time nữa, chỉ clear error nếu có
    if (showErrors && fieldErrors.captcha) {
      setFieldErrors((prev) => ({ ...prev, captcha: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });
    
    // Bật hiển thị lỗi khi bấm gửi
    setShowErrors(true);

    // Validate toàn bộ form
    const errors = validateForm();

    // Kiểm tra nếu có lỗi
    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) {
      setStatus({ loading: false, success: false, error: 'Vui lòng kiểm tra lại thông tin.' });
      return;
    }

    try {
      const response = await fetch('https://canxiapi.site/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          sdt: formData.sdt.replace(/\s/g, ''), // Loại bỏ khoảng trắng
          message: formData.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi khi gửi liên hệ.');
      }

      setStatus({ loading: false, success: true, error: null });
      setFormData({ fullName: '', email: '', sdt: '', message: '' });
      setUserCaptcha('');
      setFieldErrors({ fullName: '', email: '', sdt: '', captcha: '' });
      setShowErrors(false); // Tắt hiển thị lỗi khi thành công
      generateCaptcha();
    } catch (error) {
      setStatus({ loading: false, success: false, error: error.message || 'Lỗi server khi gửi liên hệ.' });
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setStatus((prev) => ({ ...prev, success: false, error: null }));
    if (popupTimeout) {
      clearTimeout(popupTimeout);
    }
  };

  const popupMessage = status.error || 
    (status.success && `Cảm ơn bạn ${formData.fullName}! Tin nhắn đã được gửi thành công. Chúng tôi sẽ liên hệ qua ${formData.email} hoặc ${formData.sdt || 'số Zalo'} sớm nhất có thể.`);

  return (
    <>
      {/* Contact Hero */}
      <section className="contact-hero">
        <div className="container contact-hero-content fade-in-up">
          <h1>Liên hệ với Đại Lý Nguyễn Huyền</h1>
          <p>Có câu hỏi về Canxi Cơm? Gửi tin nhắn hoặc liên hệ trực tiếp, chúng tôi sẵn sàng hỗ trợ bạn!</p>
        </div>
      </section>

      {/* Contact Section */}
      <div className="container">
        <div className="contact-section">
          <div className="contact-form fade-in-up">
            <h2>Gửi tin nhắn về Canxi Cơm</h2>
            <form id="contact-form" onSubmit={handleSubmit}>
              <div className="form-row-contact">
                <div className="form-group">
                  <label htmlFor="fullName">Họ và tên *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên"
                    required
                    className={showErrors && fieldErrors.fullName ? 'error' : ''}
                  />
                  {showErrors && fieldErrors.fullName && (
                    <span className="error-message">{fieldErrors.fullName}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="sdt">Số Zalo *</label>
                  <input
                    type="tel"
                    id="sdt"
                    name="sdt"
                    value={formData.sdt}
                    onChange={handleChange}
                    placeholder="Nhập số zalo"
                    pattern="[0-9\s]*"
                    inputMode="numeric"
                    className={showErrors && fieldErrors.sdt ? 'error' : ''}
                  />
                  {showErrors && fieldErrors.sdt && (
                    <span className="error-message">{fieldErrors.sdt}</span>
                  )}
                </div>
              </div>
              <div className="form-row-contact">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email"
                    required
                    className={showErrors && fieldErrors.email ? 'error' : ''}
                  />
                  {showErrors && fieldErrors.email && (
                    <span className="error-message">{fieldErrors.email}</span>
                  )}
                </div>
              </div>
              <div className="form-row-contact">
                <div className="form-group">
                  <label htmlFor="message">Tin nhắn</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Nhập câu hỏi hoặc yêu cầu về Canxi Cơm"
                    rows="4"
                  />
                </div>
              </div>
              <div className="form-row-contact">
                <div className="form-group captcha-group">
                  <label>Mã CAPTCHA *</label>
                  <div className="captcha-container">
                    <span 
                      className="captcha-code"
                      onCopy={handleCaptchaCopy}
                      onCut={handleCaptchaCut}
                      onPaste={handleCaptchaPaste}
                      onDragStart={handleCaptchaDrag}
                      onContextMenu={handleCaptchaContextMenu}
                      unselectable="on"
                      style={{
                        userSelect: 'none', 
                        WebkitUserSelect: 'none', 
                        MozUserSelect: 'none', 
                        msUserSelect: 'none'
                      }}
                    >
                      {captcha}
                    </span>
                    <button 
                      ref={captchaButtonRef}
                      type="button" 
                      onClick={handleCaptchaRefresh} 
                      className="captcha-refresh"
                      disabled={isGenerating}
                    >
                      <i className={`fas fa-sync-alt ${isGenerating ? 'spinning' : ''}`}></i>
                    </button>
                  </div>
                  <input
                    type="text"
                    id="captcha"
                    name="captcha"
                    value={userCaptcha}
                    onChange={handleCaptchaChange}
                    onPaste={handleCaptchaPaste}
                    onCopy={handleCaptchaCopy}
                    onCut={handleCaptchaCut}
                    placeholder="Nhập 6 số CAPTCHA"
                    required
                    autoComplete="off"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="6"
                    className={showErrors && fieldErrors.captcha ? 'error' : ''}
                  />
                  {showErrors && fieldErrors.captcha && (
                    <span className="error-message">{fieldErrors.captcha}</span>
                  )}
                  <small className="captcha-note">Vui lòng nhập 6 số CAPTCHA hiển thị ở trên</small>
                </div>
              </div>
              <button type="submit" className="btn-primary-contact" disabled={status.loading}>
                {status.loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </button>
            </form>
          </div>
          <div className="contact-details fade-in-up">
            <h2>Thông tin liên hệ</h2>
            <ul>
              <li><i className="fas fa-map-marker-alt"></i> Đắk lim, Đăk ơ, Đồng Nai</li>
              <li><i className="fas fa-phone"></i> 0862 766 839</li>
              <li><i className="fas fa-envelope"></i> dailynguyenhuyen@gmail.com</li>
              <li><i className="fas fa-clock"></i> Thứ 2 - CN: 7:00 - 21:00</li>
            </ul>
            <div className="map-placeholder">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62873.1907463275!2d107.089861!3d12.043999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31724c2c40cbe2cf%3A0x1f6a2a0f563b92b4!2zxJDDoGsgTMOibSwgxJDDoGsgxJHhu5EgxJDhuqE!5e0!3m2!1svi!2sVN!4v1734016789012!5m2!1svi!2sVN"
                width="600"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>
        </div>
      </div>

      {/* Popup Notification */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className={`popup-message ${status.error ? 'error' : 'success'}`}>
              {popupMessage}
            </div>
            <button onClick={closePopup} className="popup-close">Đóng</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactContent;