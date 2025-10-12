import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CreateProduct from './components/CreateProduct'; 
import '../../styles/admin/ProductAdmin.css';
import '../../styles/admin/ProductForm.css';
import { withAuth } from '../../utils/authUtils';

const ManageCreateProduct = () => {
  return (
    <>
      <Sidebar />
      <div className="main-content">
        <Header />
        <CreateProduct />
      </div>
    </>
  );
};

export default withAuth(ManageCreateProduct);