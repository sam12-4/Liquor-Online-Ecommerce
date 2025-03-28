import { motion } from 'framer-motion';

const Loader = ({ fullScreen = true, size = 'medium' }) => {
  // Size configurations
  const sizes = {
    small: 'h-6 w-6 border-2',
    medium: 'h-12 w-12 border-3',
    large: 'h-16 w-16 border-4'
  };

  const sizeClass = sizes[size] || sizes.medium;
  
  // Spinner component
  const Spinner = () => (
    <motion.div 
      className={`rounded-full ${sizeClass} border-t-primary border-r-primary border-b-transparent border-l-transparent animate-spin`}
      animate={{ rotate: 360 }}
      transition={{ 
        repeat: Infinity, 
        duration: 1, 
        ease: "linear" 
      }}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center">
          <Spinner />
          <motion.p 
            className="mt-4 text-dark font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Loading...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Spinner />
      <p className="mt-2 text-dark font-medium">Loading...</p>
    </div>
  );
};

export default Loader; 