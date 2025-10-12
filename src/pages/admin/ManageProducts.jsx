import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProductContent from './components/ProductContent';
import '../../styles/admin/ProductAdmin.css';
import '../../styles/admin/ProductForm.css';

import { withAuth } from '../../utils/authUtils'; 

const ProductAdmin = () => {
  return (
    <>
      <Sidebar />
      <div className="main-content">
        <Header />
        <ProductContent />
      </div>
    </>
  );
};

export default withAuth(ProductAdmin); 