import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { getOrderDetails } from '../utils/orderService';
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
  CheckIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

// Banner image
import bannerImg from '../assets/images/Slide1.jpg';

const NotificationDetailPage = () => {
  const { id } = useParams();
  const { notifications, markAsRead } = useNotifications();
  const [notification, setNotification] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotificationAndOrder = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Find notification in context
        const foundNotification = notifications.find(n => n._id === id);
        
        if (!foundNotification) {
          setError('Notification not found');
          setLoading(false);
          return;
        }
        
        setNotification(foundNotification);
        
        // Mark as read if not already
        if (!foundNotification.read) {
          await markAsRead(id);
        }
        
        // Fetch related order details
        try {
          const response = await getOrderDetails(foundNotification.orderId);
          if (response.success) {
            setOrder(response.order);
          }
        } catch (orderError) {
          console.error('Error fetching order details:', orderError);
          // Don't set error state here - we still want to show the notification even if order fetch fails
        }
      } catch (err) {
        console.error('Error in notification detail:', err);
        setError('Failed to load notification details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotificationAndOrder();
  }, [id, notifications, markAsRead]);

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return format(date, 'MMM d, yyyy, h:mm a');
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending to be confirmed':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (notification) => {
    if (!notification) return <BellIcon className="h-6 w-6 text-gray-500" />;
    
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
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Notification Details</h1>
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
                    <Link to="/notifications" className="text-white hover:text-[#c0a483] text-sm md:text-base">
                      Notifications
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="text-gray-300 mx-2">/</span>
                    <span className="text-[#c0a483] text-sm md:text-base">
                      Details
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
        <div className="mb-6">
          <button
            onClick={() => navigate('/notifications')}
            className="flex items-center text-gray-600 hover:text-[#c0a483] transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Notifications
          </button>
        </div>
        
        {loading ? (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c0a483] mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading notification details...</p>
          </div>
        ) : error ? (
          <div className="bg-white shadow-md rounded-lg p-8 text-center text-red-500">
            <p className="text-lg">{error}</p>
            <button 
              onClick={() => navigate('/notifications')}
              className="mt-4 px-4 py-2 bg-[#c0a483] text-white rounded-md hover:bg-[#a88e6e] transition-colors"
            >
              Back to Notifications
            </button>
          </div>
        ) : notification ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
          >
            {/* Notification header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center">
              <div className="mr-4">
                {getNotificationIcon(notification)}
              </div>
              <div>
                <h2 className="text-xl font-medium text-gray-800">{notification.title}</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {formatTimestamp(notification.createdAt)}
                </p>
              </div>
            </div>
            
            {/* Notification body */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Message</h3>
                <p className="text-gray-700">{notification.message}</p>
              </div>
              
              {/* Order details section if order is available */}
              {order && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">Order Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-medium">{order.orderId}</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{format(new Date(order.createdAt), 'MMM d, yyyy')}</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <p className="text-sm text-gray-500">Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    
                    {/* Status timeline if available */}
                    {order.statusHistory && order.statusHistory.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-md font-medium mb-3">Status Timeline</h4>
                        <div className="border-l-2 border-gray-200 pl-5 space-y-6 ml-1.5">
                          {order.statusHistory.map((statusItem, index) => (
                            <div key={index} className="relative">
                              <div className="absolute -left-[1.625rem] h-3 w-3 rounded-full bg-[#c0a483]"></div>
                              <div>
                                <p className="font-medium">{statusItem.status}</p>
                                <p className="text-sm text-gray-500">
                                  {format(new Date(statusItem.date), 'MMM d, yyyy, h:mm a')}
                                </p>
                                {statusItem.note && (
                                  <p className="text-sm text-gray-600 mt-1">{statusItem.note}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-center mt-6">
                      <Link
                        to={`/track-order?orderId=${order.orderId}`}
                        className="px-4 py-2 bg-[#c0a483] text-white rounded-md hover:bg-[#a88e6e] transition-colors"
                      >
                        View Order Details
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-8 text-center text-gray-500">
            <p>Notification not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDetailPage; 