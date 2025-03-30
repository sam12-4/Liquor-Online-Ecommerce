const API_URL = 'http://localhost:5000/api';

/**
 * Get all notifications for the authenticated admin
 * @returns {Promise} - Promise that resolves to the response data
 */
export const getAdminNotifications = async () => {
  try {
    const response = await fetch(`${API_URL}/admin/notifications`, {
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
    console.error('Error fetching admin notifications:', error);
    throw error;
  }
};

/**
 * Mark a notification as read for admin
 * @param {string} notificationId - The notification ID to mark as read
 * @returns {Promise} - Promise that resolves to the response data
 */
export const markAdminNotificationAsRead = async (notificationId) => {
  try {
    const response = await fetch(`${API_URL}/admin/notifications/${notificationId}/read`, {
      method: 'PUT',
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
    console.error('Error marking admin notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read for admin
 * @returns {Promise} - Promise that resolves to the response data
 */
export const markAllAdminNotificationsAsRead = async () => {
  try {
    const response = await fetch(`${API_URL}/admin/notifications/read-all`, {
      method: 'PUT',
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
    console.error('Error marking all admin notifications as read:', error);
    throw error;
  }
}; 