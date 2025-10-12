import React from 'react';
import { FaFlask, FaShieldAlt, FaCertificate } from 'react-icons/fa';

const UnicalInfo = () => {
  return (
    <section className="unical-info" id="unical-info">
        <h2>Tác Dụng</h2>
      <div className="unical-container">
        {/* Cột hình ảnh */}
        <div className="unical-image">
          <img src="/image/hasp2.png" alt="Unical Pack" />
          <div className="orange-bg"></div>
        </div>

        {/* Cột nội dung */}
        <div className="unical-content">
          <div className="info-block">
            <FaFlask className="icon" />
            <div>
              <h3>Giải pháp hoàn hảo để bổ sung canxi</h3>
              <p>
                Canxi có trong Unical có tỉ lệ ion hoá vượt trội so với các loại canxi trong sản phẩm
                thông thường, làm tăng khả năng hấp thụ lên tới 100%.
              </p>
            </div>
          </div>

          <div className="info-block">
            <FaShieldAlt className="icon" />
            <div>
              <h3>Không lo tác dụng phụ</h3>
              <p>
                Gia đình bạn có thể yên tâm sử dụng Canxi cơm – Unical 365 ngày/năm mà không phải lo
                lắng về bất cứ tác dụng phụ nào, với khả năng hấp thụ tuyệt vời của sản phẩm.
              </p>
            </div>
          </div>

          <div className="info-block">
            <FaCertificate className="icon" />
            <div>
              <h3>Bằng sáng chế tại 7 quốc gia hàng đầu</h3>
              <p>
                Canxi cơm Nhật Bản dẫn đầu thế giới – được mệnh danh là Vua Canxi. Các quốc gia như
                Mỹ, Nhật, Úc, Canada... đều công nhận đây là giải pháp cho sức khoẻ con người.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnicalInfo;
