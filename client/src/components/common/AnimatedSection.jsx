import { Fade } from 'react-awesome-reveal';

const AnimatedSection = ({ 
  children, 
  className = '', 
  delay = 0, 
  duration = 1000, 
  direction = 'up', 
  triggerOnce = true, 
  cascade = false
}) => {
  return (
    <Fade
      direction={direction}
      delay={delay}
      duration={duration}
      triggerOnce={triggerOnce}
      cascade={cascade}
      className={className}
    >
      {children}
    </Fade>
  );
};

export default AnimatedSection; 