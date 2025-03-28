import { useEffect, useRef, useState } from 'react';

const AnimatedElement = ({ 
  children, 
  className = '',
  animation = 'fadeInUp',
  delay = 0,
  threshold = 0.1,
  once = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );
    
    const currentRef = ref.current;
    
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [once, threshold]);
  
  const getAnimationClass = () => {
    switch (animation) {
      case 'fadeInUp':
        return 'animate-fadeInUp';
      case 'fadeInDown':
        return 'animate-fadeInDown';
      case 'fadeInLeft':
        return 'animate-fadeInLeft';
      case 'fadeInRight':
        return 'animate-fadeInRight';
      case 'zoomIn':
        return 'animate-zoomIn';
      case 'bounce':
        return 'animate-bounce';
      default:
        return 'animate-fadeInUp';
    }
  };
  
  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? getAnimationClass() : 'opacity-0'}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: '600ms',
        transitionProperty: 'all',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedElement; 