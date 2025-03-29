// API URL
const API_URL = 'http://localhost:5000/api';

/**
 * Handle API errors and extract error messages
 * @param {Response} response - Fetch response object
 * @returns {Promise} - Promise that resolves to error data
 */
const handleApiError = async (response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const errorData = await response.json();
    
    // Handle validation errors from express-validator
    if (errorData.errors && Array.isArray(errorData.errors)) {
      // Format validation errors to be more user-friendly
      const errorMap = {};
      errorData.errors.forEach(err => {
        errorMap[err.field] = err.message;
      });
      
      // Create error with additional field-specific error information
      const error = new Error(errorData.message || 'Validation failed');
      error.validation = errorMap;
      error.validationErrors = errorData.errors;
      throw error;
    }
    
    throw new Error(errorData.message || `Error: ${response.status}`);
  }
  
  throw new Error(`Request failed with status ${response.status}`);
};

/**
 * Login a user
 * @param {Object} credentials - User credentials (username/email, password)
 * @returns {Promise} - Promise that resolves to the response data
 */
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Include cookies
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User data (username, email, password)
 * @returns {Promise} - Promise that resolves to the response data
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Include cookies
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Logout the current user
 * @returns {Promise} - Promise that resolves when logout is successful
 */
export const logoutUser = async () => {
  try {
    const response = await fetch(`${API_URL}/users/logout`, {
      method: 'POST',
      credentials: 'include' // Include cookies
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Check if user is authenticated
 * @returns {Promise} - Promise that resolves to the response data
 */
export const checkUserAuth = async () => {
  try {
    const response = await fetch(`${API_URL}/users/check-auth`, {
      method: 'GET',
      credentials: 'include' // Include cookies
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user info from localStorage
 * @returns {Object|null} - User information or null if not found
 */
export const getUserInfo = () => {
  try {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error getting user info from localStorage:', error);
    return null;
  }
};

/**
 * Save user info to localStorage
 * @param {Object} user - User information
 */
export const saveUserInfo = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user info to localStorage:', error);
  }
};

/**
 * Remove user info from localStorage
 */
export const removeUserInfo = () => {
  try {
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error removing user info from localStorage:', error);
  }
}; 