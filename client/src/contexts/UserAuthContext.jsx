import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, logoutUser, checkUserAuth, getUserInfo, saveUserInfo, removeUserInfo, registerUser } from '../utils/userAuth';

// Create context
const UserAuthContext = createContext();

// User auth provider component
export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserInfo());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setLoading(true);
        const response = await checkUserAuth();
        if (response.user) {
          setUser(response.user);
          saveUserInfo(response.user);
        } else {
          setUser(null);
          removeUserInfo();
        }
        setError(null);
        setValidationErrors({});
      } catch (err) {
        console.log('Auth verification error:', err);
        setUser(null);
        removeUserInfo();
        // Don't set error on initial load as it might be normal for user to not be logged in
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // Clear errors
  const clearErrors = () => {
    setError(null);
    setValidationErrors({});
  };

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      clearErrors();
      const response = await loginUser(credentials);
      if (response.user) {
        setUser(response.user);
        saveUserInfo(response.user);
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      // Handle field-specific validation errors
      if (err.validation) {
        setValidationErrors(err.validation);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      clearErrors();
      const response = await registerUser(userData);
      if (response.user) {
        setUser(response.user);
        saveUserInfo(response.user);
        return true;
      }
      return false;
    } catch (err) {
      console.log('Registration error:', err);
      setError(err.message);
      
      // Handle field-specific validation errors
      if (err.validation) {
        // Enhanced logging for debugging
        console.log('Validation errors:', err.validation);
        setValidationErrors(err.validation);
        
        // If there's a username or email already exists error, make it more user-friendly
        if (err.validation.username && err.validation.username.includes('already exists')) {
          setError(`Username "${userData.username}" is already taken. Please choose another username.`);
        } else if (err.validation.email && err.validation.email.includes('already exists')) {
          setError(`Email "${userData.email}" is already registered. Please use a different email or login to your account.`);
        }
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setUser(null);
      removeUserInfo();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    validationErrors,
    login,
    register,
    logout,
    clearErrors
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
};

// Custom hook to use the user auth context
export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
}; 