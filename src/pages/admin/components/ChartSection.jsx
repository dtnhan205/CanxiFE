import React from 'react';

const ChartSection = () => {
  return (
    <div className="charts">
      <div className="chart-container">
        <h3 className="chart-title">Doanh thu theo tháng</h3>
        <div id="revenueChart" onClick={() => window.openCanvasPanel()}>
          {/* Biểu đồ sẽ được tạo trong canvas panel */}
        </div>
      </div>
      <div className="chart-container">
        <h3 className="chart-title">Tỷ lệ sản phẩm bán chạy</h3>
        <div id="productChart" onClick={() => window.openCanvasPanel()}>
          {/* Biểu đồ sẽ được tạo trong canvas panel */}
        </div>
      </div>
    </div>
  );
};

export default ChartSection;