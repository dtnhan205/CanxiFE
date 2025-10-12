import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ScrollAnimation = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: true,
      offset: 200, 
      easing: 'ease-in-out',
      delay: 200, 
    });
  }, []);

  return null;
};

export default ScrollAnimation;