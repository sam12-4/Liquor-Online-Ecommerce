const API_URL = 'http://localhost:5000/api';

/**
 * Create a new order
 * @param {Object} orderData - The order data
 * @returns {Promise} - Promise that resolves to the response data
 */
export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Track an order by its orderId
 * @param {string} orderId - The order ID to track
 * @returns {Promise} - Promise that resolves to the response data
 */
export const trackOrder = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/orders/track/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error tracking order:', error);
    throw error;
  }
};

/**
 * Get all orders for the authenticated user
 * @returns {Promise} - Promise that resolves to the response data
 */
export const getUserOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Include cookies for authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

/**
 * Get order details by orderId (for authenticated users)
 * @param {string} orderId - The order ID
 * @returns {Promise} - Promise that resolves to the response data
 */
export const getOrderDetails = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Include cookies for authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
}; 