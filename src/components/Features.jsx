import React from 'react';

// Đảm bảo Font Awesome được tích hợp
import '@fortawesome/fontawesome-free/css/all.min.css';

const Features = () => {
  const featuresData = [
    {
      icon: 'fas fa-truck',
      title: 'Giao hàng miễn phí',
      text: 'Miễn phí giao hàng toàn quốc cho mọi đơn hàng.',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Chính hãng 100%',
      text: 'Cam kết Canxi Cơm có nguồn gốc rõ ràng.',
    },
    {
      icon: 'fas fa-headset',
      title: 'Hỗ trợ 24/7',
      text: 'Tư vấn sử dụng sản phẩm mọi lúc.',
    },
    {
      icon: 'fas fa-undo',
      title: 'Đổi trả dễ dàng',
      text: 'Hỗ trợ đổi trả trong 7 ngày.',
    },
  ];

  return (
    <div className="container">
      <div className="features">
        {featuresData.map((feature, index) => (
          <div key={index} className="feature-card fade-in-up">
            <div className="feature-icon">
              <i className={feature.icon}></i>
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-text">{feature.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;