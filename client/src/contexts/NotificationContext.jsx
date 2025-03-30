import { createContext, useState, useContext, useEffect } from 'react';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../utils/notificationService';
import { useUserAuth } from './UserAuthContext';
import { AUTH_EVENTS, authEvents } from './UserAuthContext';

// Create notification context
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useUserAuth();

  // Fetch notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      // Reset state when user is not authenticated
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);
  
  // Listen for auth events to reset or fetch notifications
  useEffect(() => {
    const handleLogin = () => {
      fetchNotifications();
    };
    
    const handleLogout = () => {
      setNotifications([]);
      setUnreadCount(0);
    };
    
    // Register listeners
    const loginUnsubscribe = authEvents.on(AUTH_EVENTS.LOGIN, handleLogin);
    const logoutUnsubscribe = authEvents.on(AUTH_EVENTS.LOGOUT, handleLogout);
    
    // Clean up listeners
    return () => {
      loginUnsubscribe();
      logoutUnsubscribe();
    };
  }, []);
  
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
      const response = await getNotifications();
      if (response.success) {
        setNotifications(response.notifications);
        setUnreadCount(response.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notifications');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await markNotificationAsRead(notificationId);
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
      const response = await markAllNotificationsAsRead();
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
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 