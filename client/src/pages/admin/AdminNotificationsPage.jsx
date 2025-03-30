import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminNotifications } from '../../contexts/AdminNotificationContext';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

// Import icons
import { 
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  DocumentCheckIcon,
  ExclamationCircleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const AdminNotificationsPage = () => {
  const { notifications, loading, error, markAsRead, markAllAsRead, fetchNotifications } = useAdminNotifications();
  const [activeTab, setActiveTab] = useState('all'); // all, unread, read

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      toast.error('Failed to mark all as read');
    }
  };

  const handleRefresh = () => {
    fetchNotifications();
    toast.info('Notifications refreshed');
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return format(date, 'MMM d, yyyy, h:mm a');
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    if (activeTab === 'read') return notification.read;
    return true;
  });

  // Get icon based on notification type
  const getNotificationIcon = (notification) => {
    const { type, orderStatus } = notification;
    
    if (type === 'order_placed') {
      return <DocumentCheckIcon className="h-5 w-5 text-indigo-600" />;
    }
    
    if (type === 'order_status_change') {
      switch (orderStatus) {
        case 'pending to be confirmed':
          return <ClockIcon className="h-5 w-5 text-yellow-500" />;
        case 'confirmed':
          return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
        case 'processing':
          return <DocumentCheckIcon className="h-5 w-5 text-purple-500" />;
        case 'shipped':
          return <TruckIcon className="h-5 w-5 text-indigo-500" />;
        case 'delivered':
          return <CheckIcon className="h-5 w-5 text-green-500" />;
        case 'cancelled':
          return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
        default:
          return <BellIcon className="h-5 w-5 text-gray-500" />;
      }
    }
    
    return <BellIcon className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Notifications</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              All system and order notifications
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Refresh
            </button>
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={!notifications.some(n => !n.read)}
            >
              Mark All as Read
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-200">
          <div className="px-4 py-3 sm:px-6 border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                className={`pb-2 px-1 ${
                  activeTab === 'all'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button
                className={`pb-2 px-1 ${
                  activeTab === 'unread'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('unread')}
              >
                Unread
              </button>
              <button
                className={`pb-2 px-1 ${
                  activeTab === 'read'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('read')}
              >
                Read
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="px-4 py-8 sm:px-6 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="px-4 py-8 sm:px-6 text-center text-red-500">
              <p>{error}</p>
              <button 
                onClick={handleRefresh}
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Try Again
              </button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="px-4 py-8 sm:px-6 text-center text-gray-500">
              <BellIcon className="h-10 w-10 text-gray-300 mx-auto" />
              <p className="mt-2 text-sm">No notifications found</p>
              {activeTab !== 'all' && (
                <p className="mt-1 text-xs">
                  Try switching to the "All" tab to see all notifications
                </p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <Link 
                  key={notification._id}
                  to={`/admin/dashboard/notifications/${notification._id}`}
                  className={`block hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                  onClick={async () => {
                    if (!notification.read) {
                      await markAsRead(notification._id);
                    }
                  }}
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification)}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              New
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex justify-between">
                          <p className="text-xs text-gray-500">
                            {formatTimestamp(notification.createdAt)}
                          </p>
                          {notification.orderId && (
                            <p className="text-xs text-indigo-600">
                              Order #{notification.orderId}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationsPage; 