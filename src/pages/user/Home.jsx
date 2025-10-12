import React from 'react';
import TopBar from '../../components/TopBar';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import ProductSection from '../../components/ProductSection';
import Footer from '../../components/Footer';
import Features from '../../components/Features';
import CalciumDeficiency from "../../components/CalciumDeficiency";
import BanDeAn818 from '../../components/BanDeAn818';
import UseageGuide from '../../components/UsageGuide';
import ExpertOpinion from '../../components/ExpertOpinion';
import UniqueFeatures from '../../components/UniqueFeatures';
import Certificate from '../../components/Certificate';
import Feedback from '../../components/Feedback';
import UnicalInfo from '../../components/UnicalInfo';
import ScrollAnimation from '../../components/ScrollAnimation';

import '../../styles/Home.css';
import '../../styles/Responsive.css';
import '../../styles/Footer.css';
import '../../styles/Header.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Home = () => (
  <div>
    <ScrollAnimation />
    <TopBar />
    <Header />
    <Hero />
    
    {/* Features - bay từ trái sang */}
    <div data-aos="fade-right">
      <Features />
    </div>
    
    {/* ProductSection - bay từ phải sang */}
    <div data-aos="fade-left">
      <ProductSection />
    </div>
    
    {/* CalciumDeficiency - bay từ dưới lên */}
    <div data-aos="fade-up">
      <CalciumDeficiency />
    </div>
    
    {/* BanDeAn818 - bay từ trái sang */}
    <div data-aos="fade-right">
      <BanDeAn818 />
    </div>
    
    {/* UseageGuide - bay từ phải sang */}
    <div data-aos="fade-left">
      <UseageGuide />
    </div>
    
    {/* UnicalInfo - zoom in */}
    <div data-aos="zoom-in">
      <UnicalInfo />
    </div>
    
    {/* ProductSection lần 2 - bay từ dưới lên */}
    <div data-aos="fade-up">
      <ProductSection />
    </div>
    
    {/* ExpertOpinion - bay từ trái sang */}
    <div data-aos="fade-right">
      <ExpertOpinion />
    </div>
    
    {/* Feedback - bay từ phải sang */}
    <div data-aos="fade-left">
      <Feedback />
    </div>
    
    {/* UniqueFeatures - bay từ dưới lên */}
    <div data-aos="fade-up">
      <UniqueFeatures />
    </div>
    
    {/* Certificate - zoom in */}
    <div data-aos="zoom-in">
      <Certificate />
    </div>
    
    <Footer />
  </div>
);

export default Home;