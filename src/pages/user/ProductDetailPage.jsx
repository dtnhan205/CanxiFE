import React from 'react';
import TopBar from '../../components/TopBar';
import Header from '../../components/Header';
import ProductHero from '../../components/ProductHero';
import ProductDetail from '../../components/ProductDetail';
import Footer from '../../components/Footer';
import UnicalInfo from '../../components/UnicalInfo';
import UniqueFeatures from '../../components/UniqueFeatures';



import '../../styles/Responsive.css';
import '../../styles/product-detail.css';
import '../../styles/checkout.css'
import '../../styles/Footer.css';
import '../../styles/Header.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ProductDetailPage = () => {
  return (
    <div>
      <TopBar />
      <Header />
      <ProductHero />
      <ProductDetail />
      <UnicalInfo />
      <UniqueFeatures />
      <Footer />
    </div>
  );
};

export default ProductDetailPage;