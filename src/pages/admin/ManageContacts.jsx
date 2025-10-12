import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ContactContent from './components/ContactContent';
import '../../styles/admin/ContactAdmin.css';
import { withAuth } from '../../utils/authUtils'; 

const ManageContacts = () => {
  return (
    <>
      <Sidebar />
      <div className="main-content">
        <Header />
        <ContactContent />
      </div>
    </>
  );
};

export default withAuth(ManageContacts); 