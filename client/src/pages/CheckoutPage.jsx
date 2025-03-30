import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCardIcon,
  TruckIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  MinusIcon,
  PlusIcon,
  ClockIcon,
  ShoppingBagIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { createOrder } from '../utils/orderService';
import { useUserAuth } from '../contexts/UserAuthContext';
import { toast } from 'react-toastify';

// Banner image
import bannerImg from '../assets/images/Slide1.jpg';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, updateCartItemQuantity, removeFromCart, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Information, 2: Shipping, 3: Payment
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

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
    saveInfo: false,
    createAccount: false,
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
    saveCard: false,
  });

  const shippingOptions = [
    { id: 'standard', name: 'Standard Shipping', price: 15.00, description: 'Delivery in 3-7 business days', day: '5-7 days' },
    { id: 'express', name: 'Express Shipping', price: 25.00, description: 'Delivery in 1-3 business days', day: '1-3 days' },
    { id: 'pickup', name: 'Local Pickup', price: 0.00, description: 'Pickup at our store', day: 'Same day' }
  ];

  // Get subtotal, shipping, and total
  const subtotal = cartTotal;
  const shipping = shippingMethod === 'pickup' ? 0 : shippingOptions.find(opt => opt.id === shippingMethod)?.price || 15.00;
  const taxes = parseFloat((subtotal * 0.05).toFixed(2)); // 5% tax rate
  const total = subtotal + shipping + taxes - discount;

  // If cart is empty, redirect to shop
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/shop');
    }

    document.title = 'Checkout - Liquor Online';
  }, [cartItems.length, navigate]);

  // Handle form input changes
  const handleInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCustomerInfo(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentInfo(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
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

  // Apply coupon
  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'discount10') {
      setDiscount(subtotal * 0.1); // 10% discount
      setCouponApplied(true);
    }
  };

  // Place order
  const placeOrder = async () => {
    setLoading(true);
    
    try {
      // Prepare order data
      const orderData = {
        customerInfo: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: {
            street: customerInfo.address + (customerInfo.apartment ? `, ${customerInfo.apartment}` : ''),
            city: customerInfo.city,
            state: customerInfo.province,
            zipCode: customerInfo.postalCode,
            country: customerInfo.country
          }
        },
        items: cartItems.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          salePrice: item.salePrice,
          quantity: item.quantity,
          image: item.image,
          category: item.category,
          type: item.type,
          brand: item.brand,
          size: item.size,
          abv: item.abv
        })),
        shippingMethod: shippingMethod,
        shippingCost: shipping,
        subtotal: subtotal,
        tax: taxes,
        total: total,
        paymentMethod: paymentInfo.method
      };
      
      // Submit order to API
      const response = await createOrder(orderData);
      
      if (response.success) {
        // Clear cart
        clearCart();
        
        // Navigate to thank you page with order info
        navigate('/thank-you', { 
          state: { 
            orderNumber: response.order.orderId,
            email: customerInfo.email,
            orderDate: response.order.createdAt,
            orderStatus: response.order.status
          } 
        });
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('There was a problem placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Increment quantity
  const incrementQuantity = (productId, currentQuantity) => {
    updateCartItemQuantity(productId, currentQuantity + 1);
  };

  // Decrement quantity
  const decrementQuantity = (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateCartItemQuantity(productId, currentQuantity - 1);
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={bannerImg}
            alt="Checkout Banner"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative z-10 text-center py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Checkout
          </h1>
          <div className="flex items-center justify-center text-white/80">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <Link to="/cart" className="hover:text-white">Cart</Link>
            <span className="mx-2">›</span>
            <span className="font-medium">Checkout</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Form Section */}
          <div className="lg:w-2/3">
            <div className="bg-white p-6 border border-gray-200 mb-8">
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <UserIcon className="h-5 w-5 mr-2" />
                    Contact Information
                  </h2>
                  
                  <div className="mb-6">
                    <label className="block text-gray-600 mb-2">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInfoChange}
                      className="w-full p-3 border border-gray-300 focus:border-[#c0a483]"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-600 mb-2">
                      Phone number <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInfoChange}
                      className="w-full p-3 border border-gray-300 focus:border-[#c0a483]"
                      required
                    />
                  </div>
                  
                  <h2 className="text-xl font-bold my-6 flex items-center">
                    <TruckIcon className="h-5 w-5 mr-2" />
                    Shipping Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-gray-600 mb-2">
                        First name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        name="firstName"
                        value={customerInfo.firstName}
                        onChange={handleInfoChange}
                        className="w-full p-3 border border-gray-300 focus:border-[#c0a483]"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-600 mb-2">
                        Last name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        name="lastName"
                        value={customerInfo.lastName}
                        onChange={handleInfoChange}
                        className="w-full p-3 border border-gray-300 focus:border-[#c0a483]"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-600 mb-2">
                      Company (optional)
                    </label>
                    <input 
                      type="text"
                      name="company"
                      value={customerInfo.company}
                      onChange={handleInfoChange}
                      className="w-full p-3 border border-gray-300 focus:border-[#c0a483]"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-600 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInfoChange}
                      className="w-full p-3 border border-gray-300 focus:border-[#c0a483]"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-600 mb-2">
                      Apartment, suite, etc. (optional)
                    </label>
                    <input 
                      type="text"
                      name="apartment"
                      value={customerInfo.apartment}
                      onChange={handleInfoChange}
                      className="w-full p-3 border border-gray-300 focus:border-[#c0a483]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="mb-4">
                      <label className="block text-gray-600 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        name="city"
                        value={customerInfo.city}
                        onChange={handleInfoChange}
                        className="w-full p-3 border border-gray-300 focus:border-[#c0a483]"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-600 mb-2">
                        Province/State <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        name="province"
                        value={customerInfo.province}
                        onChange={handleInfoChange}
                        className="w-full p-3 border border-gray-300 focus:border-[#c0a483]"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-600 mb-2">
                        Postal code <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        name="postalCode"
                        value={customerInfo.postalCode}
                        onChange={handleInfoChange}
                        className="w-full p-3 border border-gray-300 focus:border-[#c0a483]"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-600 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="country"
                      value={customerInfo.country}
                      onChange={handleInfoChange}
                      className="w-full p-3 border border-gray-300 focus:border-[#c0a483]"
                      required
                    >
                      <option value="Canada">Canada</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="saveInfo"
                        checked={customerInfo.saveInfo}
                        onChange={handleInfoChange}
                        className="w-4 h-4 text-[#c0a483]" 
                      />
                      <span className="text-gray-600">Save this information for next time</span>
                    </label>
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <TruckIcon className="h-5 w-5 mr-2" />
                    Shipping Method
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    {shippingOptions.map(option => (
                      <div 
                        key={option.id}
                        className={`border p-4 cursor-pointer ${shippingMethod === option.id ? 'border-[#c0a483] bg-[#f9f6f2]' : 'border-gray-200'}`}
                        onClick={() => setShippingMethod(option.id)}
                      >
                        <div className="flex items-center">
                          <div className="mr-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === option.id ? 'border-[#c0a483]' : 'border-gray-300'}`}>
                              {shippingMethod === option.id && <div className="w-3 h-3 rounded-full bg-[#c0a483]"></div>}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium">{option.name}</span>
                              <span className="font-bold">${option.price.toFixed(2)}</span>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center mt-1">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {option.day}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center my-6">
                    <div className="w-full h-px bg-gray-200"></div>
                    <div className="px-4 text-gray-500 whitespace-nowrap">or</div>
                    <div className="w-full h-px bg-gray-200"></div>
                  </div>
                  
                  <div className="flex justify-between mb-4">
                    <button
                      type="button"
                      onClick={goToPreviousStep}
                      className="text-gray-600 hover:text-[#c0a483] flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Return to shipping
                    </button>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <CreditCardIcon className="h-5 w-5 mr-2" />
                    Payment
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div 
                      className={`border p-4 cursor-pointer ${paymentInfo.method === 'credit-card' ? 'border-[#c0a483] bg-[#f9f6f2]' : 'border-gray-200'}`}
                      onClick={() => setPaymentInfo(prev => ({ ...prev, method: 'credit-card' }))}
                    >
                      <div className="flex items-center">
                        <div className="mr-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentInfo.method === 'credit-card' ? 'border-[#c0a483]' : 'border-gray-300'}`}>
                            {paymentInfo.method === 'credit-card' && <div className="w-3 h-3 rounded-full bg-[#c0a483]"></div>}
                          </div>
                        </div>
                        <span className="font-medium">Credit Card</span>
                        <div className="ml-auto flex space-x-2">
                          <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-6" />
                          <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="MasterCard" className="h-6" />
                          <img src="https://cdn-icons-png.flaticon.com/512/196/196539.png" alt="Amex" className="h-6" />
                        </div>
                      </div>
                      
                      {paymentInfo.method === 'credit-card' && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <label className="block text-gray-600 mb-2">
                              Card Number <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="text"
                              name="cardNumber"
                              value={paymentInfo.cardNumber}
                              onChange={handlePaymentChange}
                              placeholder="1234 5678 9012 3456"
                              className="w-full p-3 border border-gray-300 focus:border-[#c0a483]"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-gray-600 mb-2">
                              Name on Card <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="text"
                              name="cardName"
                              value={paymentInfo.cardName}
                              onChange={handlePaymentChange}
                              className="w-full p-3 border border-gray-300 focus:border-[#c0a483]"
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-gray-600 mb-2">
                                Expiry Date <span className="text-red-500">*</span>
                              </label>
                              <input 
                                type="text"
                                name="expiryDate"
                                value={paymentInfo.expiryDate}
                                onChange={handlePaymentChange}
                                placeholder="MM/YY"
                                className="w-full p-3 border border-gray-300 focus:border-[#c0a483]"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-gray-600 mb-2">
                                CVV <span className="text-red-500">*</span>
                              </label>
                              <input 
                                type="text"
                                name="cvv"
                                value={paymentInfo.cvv}
                                onChange={handlePaymentChange}
                                placeholder="123"
                                className="w-full p-3 border border-gray-300 focus:border-[#c0a483]"
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                name="saveCard"
                                checked={paymentInfo.saveCard}
                                onChange={handlePaymentChange}
                                className="w-4 h-4 text-[#c0a483]" 
                              />
                              <span className="text-gray-600">Save this card for future purchases</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div 
                      className={`border p-4 cursor-pointer ${paymentInfo.method === 'paypal' ? 'border-[#c0a483] bg-[#f9f6f2]' : 'border-gray-200'}`}
                      onClick={() => setPaymentInfo(prev => ({ ...prev, method: 'paypal' }))}
                    >
                      <div className="flex items-center">
                        <div className="mr-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentInfo.method === 'paypal' ? 'border-[#c0a483]' : 'border-gray-300'}`}>
                            {paymentInfo.method === 'paypal' && <div className="w-3 h-3 rounded-full bg-[#c0a483]"></div>}
                          </div>
                        </div>
                        <span className="font-medium">PayPal</span>
                        <img src="https://cdn-icons-png.flaticon.com/512/174/174861.png" alt="PayPal" className="h-6 ml-auto" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6">
                    <button
                      type="button"
                      onClick={goToPreviousStep}
                      className="text-gray-600 hover:text-[#c0a483] flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Return to shipping method
                    </button>
                  </div>
                </div>
              )}
              
              <div className="mt-8">
                <button
                  type="button"
                  onClick={goToNextStep}
                  disabled={loading}
                  className={`w-full py-3 uppercase font-semibold transition-colors ${
                    step === 3 
                      ? 'bg-[#c0a483] hover:bg-[#a38b6c] text-white'
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : step === 3 ? 'Place Order' : step === 2 ? 'Continue to Payment' : 'Continue to Shipping'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 border border-gray-200 sticky top-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                Order Summary
              </h2>
              
              <div className="max-h-80 overflow-y-auto mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center py-4 border-b border-gray-200">
                    <div className="relative w-16 h-16 border border-gray-200 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-contain"
                      />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#c0a483] text-white text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">${(item.price).toFixed(2)} x {item.quantity}</p>
                    </div>
                    <div className="text-sm font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Discount code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                    className="flex-1 p-3 border border-gray-300 focus:border-[#c0a483]"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={couponApplied}
                    className="ml-2 bg-black text-white px-4 py-3 uppercase text-sm font-medium hover:bg-[#c0a483] transition-colors disabled:bg-gray-400"
                  >
                    {couponApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {couponApplied && (
                  <div className="flex items-center mt-2 text-green-600 text-sm">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Coupon applied: 10% discount
                  </div>
                )}
              </div>
              
              <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Taxes (5%)</span>
                  <span className="font-medium">${taxes.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between py-2 text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-2 mt-2"></div>
                
                <div className="flex justify-between py-2 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#c0a483]">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 space-y-2">
                <div className="flex items-start">
                  <ShieldCheckIcon className="h-5 w-5 mr-2 flex-shrink-0 text-[#c0a483]" />
                  <p>Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.</p>
                </div>
                
                <div className="flex items-start">
                  <TruckIcon className="h-5 w-5 mr-2 flex-shrink-0 text-[#c0a483]" />
                  <p>Shipping times may vary based on your location and selected shipping method.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
