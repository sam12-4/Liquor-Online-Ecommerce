import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimatedSection = ({ 
  children, 
  className = "", 
  delay = 0, 
  threshold = 0.2,
  distance = 30 
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: threshold,
    rootMargin: '0px',
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: distance }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
      transition={{ 
        duration: 0.8, 
        delay: delay, 
        ease: "easeOut" 
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection; 