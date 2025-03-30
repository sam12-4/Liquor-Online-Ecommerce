import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  HomeIcon, 
  ShoppingBagIcon,
  ClockIcon,
  TruckIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderNumber, email, orderDate, orderStatus } = location.state || {};

  useEffect(() => {
    document.title = 'Order Confirmation | Liquor Store';
    
    // Redirect if no order number
    if (!orderNumber) {
      navigate('/');
    }
  }, [orderNumber, navigate]);

  if (!orderNumber) {
    return null;
  }

  // Format date if available
  const formattedDate = orderDate ? format(new Date(orderDate), 'MMM dd, yyyy, h:mm a') : 'Processing';

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Thank You!</h1>
          <p className="text-lg text-gray-600">Your order has been received</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Order Number:</span>
            <span className="font-semibold text-lg">{orderNumber}</span>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Order Date:</span>
            <span className="font-medium">{formattedDate}</span>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Status:</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <ClockIcon className="h-3 w-3 mr-1" />
              {orderStatus || 'Pending to be confirmed'}
            </span>
          </div>
          
          <div className="h-px bg-gray-200 my-4"></div>
          <p className="text-gray-600 text-sm">
            We've sent a confirmation email to <span className="font-medium">{email}</span> with your order details.
          </p>
        </div>

        <div className="bg-primary bg-opacity-5 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-lg mb-3">What happens next?</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full mr-3 flex-shrink-0 text-xs">1</span>
              <span>We're processing your order and will notify you when it's ready.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full mr-3 flex-shrink-0 text-xs">2</span>
              <span>You'll receive an email when your order ships with tracking information.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full mr-3 flex-shrink-0 text-xs">3</span>
              <span>Remember: ID verification will be required at delivery for all alcohol purchases.</span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-lg mb-3 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
            Track Your Order
          </h2>
          <p className="text-gray-700 mb-3">
            You can track your order status anytime using your Order ID: <strong>{orderNumber}</strong>
          </p>
          <p className="text-sm text-gray-600">
            Save this number for future reference. You'll need it to check your order status or contact customer service.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn btn-primary flex items-center justify-center">
            <HomeIcon className="h-5 w-5 mr-2" />
            Return Home
          </Link>
          <Link to="/products" className="btn btn-outline flex items-center justify-center">
            <ShoppingBagIcon className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ThankYouPage; 