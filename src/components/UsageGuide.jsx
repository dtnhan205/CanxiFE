import React from 'react';

const UsageGuide = () => {
  const usageData = [
    {
      number: '1',
      title: 'Nấu trực tiếp với cơm',
      text: 'Cho 1–2 gói Canxi Cơm vào nồi khi nấu cơm, để tan hoàn toàn nhờ nhiệt độ cao và hấp thụ tối ưu.',
    },
    {
      number: '2',
      title: 'Khuấy vào cháo hoặc súp nóng',
      text: 'Thêm Canxi Cơm vào cháo, súp hoặc canh đang nóng, khuấy đều đến khi tan hoàn toàn rồi dùng ngay.',
    },
    {
      number: '3',
      title: 'Pha với nước sôi',
      text: 'Hòa 1 gói Canxi Cơm vào khoảng 150ml nước sôi (≥80°C), khuấy đều cho tan hết rồi uống trong 5 phút.',
    },
    {
      number: '4',
      title: 'Trộn vào sữa hoặc sinh tố ấm',
      text: 'Hòa tan trước với nước nóng, sau đó cho vào sữa, sinh tố để bổ sung canxi tiện lợi.',
    },
    {
      number: '5',
      title: 'Trộn cùng thức ăn nóng',
      text: 'Rắc Canxi Cơm lên mì, bún, phở, hoặc món ăn còn nóng để canxi tan hoàn toàn và dễ hấp thu.',
    },
    {
      number: '6',
      title: 'Dùng được các bữa trong ngày',
      text: 'Uống Canxi Cơm trong bữa ăn giúp cơ thể hấp thu tốt hơn.',
    },
    {
      number: '7',
      title: 'Dùng mỗi ngày đều đặn',
      text: 'Sử dụng Canxi Cơm hằng ngày vào cùng thời điểm để duy trì lượng canxi ổn định trong cơ thể.',
    },
    {
      number: '8',
      title: 'Phù hợp cho mọi lứa tuổi',
      text: 'Trẻ em, người lớn, phụ nữ mang thai và người cao tuổi đều có thể dùng.',
    },
  ];

  return (
    <section className="section" id="usage-guide">
      <div className="container">
        <div className="section-header fade-in-up">
          <h2 className="section-title">8 Cách Dùng Canxi Cơm Nhật Bản Hiệu Quả Nhất</h2>
          <p className="section-subtitle">
            Canxi Cơm chỉ tan trong nhiệt độ cao — hãy pha, nấu hoặc trộn cùng món ăn nóng để hấp thụ tối đa dưỡng chất.
          </p>
        </div>
        <div className="usage-list">
          {usageData.map((item, index) => (
            <div key={index} className="usage-item fade-in-up">
              <div className="usage-number">{item.number}</div>
              <h3 className="usage-title">{item.title}</h3>
              <p className="usage-text">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UsageGuide;
