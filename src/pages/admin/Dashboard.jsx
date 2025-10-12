import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardContent from './components/DashboardContent';
import '../../styles/admin/DashboardAdmin.css';
import { withAuth } from '../../utils/authUtils'; 

const Dashboard = () => {
  return (
    <>
      <Sidebar />
      <div className="main-content">
        <Header />
        <DashboardContent />
      </div>
    </>
  );
};

export default withAuth(Dashboard); 