import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';

const DashboardContent = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingContacts: 0,
    monthlyRevenue: 0,
    inventory: 0,
    soldProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState({
    labels: [],
    data: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('month');

  useEffect(() => {
    fetchDashboardData();
  }, [timeFilter]);

  useEffect(() => {
    if (salesData.labels.length > 0) {
      initializeChart();
    }
  }, [salesData]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập lại');
        setTimeout(() => navigate('/admin/login'), 2000);
        return;
      }

      // Fetch all data
      const [productsRes, ordersRes, contactsRes] = await Promise.all([
        fetch('http://localhost:3000/api/products', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3000/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3000/api/contacts', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (!productsRes.ok || !ordersRes.ok || !contactsRes.ok) {
        throw new Error('Không thể tải dữ liệu dashboard');
      }

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      const contactsData = await contactsRes.json();

      // Process data
      const totalProducts = productsData.products?.length || 0;
      const totalOrders = ordersData.orders?.length || 0;
      const pendingContacts = contactsData.contacts?.filter(contact => contact.status === 'Chưa xử lý').length || 0;
      
      // Calculate monthly revenue from orders
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyOrders = ordersData.orders?.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      }) || [];

      const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

      // Calculate inventory and sold products
      const inventory = productsData.products?.reduce((sum, product) => sum + (product.stock || 0), 0) || 0;
      const soldProducts = productsData.products?.reduce((sum, product) => sum + (product.sold || 0), 0) || 0;

      // Get recent pending orders (last 5 orders with status 'pending')
      const recentPendingOrders = ordersData.orders
        ?.filter(order => order.status === 'pending') // Chỉ lấy đơn chờ xác nhận
        ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sắp xếp mới nhất trước
        ?.slice(0, 5) || []; // Chỉ lấy 5 đơn

      // Generate sales data from orders
      const sales = generateSalesData(ordersData.orders, timeFilter);

      setDashboardData({
        totalProducts,
        totalOrders,
        pendingContacts,
        monthlyRevenue,
        inventory,
        soldProducts
      });

      setRecentOrders(recentPendingOrders);
      setSalesData(sales);

    } catch (error) {
      setError(error.message);
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm tạo dữ liệu sales từ orders
  const generateSalesData = (orders, period) => {
    if (!orders || orders.length === 0) {
      // Fallback data nếu không có orders
      return {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
        data: [12, 19, 8, 15, 12, 17]
      };
    }

    const now = new Date();
    let labels = [];
    let data = [];

    switch (period) {
      case 'week':
        // Last 7 days
        labels = [];
        data = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(now.getDate() - i);
          const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
          labels.push(dateStr);
          
          const dayOrders = orders.filter(order => {
            if (!order.createdAt) return false;
            const orderDate = new Date(order.createdAt);
            return orderDate.toDateString() === date.toDateString();
          });
          data.push(dayOrders.length);
        }
        break;

      case 'month':
        // Last 30 days (group by week)
        labels = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
        data = [0, 0, 0, 0];
        
        orders.forEach(order => {
          if (!order.createdAt) return;
          const orderDate = new Date(order.createdAt);
          const week = Math.floor((orderDate.getDate() - 1) / 7);
          if (week >= 0 && week < 4) {
            data[week]++;
          }
        });
        break;

      case 'quarter':
        // Last 3 months
        labels = [];
        data = [];
        for (let i = 2; i >= 0; i--) {
          const month = new Date();
          month.setMonth(now.getMonth() - i);
          const monthStr = month.toLocaleDateString('vi-VN', { month: 'short' });
          labels.push(monthStr);
          
          const monthOrders = orders.filter(order => {
            if (!order.createdAt) return false;
            const orderDate = new Date(order.createdAt);
            return orderDate.getMonth() === month.getMonth() && 
                   orderDate.getFullYear() === month.getFullYear();
          });
          data.push(monthOrders.length);
        }
        break;

      case 'year':
        // Last 12 months
        labels = [];
        data = [];
        for (let i = 11; i >= 0; i--) {
          const month = new Date();
          month.setMonth(now.getMonth() - i);
          const monthStr = month.toLocaleDateString('vi-VN', { month: 'short' });
          labels.push(monthStr);
          
          const monthOrders = orders.filter(order => {
            if (!order.createdAt) return false;
            const orderDate = new Date(order.createdAt);
            return orderDate.getMonth() === month.getMonth() && 
                   orderDate.getFullYear() === month.getFullYear();
          });
          data.push(monthOrders.length);
        }
        break;

      default:
        labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
        data = [12, 19, 8, 15, 12, 17];
    }

    return { labels, data };
  };

  const initializeChart = () => {
    const ctx = document.getElementById('productChart');
    if (!ctx) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: salesData.labels,
        datasets: [{
          label: 'Số đơn hàng',
          data: salesData.data,
          borderColor: 'rgba(46, 204, 113, 1)',
          backgroundColor: 'rgba(46, 204, 113, 0.2)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(46, 204, 113, 1)',
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#2c3e50',
              font: { size: 14 }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Số đơn hàng',
              color: '#2c3e50',
              font: { size: 12 }
            },
            ticks: { 
              color: '#95a5a6',
              stepSize: 1
            }
          },
          x: {
            title: {
              display: true,
              text: 'Thời gian',
              color: '#2c3e50',
              font: { size: 12 }
            },
            ticks: { color: '#95a5a6' }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    });
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập lại');
        navigate('/admin/login');
        return;
      }

      const response = await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'confirmed' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể xác nhận đơn hàng');
      }

      // Cập nhật lại danh sách đơn hàng
      const updatedOrders = recentOrders.filter(order => order._id !== orderId);
      setRecentOrders(updatedOrders);
      
      // Refresh dashboard data
      fetchDashboardData();
      
      alert('Đã xác nhận đơn hàng thành công!');

    } catch (error) {
      alert(`Lỗi khi xác nhận đơn hàng: ${error.message}`);
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      shipped: 'Đang vận chuyển',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  // Cleanup chart on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  if (loading) {
    return (
      <div id="dashboard" className="content-section active">
        <div className="loading-container">
          <p>Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="dashboard" className="content-section active">
        <div className="error-banner">
          <p>Lỗi khi tải dữ liệu: {error}</p>
          <button onClick={fetchDashboardData}>Thử lại</button>
        </div>
      </div>
    );
  }

  return (
    <div id="dashboard" className="content-section active" style={{ minHeight: '100vh' }}>
      {/* Dashboard Cards */}
      <div className="dashboard-cards">
        <div className="card">
          <div className="card-header">
            <h3>Tổng sản phẩm</h3>
            <div className="card-icon products">
              <i className="fas fa-box"></i>
            </div>
          </div>
          <div className="card-value">{dashboardData.totalProducts}</div>
          <div className="card-title">Sản phẩm trong kho</div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3>Đơn hàng</h3>
            <div className="card-icon orders">
              <i className="fas fa-shopping-cart"></i>
            </div>
          </div>
          <div className="card-value">{dashboardData.totalOrders}</div>
          <div className="card-title">Tổng đơn hàng</div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3>Liên hệ</h3>
            <div className="card-icon contacts">
              <i className="fas fa-envelope"></i>
            </div>
          </div>
          <div className="card-value">{dashboardData.pendingContacts}</div>
          <div className="card-title">Tin nhắn chưa xử lý</div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3>Thu nhập</h3>
            <div className="card-icon revenue">
              <i className="fas fa-dollar-sign"></i>
            </div>
          </div>
          <div className="card-value">{formatCurrency(dashboardData.monthlyRevenue)}</div>
          <div className="card-title">VNĐ trong tháng</div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3>Tồn kho</h3>
            <div className="card-icon inventory">
              <i className="fas fa-warehouse"></i>
            </div>
          </div>
          <div className="card-value">{dashboardData.inventory}</div>
          <div className="card-title">Sản phẩm tồn kho</div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3>Đã bán</h3>
            <div className="card-icon sold">
              <i className="fas fa-check-circle"></i>
            </div>
          </div>
          <div className="card-value">{dashboardData.soldProducts}</div>
          <div className="card-title">Sản phẩm đã bán</div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <span>Lọc theo:</span>
        <select 
          value={timeFilter} 
          onChange={(e) => setTimeFilter(e.target.value)}
        >
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
          <option value="quarter">Quý này</option>
          <option value="year">Năm nay</option>
        </select>
        <button onClick={fetchDashboardData}>Áp dụng</button>
      </div>

      {/* Charts */}
      <div className="charts">
        <div className="chart-container" style={{ height: '400px' }}>
          <h3 className="chart-title">Thống kê đơn hàng theo thời gian</h3>
          <canvas id="productChart" height="400"></canvas>
        </div>
      </div>

      {/* Recent Orders - Chỉ hiển thị đơn chờ xác nhận */}
      <div className="table-container">
        <h3>Đơn hàng chờ xác nhận ({recentOrders.length})</h3>
        <table>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Số điện thoại</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order._id}>
                <td>#{order._id?.substring(0, 8).toUpperCase()}</td>
                <td>{order.fullName || 'N/A'}</td>
                <td>{order.phone || 'N/A'}</td>
                <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</td>
                <td>{order.totalPrice ? formatCurrency(order.totalPrice) : 'N/A'}</td>
                <td>
                  <button 
                    className="btn-admin btn-admin-confirm"
                    onClick={() => handleConfirmOrder(order._id)}
                  >
                    Xác nhận
                  </button>
                  <button 
                    className="btn-admin btn-admin-view"
                    onClick={() => handleViewOrder(order._id)}
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                  Không có đơn hàng nào chờ xác nhận
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardContent;