import { useState } from 'react';
import { Link } from 'react-router-dom';
import { trackOrder } from '../utils/orderService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { 
  ClockIcon, 
  TruckIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

// Banner image
import bannerImg from '../assets/images/Slide1.jpg';

const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await trackOrder(orderId.trim());
      
      if (response.success) {
        setOrderDetails(response.order);
      } else {
        setError('Order not found. Please check the order ID and try again.');
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      setError('Failed to track order. Please try again.');
      toast.error('Error tracking order');
    } finally {
      setLoading(false);
    }
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

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={bannerImg}
            alt="Track Order Banner"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative z-10 text-center py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Track Your Order
          </h1>
          <div className="flex items-center justify-center text-white/80">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <span className="font-medium">Track Order</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-6 border border-gray-200 mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Order Tracking
            </h2>
            
            <p className="text-gray-600 mb-6">
              Enter your order ID to check the current status of your order.
            </p>
            
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Order ID <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. ORD-12345678"
                  className="w-full p-3 border border-gray-300 focus:border-[#c0a483]"
                  required
                />
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
                  <p>{error}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="bg-black hover:bg-gray-800 text-white py-3 px-6 uppercase font-medium transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Tracking...' : 'Track Order'}
              </button>
            </form>
            
            {orderDetails && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold">Order Details</h3>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-500 mb-2">Order Information</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="block text-sm text-gray-500">Order ID</span>
                          <span className="font-medium">{orderDetails.orderId}</span>
                        </div>
                        
                        <div>
                          <span className="block text-sm text-gray-500">Date Placed</span>
                          <span className="font-medium">
                            {format(new Date(orderDetails.createdAt), 'MMM dd, yyyy, h:mm a')}
                          </span>
                        </div>
                        
                        <div>
                          <span className="block text-sm text-gray-500">Shipping Method</span>
                          <span className="font-medium">{orderDetails.shippingMethod}</span>
                        </div>
                        
                        <div>
                          <span className="block text-sm text-gray-500">Order Total</span>
                          <span className="font-medium">${orderDetails.total?.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-500 mb-2">Customer Information</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="block text-sm text-gray-500">Name</span>
                          <span className="font-medium">
                            {orderDetails.customerInfo.firstName} {orderDetails.customerInfo.lastName}
                          </span>
                        </div>
                        
                        <div>
                          <span className="block text-sm text-gray-500">Email</span>
                          <span className="font-medium">{orderDetails.customerInfo.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 my-6 pt-6">
                    <h4 className="font-medium text-gray-500 mb-4">Order Status</h4>
                    
                    <div className="flex items-center mb-4">
                      <span className="text-lg font-medium mr-3">Current Status:</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderDetails.status)}`}>
                        {orderDetails.status === 'pending to be confirmed' && <ClockIcon className="h-4 w-4 mr-1" />}
                        {orderDetails.status === 'confirmed' && <CheckCircleIcon className="h-4 w-4 mr-1" />}
                        {orderDetails.status === 'processing' && <DocumentTextIcon className="h-4 w-4 mr-1" />}
                        {orderDetails.status === 'shipped' && <TruckIcon className="h-4 w-4 mr-1" />}
                        {orderDetails.status === 'delivered' && <CheckCircleIcon className="h-4 w-4 mr-1" />}
                        {orderDetails.status === 'cancelled' && <ExclamationCircleIcon className="h-4 w-4 mr-1" />}
                        {orderDetails.status || 'Pending to be confirmed'}
                      </span>
                    </div>
                    
                    {orderDetails.statusHistory && orderDetails.statusHistory.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-medium text-sm text-gray-500 mb-2">Status Timeline</h5>
                        <div className="space-y-3">
                          {orderDetails.statusHistory.map((statusItem, index) => (
                            <div key={index} className="flex items-start">
                              <div className="h-3 w-3 bg-gray-300 rounded-full mt-1.5 mr-3"></div>
                              <div>
                                <span className="block font-medium">{statusItem.status}</span>
                                <span className="text-sm text-gray-500">
                                  {format(new Date(statusItem.date), 'MMM dd, yyyy, h:mm a')}
                                </span>
                                {statusItem.note && (
                                  <span className="block text-sm text-gray-600 mt-1">{statusItem.note}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage; 