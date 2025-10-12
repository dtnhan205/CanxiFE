import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import EditProduct from './components/EditProduct'; // Import component form chỉnh sửa
import '../../styles/admin/ProductAdmin.css';
import '../../styles/admin/ProductForm.css';
import { withAuth } from '../../utils/authUtils';

const ManageEditProduct = () => {
  return (
    <>
      <Sidebar />
      <div className="main-content">
        <Header />
        <EditProduct />
      </div>
    </>
  );
};

export default withAuth(ManageEditProduct);