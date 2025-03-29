import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useUserAuth } from '../../contexts/UserAuthContext';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading, error } = useAdminAuth();
  const { isAuthenticated: isUserAuthenticated } = useUserAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [loginInProgress, setLoginInProgress] = useState(false);

  useEffect(() => {
    document.title = 'Admin Login - Liquor Online';
    
    // Redirect to dashboard if already authenticated as admin
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
    
    // Redirect to home if authenticated as a regular user
    if (isUserAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isUserAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoginInProgress(true);
      const success = await login({
        username: formData.username,
        password: formData.password
      });
      
      if (success) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoginInProgress(false);
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative h-64 bg-dark flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://ext.same-assets.com/1701767421/4224202088.png"
            alt="Admin Login Banner"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Admin Login
          </motion.h1>
          <motion.div
            className="flex items-center justify-center text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <span className="font-medium">Admin</span>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-dark mb-6 text-center">Administrator Access</h2>
          
          {/* Display error message if there is one */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 mb-2">Username or Email</label>
              <input 
                type="text" 
                id="username" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c0a483] focus:border-transparent"
                disabled={loginInProgress}
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c0a483] focus:border-transparent"
                disabled={loginInProgress}
                required
              />
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="rememberMe" 
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  disabled={loginInProgress}
                />
                <label htmlFor="rememberMe" className="ml-2 text-gray-700">Remember me</label>
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loginInProgress || loading}
              className="w-full bg-black text-white py-3 uppercase font-serif transition-colors hover:bg-[#c0a483] disabled:bg-gray-400"
            >
              {loginInProgress ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-primary hover:text-primary/80">Return to Homepage</Link>
          </div>
          
          {/* Default credentials info for demo purposes */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Default Admin Credentials:</p>
              <p>Username: admin</p>
              <p>Email: admin@example.com</p>
              <p>Password: admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage; 