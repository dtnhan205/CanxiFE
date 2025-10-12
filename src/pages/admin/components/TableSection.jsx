import React from 'react';

const TableSection = ({ data, columns, statusMap }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col === 'Hình ảnh' ? (
                    <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name} className="product-img" />
                  ) : col === 'Trạng thái' ? (
                    <span className={`status ${item.status || 'confirmed'}`}>
                      {statusMap[item.status || 'confirmed'] || 'Còn hàng'}
                    </span>
                  ) : col === 'Thao tác' ? (
                    <div className="action-buttons">
                      <button className="btn btn-view">Xem</button>
                      <button className="btn btn-edit">Sửa</button>
                      <button className="btn btn-delete">Xóa</button>
                    </div>
                  ) : (
                    item[col.toLowerCase()] || ''
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSection;