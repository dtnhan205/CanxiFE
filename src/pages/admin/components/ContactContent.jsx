import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactContent = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [status, setStatus] = useState({ loading: false, success: false, error: null });
  const [showPopup, setShowPopup] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [filter, setFilter] = useState({
    keyword: '',
    status: '',
    dateRange: { from: '', to: '' }
  });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setStatus({ loading: false, success: false, error: 'Không có quyền truy cập. Vui lòng đăng nhập lại.' });
          setShowPopup(true);
          setTimeout(() => navigate('/admin/login'), 2000);
          return;
        }

        setStatus({ loading: true, success: false, error: null });
        const response = await fetch('http://160.187.246.95:3000/api/contacts', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Không thể tải danh sách liên hệ.');
        }

        const data = await response.json();
        setContacts(data.contacts || []);
        setStatus({ loading: false, success: true, error: null });
      } catch (error) {
        setStatus({ loading: false, success: false, error: error.message });
        setShowPopup(true);
        if (error.message.includes('quyền')) {
          setTimeout(() => navigate('/admin/login'), 2000);
        }
      }
    };

    fetchContacts();
  }, [navigate]);

  const handleUpdateStatus = async (id) => {
    setStatus({ loading: true, success: false, error: null });
    setSelectedContactId(id);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setStatus({ loading: false, success: false, error: 'Không có quyền truy cập. Vui lòng đăng nhập lại.' });
        setShowPopup(true);
        setTimeout(() => navigate('/admin/login'), 2000);
        return;
      }

      const contact = contacts.find(c => c._id === id);
      if (!contact || contact.status === 'Đã xử lý') {
        setStatus({ loading: false, success: false, error: 'Không thể cập nhật trạng thái của liên hệ này.' });
        setShowPopup(true);
        return;
      }

      setShowConfirmPopup(true);
    } catch (error) {
      setStatus({ loading: false, success: false, error: error.message });
      setShowPopup(true);
      if (error.message.includes('quyền')) {
        setTimeout(() => navigate('/admin/login'), 2000);
      }
    }
  };

  const confirmUpdateStatus = async () => {
    setShowConfirmPopup(false);
    setStatus({ loading: true, success: false, error: null });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://160.187.246.95:3000/api/contacts/${selectedContactId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Đã xử lý' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể cập nhật trạng thái.');
      }

      const updatedContacts = contacts.map(contact =>
        contact._id === selectedContactId ? { ...contact, status: 'Đã xử lý' } : contact
      );
      setContacts(updatedContacts);
      setStatus({ loading: false, success: true, error: null });
      setShowPopup(true);
    } catch (error) {
      setStatus({ loading: false, success: false, error: error.message });
      setShowPopup(true);
      if (error.message.includes('quyền')) {
        setTimeout(() => navigate('/admin/login'), 2000);
      }
    }
  };

  const handleDeleteContact = async (id) => {
    setStatus({ loading: true, success: false, error: null });
    setSelectedContactId(id);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setStatus({ loading: false, success: false, error: 'Không có quyền truy cập. Vui lòng đăng nhập lại.' });
        setShowPopup(true);
        setTimeout(() => navigate('/admin/login'), 2000);
        return;
      }

      const response = await fetch(`http://160.187.246.95:3000/api/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể xóa liên hệ.');
      }

      setContacts(contacts.filter(contact => contact._id !== id));
      setStatus({ loading: false, success: true, error: null });
      setShowPopup(true);
    } catch (error) {
      setStatus({ loading: false, success: false, error: error.message });
      setShowPopup(true);
      if (error.message.includes('quyền')) {
        setTimeout(() => navigate('/admin/login'), 2000);
      }
    }
  };

  const handleViewContact = (id) => {
    setStatus({ loading: true, success: false, error: null });
    setSelectedContactId(id);

    const contact = contacts.find(c => c._id === id);
    setStatus({ loading: false, success: true, error: null });
    setShowPopup(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      ...(name === 'dateRange' ? { dateRange: { ...prev.dateRange, [e.target.dataset.type]: value } } : { [name]: value })
    }));
  };

  // Hàm cắt ngắn nội dung và thêm dấu "..."
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const filteredContacts = contacts.filter(contact => {
    const keywordMatch = contact.fullName.toLowerCase().includes(filter.keyword.toLowerCase()) ||
                        contact.email.toLowerCase().includes(filter.keyword.toLowerCase()) ||
                        contact.phone.toLowerCase().includes(filter.keyword.toLowerCase()) ||
                        contact.message.toLowerCase().includes(filter.keyword.toLowerCase());
    const statusMatch = !filter.status || contact.status === filter.status;
    const dateMatch = !filter.dateRange.from && !filter.dateRange.to ||
                     (contact.createdAt && 
                      new Date(contact.createdAt) >= new Date(filter.dateRange.from) && 
                      new Date(contact.createdAt) <= new Date(filter.dateRange.to));
    return keywordMatch && statusMatch && dateMatch;
  });

  const closePopup = () => {
    setShowPopup(false);
    setShowConfirmPopup(false);
    setStatus((prev) => ({ ...prev, success: false, error: null }));
  };

  return (
    <div id="contacts" className="content-section active">
      <div className="filter-section" style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          name="keyword"
          value={filter.keyword}
          onChange={handleFilterChange}
          placeholder="Tìm kiếm theo tên, email, số điện thoại hoặc nội dung..."
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <select
          name="status"
          value={filter.status}
          onChange={handleFilterChange}
          style={{ padding: '8px', marginRight: '10px' }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Chưa xử lý">Chưa xử lý</option>
          <option value="Đã xử lý">Đã xử lý</option>
        </select>
        <input
          type="date"
          name="dateRange"
          data-type="from"
          value={filter.dateRange.from}
          onChange={handleFilterChange}
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <input
          type="date"
          name="dateRange"
          data-type="to"
          value={filter.dateRange.to}
          onChange={handleFilterChange}
          style={{ padding: '8px' }}
        />
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Nội dung</th>
              <th>Ngày gửi</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact) => (
              <tr key={contact._id}>
                <td title={contact.fullName}>{truncateText(contact.fullName, 30)}</td>
                <td title={contact.email}>{truncateText(contact.email, 25)}</td>
                <td title={contact.phone}>{truncateText(contact.phone, 15)}</td>
                <td title={contact.message}>{truncateText(contact.message, 50)}</td>
                <td>{contact.createdAt ? new Date(contact.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</td>
                <td><span className={`status ${contact.status === 'Đã xử lý' ? 'confirmed' : 'pending'}`}>{contact.status}</span></td>
                <td className="action-buttons">
                  {contact.status === 'Chưa xử lý' && (
                    <button className="btn-admin-contact btn-admin-contact-confirm" onClick={() => handleUpdateStatus(contact._id)}>
                      Xử lý
                    </button>
                  )}
                  {contact.status === 'Đã xử lý' && (
                    <button className="btn-admin-contact btn-admin-contact-view" onClick={() => handleViewContact(contact._id)}>
                      Xem
                    </button>
                  )}
                  <button className="btn-admin-contact btn-admin-contact-delete" onClick={() => handleDeleteContact(contact._id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup thông báo chính */}
      {showPopup && (
        <div className="popup-overlay" style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0, 0, 0, 0.5)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          zIndex: 1000 
        }}>
          <div className="popup-content" style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center', 
            maxWidth: '400px', 
            width: '90%' 
          }}>
            <p style={{ 
              color: status.error ? 'red' : 'green', 
              margin: 0, 
              fontSize: '16px' 
            }}>
              {status.error || (status.success && (status.loading 
                ? 'Đang xử lý...' 
                : selectedContactId 
                  ? `Thao tác thành công cho liên hệ ${selectedContactId}` 
                  : 'Thao tác thành công'))}
            </p>
            <button onClick={closePopup} style={{ 
              marginTop: '10px', 
              padding: '5px 15px', 
              background: '#2c5f8e', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}>
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Popup xác nhận trước khi xử lý */}
      {showConfirmPopup && (
        <div className="popup-overlay" style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0, 0, 0, 0.5)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          zIndex: 1000 
        }}>
          <div className="popup-content" style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center', 
            maxWidth: '400px', 
            width: '90%' 
          }}>
            <p style={{ margin: 0, fontSize: '16px' }}>
              Bạn có chắc chắn muốn đánh dấu liên hệ này là "Đã xử lý"?
            </p>
            <div style={{ marginTop: '15px' }}>
              <button onClick={confirmUpdateStatus} style={{ 
                padding: '5px 15px', 
                background: '#2c5f8e', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer', 
                marginRight: '10px' 
              }}>
                Xác nhận
              </button>
              <button onClick={closePopup} style={{ 
                padding: '5px 15px', 
                background: '#ccc', 
                color: 'black', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactContent;