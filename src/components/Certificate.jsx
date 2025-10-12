import React from 'react';

const Certificate = () => {
  return (
    <section className="certificate" id='certificate'>
      <h2>CHỨNG NHẬN CAM KẾT</h2>
      <p>
        Đề tài phát minh Canxi Unical For Rice được cấp bằng sáng chế tại 7 nước trên thế giới: 
        Nhật, Anh, Pháp, Đức, Hàn Quốc, Trung Quốc, Hoa Kỳ.
      </p>
      <p>
        Tại Việt Nam, Canxi Unical là sản phẩm duy nhất đồng hành cùng đề án 641, đề án 818 
        tổng cục dân số & KHHGĐ chăm sóc sức khỏe xương khớp và cải thiện tầm vóc cho người Việt Nam
      </p>

      <div className="certificate-box">
        <div className="cert-item">
          <img src="/image/CERTIFICATE1.jpg" alt="Huy chương vàng" />
        </div>
        <div className="cert-item">
          <img src="/image/CERTIFICATE2.jpg" alt="Bằng chứng nhận Việt Nam" />
        </div>
        <div className="cert-item item-big">
          <img src="/image/CERTIFICATE3.jpg" alt="Bằng sáng chế 7 nước" />
        </div>
      </div>
    </section>
  );
};

export default Certificate;