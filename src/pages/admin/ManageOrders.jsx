import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OrderContent from './components/OrderContent';
import { withAuth } from '../../utils/authUtils'; 

const ManageOrders = () => {
  return (
    <>
      <Sidebar />
      <div className="main-content">
        <Header />
        <OrderContent />
      </div>
    </>
  );
};

export default withAuth(ManageOrders); 