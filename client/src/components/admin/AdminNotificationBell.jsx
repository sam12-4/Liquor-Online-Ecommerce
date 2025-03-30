import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminNotifications } from '../../contexts/AdminNotificationContext';
import { BellIcon } from '@heroicons/react/24/outline';
import { BellAlertIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';

const AdminNotificationBell = () => {
  const { notifications, unreadCount, markAsRead } = useAdminNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification._id);
    }
    setDropdownOpen(false);
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If same day, show only time
    if (date.toDateString() === now.toDateString()) {
      return format(date, 'h:mm a');
    }
    
    // If within 7 days, show day of week
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return format(date, 'EEE, h:mm a');
    }
    
    // Otherwise show date
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-1 rounded-full text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Notifications"
      >
        {unreadCount > 0 ? (
          <>
            <BellAlertIcon className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </>
        ) : (
          <BellIcon className="h-6 w-6" />
        )}
      </button>

      {dropdownOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-2 px-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
            <Link 
              to="/admin/dashboard/notifications" 
              className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
              onClick={() => setDropdownOpen(false)}
            >
              View all
            </Link>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-3 px-4 text-sm text-gray-500 text-center">
                No notifications
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.slice(0, 5).map((notification) => (
                  <Link
                    key={notification._id}
                    to={`/admin/dashboard/notifications/${notification._id}`}
                    className={`block px-4 py-3 hover:bg-gray-50 ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5 truncate">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatTimestamp(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && (
                        <span className="inline-flex items-center justify-center h-2 w-2 rounded-full bg-indigo-600 ml-2 mt-1.5"></span>
                      )}
                    </div>
                  </Link>
                ))}
                
                {notifications.length > 5 && (
                  <div className="py-2 px-4 text-center">
                    <Link 
                      to="/admin/dashboard/notifications" 
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                      onClick={() => setDropdownOpen(false)}
                    >
                      View {notifications.length - 5} more
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationBell; 