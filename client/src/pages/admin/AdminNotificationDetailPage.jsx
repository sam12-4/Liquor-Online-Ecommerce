import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
  CheckIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const AdminNotificationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notifications, markAsRead } = useAdminNotifications();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotification = async () => {
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
      } catch (err) {
        console.error('Error loading notification:', err);
        setError('Failed to load notification details');
      } finally {
        setLoading(false);
      }
    };
    
    loadNotification();
  }, [id, notifications, markAsRead]);

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return format(date, 'MMM d, yyyy, h:mm a');
  };

  // Get icon based on notification type
  const getNotificationIcon = (notification) => {
    if (!notification) return <BellIcon className="h-6 w-6 text-gray-500" />;
    
    const { type, orderStatus } = notification;
    
    if (type === 'order_placed') {
      return <DocumentCheckIcon className="h-6 w-6 text-indigo-600" />;
    }
    
    if (type === 'out_of_stock') {
      return <ExclamationCircleIcon className="h-6 w-6 text-red-600" />;
    }
    
    if (type === 'low_stock') {
      return <ExclamationCircleIcon className="h-6 w-6 text-yellow-500" />;
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

  const handleViewOrder = () => {
    if (notification?.orderId) {
      navigate(`/admin/dashboard/orders/${notification.orderId}`);
    }
  };
  
  const handleViewProduct = () => {
    if (notification?.productId) {
      navigate(`/admin/dashboard/products`, { 
        state: { productIdToEdit: notification.productId } 
      });
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/dashboard/notifications')}
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Notifications
        </button>
      </div>
      
      {loading ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-12 sm:px-6 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading notification details...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-12 sm:px-6 text-center text-red-500">
            <p>{error}</p>
            <button 
              onClick={() => navigate('/admin/dashboard/notifications')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Return to All Notifications
            </button>
          </div>
        </div>
      ) : notification ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <div className="mr-4">
              {getNotificationIcon(notification)}
            </div>
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {notification.title}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {formatTimestamp(notification.createdAt)}
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Message</dt>
                <dd className="mt-1 text-sm text-gray-900">{notification.message}</dd>
              </div>
              
              {notification.orderId && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{notification.orderId}</dd>
                </div>
              )}
              
              {notification.orderStatus && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Order Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">{notification.orderStatus}</dd>
                </div>
              )}
              
              {notification.productId && ['out_of_stock', 'low_stock'].includes(notification.type) && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Product ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{notification.productId}</dd>
                </div>
              )}
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{notification.type.replace(/_/g, ' ')}</dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Read Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {notification.read ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Read
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Unread
                    </span>
                  )}
                </dd>
              </div>
            </dl>
            
            {/* {notification.orderId && (
              <div className="mt-6 flex">
                <button
                  type="button"
                  onClick={handleViewOrder}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Order Details
                </button>
              </div>
            )} */}
            
            {notification.productId && ['out_of_stock', 'low_stock'].includes(notification.type) && (
              <div className="mt-6 flex">
                <button
                  type="button"
                  onClick={handleViewProduct}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Product Details
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-12 sm:px-6 text-center text-gray-500">
            <p>Notification not found</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationDetailPage; 