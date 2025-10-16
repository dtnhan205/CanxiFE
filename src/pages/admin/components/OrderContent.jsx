import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../../styles/admin/OrderContent.module.css';

const OrderContent = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState({ loading: false, success: false, error: null });
  const [filter, setFilter] = useState({
    keyword: '',
    status: '',
    dateRange: { from: '', to: '' }
  });
  const [selectedOrder, setSelectedOrder] = useState(null); // State cho popup chi tiết

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setStatus({ loading: false, success: false, error: 'Không có quyền truy cập. Vui lòng đăng nhập lại.' });
          setTimeout(() => navigate('/admin/login'), 2000);
          return;
        }

        setStatus({ loading: true, success: false, error: null });
        const response = await fetch('https://canxiapi.site/api/orders', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Không thể tải danh sách đơn hàng.');
        }

        const data = await response.json();
        setOrders(Array.isArray(data.orders) ? data.orders : []);
        setStatus({ loading: false, success: true, error: null });
      } catch (error) {
        setStatus({ loading: false, success: false, error: error.message });
        if (error.message.includes('quyền')) {
          setTimeout(() => navigate('/admin/login'), 2000);
        }
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleButtonClick = async (action, orderId, newStatus) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setStatus({ loading: false, success: false, error: 'Vui lòng đăng nhập lại để thực hiện hành động.' });
      setTimeout(() => navigate('/admin/login'), 2000);
      return;
    }

    if (action === 'updateStatus') {
      try {
        setStatus({ loading: true, success: false, error: null });
        const response = await fetch(`https://canxiapi.site/api/orders/${orderId}/status`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Không thể cập nhật trạng thái.');
        }

        const updatedOrder = await response.json();
        setOrders(orders.map(order =>
          order._id === orderId ? { ...order, status: updatedOrder.order.status, statusLabel: updatedOrder.order.statusLabel } : order
        ));
        setStatus({ loading: false, success: true, error: null });
        alert(`Đã cập nhật trạng thái đơn thành ${updatedOrder.order.statusLabel}`);
      } catch (error) {
        setStatus({ loading: false, success: false, error: error.message });
      }
    } else if (action === 'view') {
      setSelectedOrder(orders.find(order => order._id === orderId) || null);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      ...(name === 'dateRange' ? { dateRange: { ...prev.dateRange, [e.target.dataset.type]: value } } : { [name]: value })
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      shipped: 'Đang vận chuyển',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy'
    };
    return statusMap[status] || 'Không xác định';
  };

  const getAllowedStatuses = (currentStatus) => {
    const statusOptions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['shipped', 'cancelled'],
      shipped: ['delivered', 'cancelled'],
      delivered: [],
      cancelled: []
    };
    return statusOptions[currentStatus] || [];
  };

  const filteredOrders = orders.filter(order => {
    const fullName = typeof order.fullName === 'string' ? order.fullName : '';
    const phone = typeof order.phone === 'string' ? order.phone : '';
    const orderDate = order.createdAt ? new Date(order.createdAt) : null;

    const keywordMatch = fullName.toLowerCase().includes(filter.keyword.toLowerCase()) ||
                        phone.toLowerCase().includes(filter.keyword.toLowerCase()) ||
                        (order.address && order.address.toLowerCase().includes(filter.keyword.toLowerCase())) ||
                        (order.note && order.note.toLowerCase().includes(filter.keyword.toLowerCase()));
    const statusMatch = !filter.status || (order.status && order.status === filter.status);
    const dateMatch = !filter.dateRange.from && !filter.dateRange.to ||
                     (orderDate && !isNaN(orderDate) &&
                      orderDate >= new Date(filter.dateRange.from) &&
                      orderDate <= new Date(filter.dateRange.to));

    return keywordMatch && statusMatch && dateMatch;
  });

  const closePopup = () => {
    setSelectedOrder(null);
  };

  return (
    <div id="orders" className={`${styles.contentSection} ${!status.loading ? styles.active : ''}`}>
      <div className={styles.filterSection}>
        <input
          type="text"
          name="keyword"
          value={filter.keyword}
          onChange={handleFilterChange}
          placeholder="Tìm kiếm đơn hàng..."
        />
        <select
          name="status"
          value={filter.status}
          onChange={handleFilterChange}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="shipped">Đang vận chuyển</option>
          <option value="delivered">Đã giao</option>
          <option value="cancelled">Đã hủy</option>
        </select>
        <input
          type="date"
          name="dateRange"
          data-type="from"
          value={filter.dateRange.from}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="dateRange"
          data-type="to"
          value={filter.dateRange.to}
          onChange={handleFilterChange}
        />
        <button className={`${styles.btnAdminOrder} ${styles.btnAdminOrderConfirm}`} onClick={handleFilterSubmit}>
          Lọc
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Số hộp</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={index}>
                <td>{order.fullName?.substring(0, 15) || 'N/A'}{order.fullName?.length > 15 ? '...' : ''}</td>
                <td>{order.phone || 'N/A'}</td>
                <td>{order.address?.substring(0, 20) || 'N/A'}{order.address?.length > 20 ? '...' : ''}</td>
                <td>{order.boxCount || 'N/A'}</td>
                <td>{order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : 'N/A'}</td>
                <td>{order.totalPrice ? `${order.totalPrice.toLocaleString('vi-VN')} VNĐ` : 'N/A'}</td>
                <td><span className={`status ${order.status || 'pending'}`}>{order.statusLabel || getStatusLabel(order.status)}</span></td>
                <td className={styles.actionButtons}>
                  <select
                    value=""
                    onChange={(e) => handleButtonClick('updateStatus', order._id, e.target.value)}
                    disabled={['delivered', 'cancelled'].includes(order.status)}
                    className={`${styles.btnAdminOrder} ${styles.btnAdminOrderConfirm}`}
                    style={{ padding: '5px', marginRight: '5px' }}
                  >
                    <option value="">Chọn trạng thái</option>
                    {getAllowedStatuses(order.status || 'pending').map(status => (
                      <option key={status} value={status}>{getStatusLabel(status)}</option>
                    ))}
                  </select>
                  <button
                    className={`${styles.btnAdminOrder} ${styles.btnAdminOrderView}`}
                    onClick={() => handleButtonClick('view', order._id)}
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup chi tiết */}
      {selectedOrder && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h3>Chi tiết đơn hàng</h3>
            <p><strong>Khách hàng:</strong> {selectedOrder.fullName || 'N/A'}</p>
            <p><strong>Số điện thoại:</strong> {selectedOrder.phone || 'N/A'}</p>
            <p><strong>Địa chỉ:</strong> {selectedOrder.address || 'N/A'}</p>
            <p><strong>Số hộp:</strong> {selectedOrder.boxCount || 'N/A'}</p>
            <p><strong>Ghi chú:</strong> {selectedOrder.note || 'N/A'}</p>
            <p><strong>Ngày đặt:</strong> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('vi-VN') : 'N/A'}</p>
            <p><strong>Tổng tiền:</strong> {selectedOrder.totalPrice ? `${selectedOrder.totalPrice.toLocaleString('vi-VN')} VNĐ` : 'N/A'}</p>
            <p><strong>Trạng thái:</strong> {selectedOrder.statusLabel || getStatusLabel(selectedOrder.status)}</p>
            <button onClick={closePopup} className={styles.closeButton}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderContent;