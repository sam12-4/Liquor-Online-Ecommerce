import { useEffect } from 'react';
import { Fade } from 'react-awesome-reveal';

const PageWrapper = ({ 
  children, 
  className = '',
  direction = 'up',
  delay = 0,
  duration = 800,
  damping = 0.1
}) => {
  // Add 'reveal-animation' class to all section elements when they enter viewport
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-animation');
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, { threshold: 0.1 });
    
    // Target all major content sections within the page
    const sections = document.querySelectorAll('section, .product-card, .content-block, .card, article, .section');
    sections.forEach(section => {
      observer.observe(section);
    });
    
    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);
  
  return (
    <Fade
      direction={direction}
      delay={delay}
      duration={duration}
      damping={damping}
      triggerOnce={true}
      className={`page-content ${className}`}
    >
      {children}
    </Fade>
  );
};

export default PageWrapper; 