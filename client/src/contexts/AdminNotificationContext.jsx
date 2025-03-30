import { createContext, useState, useContext, useEffect } from 'react';
import { getAdminNotifications, markAdminNotificationAsRead, markAllAdminNotificationsAsRead } from '../utils/adminNotificationService';
import { useAdminAuth } from './AdminAuthContext';

// Create admin notification context
const AdminNotificationContext = createContext();

export const AdminNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAdminAuth();

  // Fetch notifications when admin is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      // Reset state when admin is not authenticated
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);
  
  // Polling for new notifications (every 30 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const intervalId = setInterval(() => {
      fetchNotifications(false); // Silent refresh (no loading state)
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  const fetchNotifications = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);
    
    try {
      const response = await getAdminNotifications();
      if (response.success) {
        setNotifications(response.notifications);
        setUnreadCount(response.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch admin notifications:', err);
      setError('Failed to load notifications');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await markAdminNotificationAsRead(notificationId);
      if (response.success) {
        // Update the notification in the state
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => 
            notification._id === notificationId 
              ? { ...notification, read: true } 
              : notification
          )
        );
        
        // Update unread count
        setUnreadCount(response.unreadCount);
      }
      return response;
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      throw err;
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await markAllAdminNotificationsAsRead();
      if (response.success) {
        // Update all notifications in the state
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => ({ ...notification, read: true }))
        );
        
        // Reset unread count
        setUnreadCount(0);
      }
      return response;
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      throw err;
    }
  };

  // Context value
  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };

  return (
    <AdminNotificationContext.Provider value={value}>
      {children}
    </AdminNotificationContext.Provider>
  );
};

// Custom hook to use the admin notification context
export const useAdminNotifications = () => {
  const context = useContext(AdminNotificationContext);
  if (!context) {
    throw new Error('useAdminNotifications must be used within an AdminNotificationProvider');
  }
  return context;
}; 