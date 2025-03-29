// Admin auth utility functions
const API_URL = 'http://localhost:5000/api';

/**
 * Login admin with username/email and password
 * @param {Object} credentials - Admin credentials
 * @param {string} credentials.username - Username or email
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} - Admin data or error
 */
export const loginAdmin = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store admin info in localStorage for UI purposes
    // (actual authentication is handled by httpOnly cookie)
    localStorage.setItem('adminInfo', JSON.stringify({
      id: data.admin.id,
      username: data.admin.username,
      email: data.admin.email,
      lastLogin: data.admin.lastLogin
    }));

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout admin
 * @returns {Promise<Object>} - Success message or error
 */
export const logoutAdmin = async () => {
  try {
    const response = await fetch(`${API_URL}/admin/logout`, {
      method: 'POST',
      credentials: 'include', // Include cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Logout failed');
    }

    // Clear localStorage
    localStorage.removeItem('adminInfo');

    return data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Check if admin is authenticated
 * @returns {Promise<Object>} - Admin data or error
 */
export const checkAdminAuth = async () => {
  try {
    const response = await fetch(`${API_URL}/admin/me`, {
      method: 'GET',
      credentials: 'include', // Include cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Authentication check failed');
    }

    // Update localStorage with latest admin info
    localStorage.setItem('adminInfo', JSON.stringify({
      id: data.admin.id,
      username: data.admin.username,
      email: data.admin.email,
      lastLogin: data.admin.lastLogin
    }));

    return data;
  } catch (error) {
    console.error('Auth check error:', error);
    // Clear localStorage on auth failure
    localStorage.removeItem('adminInfo');
    throw error;
  }
};

/**
 * Get admin info from localStorage
 * @returns {Object|null} - Admin info or null if not logged in
 */
export const getAdminInfo = () => {
  const adminInfo = localStorage.getItem('adminInfo');
  return adminInfo ? JSON.parse(adminInfo) : null;
}; 