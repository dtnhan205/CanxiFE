import React from 'react';

const Feedback = () => {
  return (
    <section className="feedback" id="feedback">
      <h2>KHÁCH HÀNG DÙNG CANXI CƠM CHIA SẺ</h2>

      <div className="feedback-container">
        {/* feedback item 1 */}
        <div className="feedback-item">
          <iframe
            width="397"
            height="223"
            src="https://www.youtube.com/embed/2QxClafrhgw"
            title="Hết mất ngủ , nhức xương nhờ uống canxi cơm Nhật Bản"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          <p className="feedback-text">“Tôi hết mất ngủ, nhức xương nhờ uống canxi unical for rice..”</p>
        </div>

        {/* feedback item 2 */}
        <div className="feedback-item">
          <iframe
            width="397"
            height="223"
            src="https://www.youtube.com/embed/o_xD1AbpFhk"
            title="Bệnh nhân đau khớp gối không đi lại được đã khoan khoái nhẹ nhõm, đi lại bỏ gậy nhờ Canxi Cơm Nhật"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          <p className="feedback-text">“Tôi bị đau khớp gối không đi lại được, đã khoan khoái nhẹ nhõm, đi lại bỏ gậy nhờ Canxi Cơm Nhật.”</p>
        </div>

        {/* feedback item 3 */}
        <div className="feedback-item">
          <iframe
            width="397"
            height="223"
            src="https://www.youtube.com/embed/2q-ryj-u7K0"
            title="Unical-Benh nhan rang lung lay dau khop"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          <p className="feedback-text">“Răng tôi chắc lại nhờ uống canxi cơm Nhật Bản.”</p>
        </div>
      </div>
    </section>
  );
};

export default Feedback;