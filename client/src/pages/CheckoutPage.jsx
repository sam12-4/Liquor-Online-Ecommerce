import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCardIcon,
  TruckIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import AnimatedSection from '../components/common/AnimatedSection';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Information, 2: Shipping, 3: Payment
  const [loading, setLoading] = useState(false);

  // Customer information
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    country: 'Canada',
    province: '',
    postalCode: '',
  });

  // Shipping method
  const [shippingMethod, setShippingMethod] = useState('standard');

  // Payment information
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'credit-card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const shippingOptions = [
    { id: 'standard', name: 'Standard Shipping', price: 15.00, description: 'Delivery in 3-7 business days', day: '5-7 days' },
    { id: 'express', name: 'Express Shipping', price: 25.00, description: 'Delivery in 1-3 business days', day: '1-3 days' },
    { id: 'pickup', name: 'Local Pickup', price: 0.00, description: 'Pickup at our store', day: 'Same day' }
  ];

  // Get subtotal, shipping, and total
  const subtotal = cart.totalPrice;
  const shipping = shippingMethod === 'pickup' ? 0 : shippingOptions.find(opt => opt.id === shippingMethod)?.price || 15.00;
  const taxes = parseFloat((subtotal * 0.05).toFixed(2)); // 5% tax rate
  const total = subtotal + shipping + taxes;

  // If cart is empty, redirect to shop
  useEffect(() => {
    if (cart.items.length === 0) {
      navigate('/shop');
    }

    document.title = 'Checkout - Liquor Online';
  }, [cart.items.length, navigate]);

  // Handle form input changes
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  // Form validation
  const validateCustomerInfo = () => {
    const { firstName, lastName, email, phone, address, city, province, postalCode } = customerInfo;
    return firstName && lastName && email && phone && address && city && province && postalCode;
  };

  const validatePaymentInfo = () => {
    if (paymentInfo.method === 'credit-card') {
      const { cardNumber, cardName, expiryDate, cvv } = paymentInfo;
      return cardNumber && cardName && expiryDate && cvv;
    }
    return true; // For other payment methods
  };

  // Handle step navigation
  const goToNextStep = () => {
    if (step === 1 && validateCustomerInfo()) {
      setStep(2);
      window.scrollTo(0, 0);
    } else if (step === 2) {
      setStep(3);
      window.scrollTo(0, 0);
    } else if (step === 3 && validatePaymentInfo()) {
      // Place order
      placeOrder();
    }
  };

  const goToPreviousStep = () => {
    setStep(prev => Math.max(1, prev - 1));
    window.scrollTo(0, 0);
  };

  // Place order
  const placeOrder = () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Generate random order number
      const orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      
      // Clear cart
      clearCart();
      
      // Set loading to false
      setLoading(false);
      
      // Navigate to thank you page with order info
      navigate('/thank-you', { 
        state: { 
          orderNumber: orderNumber,
          email: customerInfo.email 
        } 
      });
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <AnimatedSection>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>
      </AnimatedSection>

      {/* Checkout Progress */}
      <AnimatedSection delay={0.1}>
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <span className="text-sm font-medium">Shipping</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
            <div className={`flex flex-col items-center ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                3
              </div>
              <span className="text-sm font-medium">Review</span>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        {/* Form Section */}
        <div className="lg:w-2/3">
          <AnimatedSection delay={0.2}>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <form onSubmit={(e) => {
                e.preventDefault();
                goToNextStep();
              }}>
                {step === 1 && (
                  <>
                    <h2 className="text-xl font-bold text-dark mb-4">Shipping Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label htmlFor="firstName" className="block text-gray-700 text-sm font-medium mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={customerInfo.firstName}
                          onChange={handleInfoChange}
                          className={`w-full border ${step >= 1 ? 'border-primary' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary`}
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-gray-700 text-sm font-medium mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={customerInfo.lastName}
                          onChange={handleInfoChange}
                          className={`w-full border ${step >= 1 ? 'border-primary' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary`}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={customerInfo.email}
                          onChange={handleInfoChange}
                          className={`w-full border ${step >= 1 ? 'border-primary' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary`}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={customerInfo.phone}
                          onChange={handleInfoChange}
                          className={`w-full border ${step >= 1 ? 'border-primary' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-gray-700 text-sm font-medium mb-1">
                          Address *
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={customerInfo.address}
                          onChange={handleInfoChange}
                          className={`w-full border ${step >= 1 ? 'border-primary' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary`}
                        />
                      </div>
                      <div>
                        <label htmlFor="apartment" className="block text-gray-700 text-sm font-medium mb-1">
                          Apartment, suite, etc. (Optional)
                        </label>
                        <input
                          type="text"
                          id="apartment"
                          name="apartment"
                          value={customerInfo.apartment}
                          onChange={handleInfoChange}
                          className={`w-full border ${step >= 1 ? 'border-primary' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary`}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label htmlFor="city" className="block text-gray-700 text-sm font-medium mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={customerInfo.city}
                            onChange={handleInfoChange}
                            className={`w-full border ${step >= 1 ? 'border-primary' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary`}
                          />
                        </div>
                        <div>
                          <label htmlFor="province" className="block text-gray-700 text-sm font-medium mb-1">
                            Province *
                          </label>
                          <select
                            id="province"
                            name="province"
                            value={customerInfo.province}
                            onChange={handleInfoChange}
                            className={`w-full border ${step >= 1 ? 'border-primary' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary`}
                          >
                            <option value="">Select Province</option>
                            <option value="AB">Alberta</option>
                            <option value="BC">British Columbia</option>
                            <option value="MB">Manitoba</option>
                            <option value="NB">New Brunswick</option>
                            <option value="NL">Newfoundland and Labrador</option>
                            <option value="NS">Nova Scotia</option>
                            <option value="ON">Ontario</option>
                            <option value="PE">Prince Edward Island</option>
                            <option value="QC">Quebec</option>
                            <option value="SK">Saskatchewan</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="postalCode" className="block text-gray-700 text-sm font-medium mb-1">
                            Postal Code *
                          </label>
                          <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={customerInfo.postalCode}
                            onChange={handleInfoChange}
                            className={`w-full border ${step >= 1 ? 'border-primary' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary`}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Link to="/cart" className="text-primary font-medium">
                        Back to Cart
                      </Link>
                      <button
                        type="button"
                        onClick={goToNextStep}
                        className="btn btn-primary"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h2 className="text-xl font-bold text-dark mb-4">Shipping Method</h2>
                    <div className="space-y-4 mb-6">
                      {shippingOptions.map((option) => (
                        <div
                          key={option.id}
                          className={`border ${
                            shippingMethod === option.id ? 'border-primary' : 'border-gray-200'
                          } rounded-lg p-4 cursor-pointer`}
                          onClick={() => setShippingMethod(option.id)}
                        >
                          <div className="flex items-center">
                            <div className="mr-3">
                              <div
                                className={`w-5 h-5 rounded-full border ${
                                  shippingMethod === option.id ? 'border-primary' : 'border-gray-300'
                                } flex items-center justify-center`}
                              >
                                {shippingMethod === option.id && (
                                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{option.name}</h3>
                                <span className="font-semibold">
                                  {option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}`}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {option.description} <span className="font-medium">({option.day})</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 text-sm text-gray-600">
                      <p className="flex items-start mb-2">
                        <TruckIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                        Free shipping on orders over $100
                      </p>
                      <p className="flex items-start">
                        <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                        Please note that delivery times may be longer in rural areas
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={goToPreviousStep}
                        className="text-primary font-medium"
                      >
                        Back to Shipping
                      </button>
                      <button
                        type="button"
                        onClick={goToNextStep}
                        className="btn btn-primary"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <h2 className="text-xl font-bold text-dark mb-4">Payment Information</h2>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label htmlFor="cardName" className="block text-gray-700 text-sm font-medium mb-1">
                          Name on Card *
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          name="cardName"
                          value={paymentInfo.cardName}
                          onChange={handlePaymentChange}
                          className={`w-full border ${step >= 3 ? 'border-primary' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary`}
                        />
                      </div>
                      <div>
                        <label htmlFor="cardNumber" className="block text-gray-700 text-sm font-medium mb-1">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={paymentInfo.cardNumber}
                          onChange={handlePaymentChange}
                          placeholder="XXXX XXXX XXXX XXXX"
                          className={`w-full border ${step >= 3 ? 'border-primary' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary`}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiryDate" className="block text-gray-700 text-sm font-medium mb-1">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={paymentInfo.expiryDate}
                            onChange={handlePaymentChange}
                            placeholder="MM/YY"
                            className={`w-full border ${step >= 3 ? 'border-primary' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary`}
                          />
                        </div>
                        <div>
                          <label htmlFor="cvv" className="block text-gray-700 text-sm font-medium mb-1">
                            CVV *
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={paymentInfo.cvv}
                            onChange={handlePaymentChange}
                            placeholder="XXX"
                            className={`w-full border ${step >= 3 ? 'border-primary' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary`}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={goToPreviousStep}
                        className="text-primary font-medium"
                      >
                        Back to Shipping
                      </button>
                      <button
                        type="button"
                        onClick={goToNextStep}
                        className="btn btn-primary"
                      >
                        Review Order
                      </button>
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <h2 className="text-xl font-bold text-dark mb-4">Review Your Order</h2>
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-dark mb-2">Shipping Information</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p>
                          {customerInfo.firstName} {customerInfo.lastName}
                        </p>
                        <p>{customerInfo.address}</p>
                        <p>
                          {customerInfo.city}, {customerInfo.province} {customerInfo.postalCode}
                        </p>
                        <p>{customerInfo.email}</p>
                        <p>{customerInfo.phone}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-dark mb-2">Shipping Method</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p>{shippingMethod === 'standard' ? 'Standard Shipping' : shippingMethod === 'express' ? 'Express Shipping' : 'Local Pickup'}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-dark mb-2">Payment Method</h3>
                      <div className="bg-gray-50 p-4 rounded-md flex items-center">
                        <div className="mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Credit Card</p>
                          <p className="text-gray-600">
                            **** **** **** {paymentInfo.cardNumber.slice(-4)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-dark mb-2">Order Items</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        {cart.items.map(item => (
                          <div key={item.id} className="flex py-2 border-b last:border-b-0">
                            <div className="w-16 h-16 flex-shrink-0 mr-4">
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between mb-4">
                      <button
                        type="button"
                        onClick={goToPreviousStep}
                        className="text-primary font-medium"
                      >
                        Back to Payment
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </div>
                        ) : (
                          'Place Order'
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </AnimatedSection>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <AnimatedSection delay={0.3}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-dark mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Subtotal ({cart.items.length} items)</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 text-base font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              {shipping > 0 && (
                <div className="mb-4 text-xs text-gray-500">
                  <p>Add ${(100 - subtotal).toFixed(2)} more to qualify for FREE shipping</p>
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
