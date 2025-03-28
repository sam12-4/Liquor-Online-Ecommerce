import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowPathIcon, TruckIcon, CheckCircleIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import AnimatedSection from '../components/common/AnimatedSection';

const TrackOrderPage = () => {
  const [formData, setFormData] = useState({
    orderNumber: '',
    email: ''
  });
  const [trackingResult, setTrackingResult] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Track Your Order | Liquor Online';
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    // Validate form
    if (!formData.orderNumber.trim() || !formData.email.trim()) {
      setFormError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call to track order
    setTimeout(() => {
      // For demo purposes, always show a "found" order
      setTrackingResult({
        orderNumber: formData.orderNumber,
        status: 'In Transit',
        estimatedDelivery: '2023-11-15',
        items: [
          { name: '818 Tequila Blanco', quantity: 1, price: 75.00 },
          { name: 'Macallan 12 Year Old Double Cask', quantity: 1, price: 89.99 }
        ],
        events: [
          { date: '2023-11-08', status: 'Order Placed', description: 'Your order has been received and confirmed.' },
          { date: '2023-11-09', status: 'Processing', description: 'Your order is being processed and prepared for shipping.' },
          { date: '2023-11-10', status: 'Shipped', description: 'Your order has been shipped and is on its way to you.' },
          { date: '2023-11-15', status: 'Estimated Delivery', description: 'Expected delivery date if everything goes as planned.' }
        ],
        tracking: {
          carrier: 'Canada Post',
          trackingNumber: 'CP123456789CA',
          url: 'https://www.canadapost.ca/trackweb/en'
        }
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const resetSearch = () => {
    setTrackingResult(null);
    setFormData({
      orderNumber: '',
      email: ''
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Placed':
        return <ShoppingBagIcon className="h-6 w-6 text-blue-500" />;
      case 'Processing':
        return <ArrowPathIcon className="h-6 w-6 text-yellow-500" />;
      case 'Shipped':
        return <TruckIcon className="h-6 w-6 text-[#c0a483]" />;
      case 'Estimated Delivery':
        return <CheckCircleIcon className="h-6 w-6 text-gray-400" />;
      case 'Delivered':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      default:
        return <ShoppingBagIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <AnimatedSection>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-dark mb-6">Track Your Order</h1>
          <p className="text-lg text-gray-600 mb-10">
            Enter your order details below to track the status and estimated delivery date of your purchase.
          </p>
        </div>
      </AnimatedSection>

      <div className="max-w-4xl mx-auto">
        {!trackingResult ? (
          <AnimatedSection delay={0.1}>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-dark mb-6">Enter Order Information</h2>
              
              <form onSubmit={handleSubmit}>
                {formError && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                    <p>{formError}</p>
                  </div>
                )}
                
                <div className="mb-6">
                  <label htmlFor="orderNumber" className="block text-gray-700 text-sm font-medium mb-2">
                    Order Number *
                  </label>
                  <input
                    type="text"
                    id="orderNumber"
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#c0a483] focus:border-[#c0a483]"
                    placeholder="e.g., LO12345678"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#c0a483] focus:border-[#c0a483]"
                    placeholder="The email address used for your order"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#c0a483] text-white font-medium rounded-md shadow-sm hover:bg-[#a38b6c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0a483]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Tracking...
                    </span>
                  ) : (
                    "Track Order"
                  )}
                </button>
              </form>
              
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-dark mb-4">Don't have your order number?</h3>
                <p className="text-gray-600 mb-4">
                  If you've lost your order number, please check your email for your order confirmation or contact our customer service team for assistance.
                </p>
                <a 
                  href="mailto:support@liquoronline.ca" 
                  className="text-[#c0a483] hover:text-[#a38b6c] font-medium"
                >
                  support@liquoronline.ca
                </a>
              </div>
            </div>
          </AnimatedSection>
        ) : (
          <AnimatedSection delay={0.1}>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-dark">Order Status</h2>
                <button
                  onClick={resetSearch}
                  className="text-sm font-medium text-[#c0a483] hover:text-[#a38b6c]"
                >
                  Search Again
                </button>
              </div>
              
              <div className="mb-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Order Number</p>
                      <p className="font-medium">{trackingResult.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium text-[#c0a483]">{trackingResult.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estimated Delivery</p>
                      <p className="font-medium">{trackingResult.estimatedDelivery}</p>
                    </div>
                  </div>
                  
                  {trackingResult.tracking && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-md">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Carrier:</span> {trackingResult.tracking.carrier}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">Tracking Number:</span> {trackingResult.tracking.trackingNumber}
                      </p>
                      <a
                        href={trackingResult.tracking.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Track with {trackingResult.tracking.carrier} →
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-dark mb-4">Order Timeline</h3>
              <div className="relative mb-8">
                {/* Timeline */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-6">
                  {trackingResult.events.map((event, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 relative z-10">
                        {getStatusIcon(event.status)}
                      </div>
                      <div className="ml-6">
                        <div className="font-medium text-dark">{event.status}</div>
                        <div className="text-sm text-gray-500 mb-1">{event.date}</div>
                        <div className="text-gray-600">{event.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-dark mb-4">Order Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {trackingResult.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${item.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">Need help with your order?</p>
                <a 
                  href="mailto:support@liquoronline.ca" 
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#c0a483] hover:bg-[#a38b6c]"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </AnimatedSection>
        )}
        
        <AnimatedSection delay={0.2}>
          <div className="bg-gray-50 rounded-lg shadow-sm p-8 mt-8">
            <h2 className="text-xl font-bold text-dark mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-dark mb-1">How long does shipping take?</h3>
                <p className="text-gray-600">
                  Shipping times vary by location, but most orders are delivered within 2-5 business days after shipping.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-dark mb-1">How can I change my delivery address?</h3>
                <p className="text-gray-600">
                  If your order hasn't shipped yet, please contact our customer service team immediately to update your delivery address.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-dark mb-1">What if I miss my delivery?</h3>
                <p className="text-gray-600">
                  If you miss your delivery, the carrier will leave a delivery notice with instructions on how to reschedule or pick up your package.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-dark mb-1">Do you provide tracking for all orders?</h3>
                <p className="text-gray-600">
                  Yes, all orders come with tracking information that will be sent to your email once your order ships.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default TrackOrderPage; 