import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserIcon } from '@heroicons/react/24/outline';
import AnimatedSection from '../components/home/AnimatedSection';
import { useUserAuth } from '../contexts/UserAuthContext';

// Import banner image
import bannerImg from '../assets/images/Slide1.jpg';

const MyAccountPage = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, loading, error, validationErrors, clearErrors } = useUserAuth();
  
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  
  const [registerError, setRegisterError] = useState(null);
  const [loginError, setLoginError] = useState(null);
  
  // Form validation states
  const [formErrors, setFormErrors] = useState({
    login: {},
    register: {}
  });
  
  // Track if fields have been touched for validation
  const [touched, setTouched] = useState({
    login: {},
    register: {}
  });
  
  useEffect(() => {
    document.title = 'My Account - Liquor Online';
    
    // Redirect to home if already authenticated
    if (isAuthenticated) {
      navigate('/');
    }
    
    // Clear authentication errors when component unmounts
    return () => {
      clearErrors();
    };
  }, [isAuthenticated, navigate, clearErrors]);
  
  // Update local error states when context errors change
  useEffect(() => {
    if (error) {
      // Determine if error is related to login or registration based on the form that was submitted
      if (loginForm.username && loginForm.password) {
        setLoginError(error);
      } else {
        setRegisterError(error);
      }
    }
    
    // Update form errors with server validation errors
    if (Object.keys(validationErrors).length > 0) {
      // Map server validation errors to our form structure
      const loginValidationErrors = {};
      const registerValidationErrors = {};
      
      Object.entries(validationErrors).forEach(([field, message]) => {
        // For login form fields
        if (field === 'username' || field === 'password') {
          loginValidationErrors[field] = message;
        }
        
        // For register form fields
        if (['username', 'email', 'password'].includes(field)) {
          registerValidationErrors[field] = message;
          
          // Set specific error message for already existing username/email
          if (message.includes('already exists')) {
            setRegisterError(`This ${field} is already registered. Please use a different ${field} or login to your account.`);
            
            // Set a specific field error message as well
            registerValidationErrors[field] = `This ${field} already exists. Please choose another.`;
          }
        }
      });
      
      // Update form errors
      if (Object.keys(loginValidationErrors).length > 0) {
        setFormErrors(prev => ({ 
          ...prev, 
          login: { ...prev.login, ...loginValidationErrors }
        }));
      }
      
      if (Object.keys(registerValidationErrors).length > 0) {
        setFormErrors(prev => ({ 
          ...prev, 
          register: { ...prev.register, ...registerValidationErrors }
        }));
      }
    }
  }, [error, validationErrors, loginForm.username, loginForm.password]);
  
  // Validate login form
  const validateLoginForm = () => {
    const errors = {};
    
    if (!loginForm.username.trim()) {
      errors.username = 'Username or email is required';
    }
    
    if (!loginForm.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(prev => ({ ...prev, login: errors }));
    return Object.keys(errors).length === 0;
  };
  
  // Validate register form
  const validateRegisterForm = () => {
    const errors = {};
    
    // Username validation
    if (!registerForm.username.trim()) {
      errors.username = 'Username is required';
    } else if (registerForm.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (registerForm.username.length > 30) {
      errors.username = 'Username cannot exceed 30 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(registerForm.username)) {
      errors.username = 'Username can only contain letters, numbers, underscores and hyphens';
    }
    
    // Email validation
    if (!registerForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!registerForm.password) {
      errors.password = 'Password is required';
    } else if (registerForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(registerForm.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    // Confirm password validation
    if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms validation
    if (!registerForm.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setFormErrors(prev => ({ ...prev, register: errors }));
    return Object.keys(errors).length === 0;
  };
  
  // Handle field blur for validation
  const handleBlur = (formType, field) => {
    setTouched(prev => ({
      ...prev,
      [formType]: {
        ...prev[formType],
        [field]: true
      }
    }));
    
    if (formType === 'login') {
      validateLoginForm();
    } else {
      validateRegisterForm();
    }
  };
  
  // Handle login form change
  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear specific error when field is changed
    setFormErrors(prev => ({
      ...prev,
      login: {
        ...prev.login,
        [name]: ''
      }
    }));
  };
  
  // Handle register form change
  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear specific error when field is changed
    setFormErrors(prev => ({
      ...prev,
      register: {
        ...prev.register,
        [name]: ''
      }
    }));
  };
  
  // Handle login form submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    
    // Validate form before submission
    const isValid = validateLoginForm();
    if (!isValid) return;
    
    try {
      const success = await login({
        username: loginForm.username,
        password: loginForm.password
      });
      
      if (!success) {
        setLoginError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setLoginError(err.message || 'An error occurred during login');
      console.error('Login error:', err);
    }
  };
  
  // Handle register form submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError(null);
    // Clear form errors
    setFormErrors(prev => ({
      ...prev,
      register: {}
    }));
    
    // Validate form before submission
    const isValid = validateRegisterForm();
    if (!isValid) return;
    
    try {
      const success = await register({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password
      });
      
      if (!success && !Object.keys(validationErrors).length) {
        setRegisterError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      // If no specific field validation errors were set by the context
      if (!Object.keys(validationErrors).length) {
        setRegisterError(err.message || 'An error occurred during registration');
      }
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={bannerImg}
            alt="Account Banner"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative z-10 text-center py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My Account
          </h1>
          <div className="flex items-center justify-center text-white/80">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <span className="font-medium">My Account</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Login Form */}
          <div className="bg-white p-6 border border-gray-200">
            <div className="flex items-center justify-center mb-6">
              <UserIcon className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-medium">Login</h2>
            </div>
            <div className="border-b border-gray-200 mb-6"></div>
            
            {loginError && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
                <p>{loginError}</p>
              </div>
            )}
            
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Username or email address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="username"
                  value={loginForm.username}
                  onChange={handleLoginChange}
                  onBlur={() => handleBlur('login', 'username')}
                  className={`w-full p-3 border ${formErrors.login.username && touched.login.username ? 'border-red-500' : 'border-gray-300'} focus:border-[#c0a483] focus:outline-none`}
                  required
                />
                {formErrors.login.username && touched.login.username && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.login.username}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input 
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  onBlur={() => handleBlur('login', 'password')}
                  className={`w-full p-3 border ${formErrors.login.password && touched.login.password ? 'border-red-500' : 'border-gray-300'} focus:border-[#c0a483] focus:outline-none`}
                  required
                />
                {formErrors.login.password && touched.login.password && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.login.password}</p>
                )}
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="rememberMe"
                    checked={loginForm.rememberMe}
                    onChange={handleLoginChange}
                    className="w-4 h-4 text-[#c0a483]" 
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
                
                <Link to="/forgot-password" className="text-[#c0a483] hover:underline text-sm">
                  Lost your password?
                </Link>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-gray-800 text-white py-3 uppercase font-medium transition-colors disabled:bg-gray-400"
              >
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </button>
            </form>
          </div>
          
          {/* Register Form */}
          <div className="bg-white p-6 border border-gray-200">
            <div className="flex items-center justify-center mb-6">
              <UserIcon className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-medium">Register</h2>
            </div>
            <div className="border-b border-gray-200 mb-6"></div>
            
            {registerError && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
                <p>{registerError}</p>
              </div>
            )}
            
            <form onSubmit={handleRegisterSubmit}>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  name="username"
                  value={registerForm.username}
                  onChange={handleRegisterChange}
                  onBlur={() => handleBlur('register', 'username')}
                  className={`w-full p-3 border ${formErrors.register.username && touched.register.username ? 'border-red-500' : 'border-gray-300'} focus:border-[#c0a483] focus:outline-none`}
                  required
                />
                {formErrors.register.username && touched.register.username && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.register.username}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  onBlur={() => handleBlur('register', 'email')}
                  className={`w-full p-3 border ${formErrors.register.email && touched.register.email ? 'border-red-500' : 'border-gray-300'} focus:border-[#c0a483] focus:outline-none`}
                  required
                />
                {formErrors.register.email && touched.register.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.register.email}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input 
                  type="password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  onBlur={() => handleBlur('register', 'password')}
                  className={`w-full p-3 border ${formErrors.register.password && touched.register.password ? 'border-red-500' : 'border-gray-300'} focus:border-[#c0a483] focus:outline-none`}
                  required
                />
                {formErrors.register.password && touched.register.password && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.register.password}</p>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters and include uppercase, lowercase, and numbers.
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input 
                  type="password"
                  name="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  onBlur={() => handleBlur('register', 'confirmPassword')}
                  className={`w-full p-3 border ${formErrors.register.confirmPassword && touched.register.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:border-[#c0a483] focus:outline-none`}
                  required
                />
                {formErrors.register.confirmPassword && touched.register.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.register.confirmPassword}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label className={`flex items-center space-x-2 cursor-pointer text-sm ${formErrors.register.acceptTerms ? 'text-red-500' : 'text-gray-600'}`}>
                  <input 
                    type="checkbox" 
                    name="acceptTerms"
                    checked={registerForm.acceptTerms}
                    onChange={handleRegisterChange}
                    onBlur={() => handleBlur('register', 'acceptTerms')}
                    className={`w-4 h-4 ${formErrors.register.acceptTerms ? 'border-red-500' : 'text-[#c0a483]'}`}
                  />
                  <span>
                    I agree to the <a href="#" className="text-[#c0a483] hover:underline">terms and conditions</a> and the <a href="#" className="text-[#c0a483] hover:underline">privacy policy</a>
                  </span>
                </label>
                {formErrors.register.acceptTerms && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.register.acceptTerms}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 uppercase font-medium transition-colors disabled:bg-gray-200"
              >
                {loading ? 'REGISTERING...' : 'REGISTER'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage; 