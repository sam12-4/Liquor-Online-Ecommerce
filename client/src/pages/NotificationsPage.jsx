import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

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

// Banner image
import bannerImg from '../assets/images/Slide1.jpg';

const NotificationsPage = () => {
  const { notifications, loading, error, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
  const [activeTab, setActiveTab] = useState('all'); // all, unread, read
  const navigate = useNavigate();

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      toast.error('Failed to mark all as read');
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (err) {
      console.error('Failed to mark as read:', err);
      toast.error('Failed to mark as read');
    }
  };

  const handleRefresh = () => {
    fetchNotifications();
    toast.info('Notifications refreshed');
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await handleMarkAsRead(notification._id);
    }
    
    navigate(`/notifications/${notification._id}`);
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
      return <DocumentCheckIcon className="h-6 w-6 text-blue-500" />;
    }
    
    if (type === 'order_status_change') {
      switch (orderStatus) {
        case 'pending to be confirmed':
          return <ClockIcon className="h-6 w-6 text-yellow-500" />;
        case 'confirmed':
          return <CheckCircleIcon className="h-6 w-6 text-blue-500" />;
        case 'processing':
          return <DocumentCheckIcon className="h-6 w-6 text-purple-500" />;
        case 'shipped':
          return <TruckIcon className="h-6 w-6 text-indigo-500" />;
        case 'delivered':
          return <CheckIcon className="h-6 w-6 text-green-500" />;
        case 'cancelled':
          return <ExclamationCircleIcon className="h-6 w-6 text-red-500" />;
        default:
          return <BellIcon className="h-6 w-6 text-gray-500" />;
      }
    }
    
    return <BellIcon className="h-6 w-6 text-gray-500" />;
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Banner Section */}
      <div 
        className="w-full h-60 bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">My Notifications</h1>
          <div className="flex justify-center">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link to="/" className="text-white hover:text-[#c0a483] text-sm md:text-base">
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="text-gray-300 mx-2">/</span>
                    <span className="text-[#c0a483] text-sm md:text-base">
                      Notifications
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          {/* Header with tabs */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-2">
                <BellIcon className="h-6 w-6 text-gray-600" />
                <h2 className="text-xl font-medium text-gray-800">Notifications</h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRefresh}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors"
                >
                  Refresh
                </button>
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-3 py-1.5 bg-[#c0a483] text-white rounded-md text-sm hover:bg-[#a88e6e] transition-colors"
                  disabled={!notifications.some(n => !n.read)}
                >
                  Mark All as Read
                </button>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-4 border-b border-gray-200">
              <button
                className={`pb-3 px-1 ${
                  activeTab === 'all'
                    ? 'text-[#c0a483] border-b-2 border-[#c0a483] font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button
                className={`pb-3 px-1 ${
                  activeTab === 'unread'
                    ? 'text-[#c0a483] border-b-2 border-[#c0a483] font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('unread')}
              >
                Unread
              </button>
              <button
                className={`pb-3 px-1 ${
                  activeTab === 'read'
                    ? 'text-[#c0a483] border-b-2 border-[#c0a483] font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('read')}
              >
                Read
              </button>
            </div>
          </div>
          
          {/* Notification List */}
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c0a483] mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">
                <p>{error}</p>
                <button 
                  onClick={handleRefresh}
                  className="mt-2 px-4 py-2 bg-[#c0a483] text-white rounded-md hover:bg-[#a88e6e] transition-colors text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg">No notifications found</p>
                {activeTab !== 'all' && (
                  <p className="mt-1 text-sm">
                    Try switching to the "All" tab to see all notifications
                  </p>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-6 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className={`text-lg font-medium ${!notification.read ? 'text-black' : 'text-gray-700'}`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatTimestamp(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage; 