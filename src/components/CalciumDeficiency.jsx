import React from 'react';

const CalciumDeficiency = () => {
  const deficiencyData = [
    {
      image: '/image/chuotrut.jpg',
      alt: 'Chuột rút',
      title: 'Chuột rút hoặc co cơ',
      text: 'Thường xuyên bị chuột rút, đặc biệt vào ban đêm, có thể là dấu hiệu thiếu canxi.',
    },
    {
      image: '/image/xuongyeu.webp',
      alt: 'Yếu xương',
      title: 'Yếu xương hoặc loãng xương',
      text: 'Xương dễ gãy hoặc đau nhức là dấu hiệu rõ ràng của thiếu canxi kéo dài.',
    },
    {
      image: '/image/rangsuyyeu.webp',
      alt: 'Răng suy yếu',
      title: 'Răng suy yếu',
      text: 'Răng dễ sâu hoặc lung lay có thể liên quan đến mức canxi thấp.',
    },
    {
      image: '/image/metmoi.jpg',
      alt: 'Mệt mỏi',
      title: 'Mệt mỏi, uể oải',
      text: 'Cơ thể mệt mỏi kéo dài có thể là do thiếu hụt canxi và khoáng chất.',
    },
  ];

  return (
    <section className="section" id="calcium-deficiency">
      <div className="container">
        <div className="section-header fade-in-up">
          <h2 className="section-title">Dấu Hiệu Thiếu Canxi</h2>
          <p className="section-subtitle">
            Nhận biết sớm các dấu hiệu thiếu canxi để bảo vệ sức khỏe xương của bạn.
          </p>
        </div>
        <div className="deficiency-list">
          {deficiencyData.map((item, index) => (
            <div key={index} className="deficiency-item fade-in-up">
              <div className="deficiency-image">
                <img src={item.image} alt={item.alt} />
              </div>
              <h3 className="deficiency-title">{item.title}</h3>
              <p className="deficiency-text">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CalciumDeficiency;