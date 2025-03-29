import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, logoutAdmin, checkAdminAuth, getAdminInfo } from '../utils/adminAuth';

// Create context
const AdminAuthContext = createContext();

// Admin auth provider component
export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(getAdminInfo());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setLoading(true);
        const response = await checkAdminAuth();
        setAdmin(response.admin);
        setError(null);
      } catch (err) {
        console.log('Auth verification error:', err);
        setAdmin(null);
        // Don't set error on initial load as it might be normal for user to not be logged in
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await loginAdmin(credentials);
      setAdmin(response.admin);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await logoutAdmin();
      setAdmin(null);
      navigate('/admin');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    admin,
    isAuthenticated: !!admin,
    loading,
    error,
    login,
    logout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Custom hook to use the admin auth context
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}; 