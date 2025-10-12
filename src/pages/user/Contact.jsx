import React from 'react';
import TopBar from '../../components/TopBar';
import Header from '../../components/Header';
import ContactContent from '../../components/ContactContent';
import Footer from '../../components/Footer';

import '../../styles/Contact.css';
import '../../styles/Footer.css';
import '../../styles/Header.css';

const Contact = () => {
  return (
    <>
      <TopBar />
      <Header />
      <ContactContent />
      <Footer />
    </>
  );
};

export default Contact;