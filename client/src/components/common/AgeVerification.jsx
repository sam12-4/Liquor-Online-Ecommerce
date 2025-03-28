import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

const AgeVerification = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already verified age
    const hasVerified = localStorage.getItem('ageVerified');
    
    // If not verified, show modal
    if (!hasVerified) {
      setIsVisible(true);
    }
  }, []);

  const handleVerify = () => {
    // Save verification to localStorage
    localStorage.setItem('ageVerified', 'true');
    setIsVisible(false);
  };

  const handleReject = () => {
    // Redirect to a page explaining why access is denied
    window.location.href = 'https://www.responsibility.org/';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20 }}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative"
            >
              <div className="bg-gradient-to-r from-primary to-secondary h-20 relative">
                <div className="absolute inset-0 bg-pattern opacity-10"></div>
              </div>
              
              <div className="p-6 sm:p-10">
                <div className="text-center">
                  <h3 className="text-2xl sm:text-3xl font-bold text-dark mb-4">Age Verification</h3>
                  <p className="text-gray-600 mb-6">
                    You must be of legal drinking age to enter this website. 
                    Please verify that you are at least 21 years old.
                  </p>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleVerify}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 px-5 rounded-md font-medium transition-colors"
                  >
                    I am 21 or older
                  </button>
                  <button
                    onClick={handleReject}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-5 rounded-md font-medium transition-colors"
                  >
                    I am under 21
                  </button>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    By entering this site you accept our <a href="#" className="text-primary underline">Terms and Conditions</a> and <a href="#" className="text-primary underline">Privacy Policy</a>.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AgeVerification; 