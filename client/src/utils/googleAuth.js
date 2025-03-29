// API URL
const API_URL = 'http://localhost:5000/api';

/**
 * Authenticate with Google
 * @param {string} googleToken - The token received from Google OAuth
 * @returns {Promise} - Promise that resolves to the response data
 */
export const googleLogin = async (googleToken) => {
  try {
    const response = await fetch(`${API_URL}/users/google-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Include cookies
      body: JSON.stringify({ token: googleToken })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}; 