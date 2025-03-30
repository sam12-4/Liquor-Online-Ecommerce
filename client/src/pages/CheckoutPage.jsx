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
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountDetails, setDiscountDetails] = useState(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false); // Flag to prevent redirect during order processing

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

  // Form validation states
  const [formErrors, setFormErrors] = useState({
    customerInfo: {},
    payment: {}
  });

  // Only redirect if cart is empty AND we're not in the middle of order processing
  useEffect(() => {
    if (cartItems.length === 0 && !isProcessingOrder) {
      navigate('/shop');
    }

    document.title = 'Checkout - Liquor Online';
  }, [cartItems.length, navigate, isProcessingOrder]);

  // Handle form input changes
  const handleInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCustomerInfo(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear error when field is changed
    if (formErrors.customerInfo[name]) {
      setFormErrors(prev => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          [name]: ''
        }
      }));
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentInfo(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear error when field is changed
    if (formErrors.payment[name]) {
      setFormErrors(prev => ({
        ...prev,
        payment: {
          ...prev.payment,
          [name]: ''
        }
      }));
    }
  };

  // Form validation
  const validateCustomerInfo = () => {
    const errors = {};
    const { firstName, lastName, email, phone, address, city, province, postalCode } = customerInfo;
    
    // First name validation
    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    // Last name validation
    if (!lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-+()]{10,15}$/.test(phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    // Address validation
    if (!address.trim()) {
      errors.address = 'Address is required';
    }
    
    // City validation
    if (!city.trim()) {
      errors.city = 'City is required';
    }
    
    // Province/State validation
    if (!province.trim()) {
      errors.province = 'Province/State is required';
    }
    
    // Postal/Zip code validation
    if (!postalCode.trim()) {
      errors.postalCode = 'Postal/Zip code is required';
    } else {
      // Canadian postal code format: A1A 1A1
      const canadianPostalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
      // US zip code format: 12345 or 12345-6789
      const usZipRegex = /^\d{5}(-\d{4})?$/;
      
      if (customerInfo.country === 'Canada' && !canadianPostalRegex.test(postalCode)) {
        errors.postalCode = 'Please enter a valid Canadian postal code (e.g., A1A 1A1)';
      } else if (customerInfo.country === 'United States' && !usZipRegex.test(postalCode)) {
        errors.postalCode = 'Please enter a valid US ZIP code (e.g., 12345 or 12345-6789)';
      }
    }
    
    setFormErrors(prev => ({ ...prev, customerInfo: errors }));
    return Object.keys(errors).length === 0;
  };

  const validatePaymentInfo = () => {
    const errors = {};
    
    if (paymentInfo.method === 'credit-card') {
      const { cardNumber, cardName, expiryDate, cvv } = paymentInfo;
      
      // Card number validation
      if (!cardNumber.trim()) {
        errors.cardNumber = 'Card number is required';
      } else if (!/^\d{13,19}$/.test(cardNumber.replace(/\s/g, ''))) {
        errors.cardNumber = 'Please enter a valid card number';
      }
      
      // Card name validation
      if (!cardName.trim()) {
        errors.cardName = 'Name on card is required';
      }
      
      // Expiry date validation
      if (!expiryDate.trim()) {
        errors.expiryDate = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        errors.expiryDate = 'Please use MM/YY format';
      } else {
        // Check if card is expired
        const [month, year] = expiryDate.split('/');
        const expiryMonth = parseInt(month, 10);
        const expiryYear = parseInt('20' + year, 10);
        
        const now = new Date();
        const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
        const currentYear = now.getFullYear();
        
        if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
          errors.expiryDate = 'Card has expired';
        }
      }
      
      // CVV validation
      if (!cvv.trim()) {
        errors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(cvv)) {
        errors.cvv = 'CVV must be 3 or 4 digits';
      }
    }
    
    setFormErrors(prev => ({ ...prev, payment: errors }));
    return Object.keys(errors).length === 0;
  };

  // Handle step navigation
  const goToNextStep = () => {
    if (step === 1) {
      const isValid = validateCustomerInfo();
      if (isValid) {
      setStep(2);
      window.scrollTo(0, 0);
      }
    } else if (step === 2) {
      setStep(3);
      window.scrollTo(0, 0);
    } else if (step === 3) {
      const isValid = validatePaymentInfo();
      if (isValid) {
      // Place order
      placeOrder();
      }
    }
  };

  const goToPreviousStep = () => {
    setStep(prev => Math.max(1, prev - 1));
    window.scrollTo(0, 0);
  };

  // Apply coupon
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a discount code');
      return;
    }

    try {
      setApplyingCoupon(true);
      
      // Call the validate endpoint with the code and current subtotal
      const response = await fetch('http://localhost:5000/api/discount-codes/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          code: couponCode,
          subtotal: subtotal
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid discount code');
      }

      // Set discount amount and mark coupon as applied
      setDiscount(data.discountAmount);
      setCouponApplied(true);
      setDiscountDetails(data.discountCode);
      
      // Show success message
      const discountText = data.discountCode.discountType === 'percentage' 
        ? `${data.discountCode.discountValue}%` 
        : `$${data.discountCode.discountValue.toFixed(2)}`;
      
      toast.success(`Discount code applied: ${discountText} off`);
    } catch (error) {
      console.error('Error applying discount code:', error);
      toast.error(error.message || 'Failed to apply discount code');
    } finally {
      setApplyingCoupon(false);
    }
  };

  // Place order
  const placeOrder = async () => {
    setLoading(true);
    setIsProcessingOrder(true); // Set processing flag to prevent redirect
    
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
        discount: discount,
        discountCode: couponApplied ? couponCode : null,
        total: total,
        paymentMethod: paymentInfo.method
      };
      
      console.log('Sending order data:', orderData);
      
      // Submit order to API
      const response = await createOrder(orderData);
      
      console.log('Order API response:', response);
      
      if (response.success) {
        // Store order data before clearing the cart
        const orderInfo = {
          orderNumber: response.order.orderId,
          email: customerInfo.email,
          orderDate: response.order.createdAt,
          orderStatus: response.order.status,
          timestamp: Date.now() // Add timestamp to track when this order was placed
        };
        
        console.log('Navigating to thank-you page with data:', orderInfo);
        
        // First store data in sessionStorage
        sessionStorage.setItem('orderInfo', JSON.stringify(orderInfo));
        
        // Then navigate directly (no setTimeout)
        navigate('/thank-you');
        
        // Only clear cart after navigation is complete
        setTimeout(() => {
          clearCart();
          setIsProcessingOrder(false);
        }, 500);
      } else {
        setIsProcessingOrder(false);
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('There was a problem placing your order. Please try again.');
      setIsProcessingOrder(false);
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

  // Format credit card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date with slash
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    
    return v;
  };

  // Handle payment input with formatting
  const handleFormattedPaymentChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formattedValue = formatCardNumber(value);
      setPaymentInfo(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name === 'expiryDate') {
      const formattedValue = formatExpiryDate(value);
      setPaymentInfo(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      handlePaymentChange(e);
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
                  <h3 className="font-semibold text-lg mb-6 flex items-center">
                    <UserIcon className="h-5 w-5 mr-2" />
                    Customer Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-gray-600 mb-2">
                        First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={customerInfo.firstName}
                          onChange={handleInfoChange}
                        className={`w-full p-3 border ${formErrors.customerInfo.firstName ? 'border-red-500' : 'border-gray-300'} focus:border-[#c0a483]`}
                        required
                        />
                      {formErrors.customerInfo.firstName && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.customerInfo.firstName}</p>
                      )}
                      </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-600 mb-2">
                        Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={customerInfo.lastName}
                          onChange={handleInfoChange}
                        className={`w-full p-3 border ${formErrors.customerInfo.lastName ? 'border-red-500' : 'border-gray-300'} focus:border-[#c0a483]`}
                        required
                        />
                      {formErrors.customerInfo.lastName && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.customerInfo.lastName}</p>
                      )}
                    </div>
                      </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-600 mb-2">
                      Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={customerInfo.email}
                          onChange={handleInfoChange}
                      className={`w-full p-3 border ${formErrors.customerInfo.email ? 'border-red-500' : 'border-gray-300'} focus:border-[#c0a483]`}
                      required
                        />
                    {formErrors.customerInfo.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.customerInfo.email}</p>
                    )}
                      </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-600 mb-2">
                      Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={customerInfo.phone}
                          onChange={handleInfoChange}
                      className={`w-full p-3 border ${formErrors.customerInfo.phone ? 'border-red-500' : 'border-gray-300'} focus:border-[#c0a483]`}
                      required
                    />
                    {formErrors.customerInfo.phone && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.customerInfo.phone}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-600 mb-2">
                      Company (Optional)
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
                      className={`w-full p-3 border ${formErrors.customerInfo.address ? 'border-red-500' : 'border-gray-300'} focus:border-[#c0a483]`}
                      required
                        />
                    {formErrors.customerInfo.address && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.customerInfo.address}</p>
                    )}
                      </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-600 mb-2">
                          Apartment, suite, etc. (Optional)
                        </label>
                        <input
                          type="text"
                          name="apartment"
                          value={customerInfo.apartment}
                          onChange={handleInfoChange}
                      className="w-full p-3 border border-gray-300 focus:border-[#c0a483]"
                        />
                      </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-gray-600 mb-2">
                        City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={customerInfo.city}
                            onChange={handleInfoChange}
                        className={`w-full p-3 border ${formErrors.customerInfo.city ? 'border-red-500' : 'border-gray-300'} focus:border-[#c0a483]`}
                        required
                          />
                      {formErrors.customerInfo.city && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.customerInfo.city}</p>
                      )}
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
                        className={`w-full p-3 border ${formErrors.customerInfo.province ? 'border-red-500' : 'border-gray-300'} focus:border-[#c0a483]`}
                        required
                      />
                      {formErrors.customerInfo.province && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.customerInfo.province}</p>
                      )}
                    </div>
                        </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-gray-600 mb-2">
                        Postal/ZIP Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={customerInfo.postalCode}
                            onChange={handleInfoChange}
                        className={`w-full p-3 border ${formErrors.customerInfo.postalCode ? 'border-red-500' : 'border-gray-300'} focus:border-[#c0a483]`}
                        required
                          />
                      {formErrors.customerInfo.postalCode && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.customerInfo.postalCode}</p>
                      )}
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
                        <div className="flex ml-auto space-x-2">
                          <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-6" />
                          <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="MasterCard" className="h-6" />
                          <img src="https://cdn-icons-png.flaticon.com/512/196/196542.png" alt="Amex" className="h-6" />
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
                              onChange={handleFormattedPaymentChange}
                              placeholder="1234 5678 9012 3456"
                              className={`w-full p-3 border ${formErrors.payment.cardNumber ? 'border-red-500' : 'border-gray-300'} focus:border-[#c0a483]`}
                              required
                              maxLength="19"
                            />
                            {formErrors.payment.cardNumber && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.payment.cardNumber}</p>
                            )}
                      </div>
                          
                      <div>
                            <label className="block text-gray-600 mb-2">
                              Name on Card <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                              name="cardName"
                              value={paymentInfo.cardName}
                              onChange={handleFormattedPaymentChange}
                              className={`w-full p-3 border ${formErrors.payment.cardName ? 'border-red-500' : 'border-gray-300'} focus:border-[#c0a483]`}
                              required
                            />
                            {formErrors.payment.cardName && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.payment.cardName}</p>
                            )}
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
                                onChange={handleFormattedPaymentChange}
                            placeholder="MM/YY"
                                className={`w-full p-3 border ${formErrors.payment.expiryDate ? 'border-red-500' : 'border-gray-300'} focus:border-[#c0a483]`}
                                required
                                maxLength="5"
                          />
                              {formErrors.payment.expiryDate && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.payment.expiryDate}</p>
                              )}
                        </div>
                            
                        <div>
                              <label className="block text-gray-600 mb-2">
                                CVV <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={paymentInfo.cvv}
                                onChange={handleFormattedPaymentChange}
                                placeholder="123"
                                className={`w-full p-3 border ${formErrors.payment.cvv ? 'border-red-500' : 'border-gray-300'} focus:border-[#c0a483]`}
                                required
                                maxLength="4"
                              />
                              {formErrors.payment.cvv && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.payment.cvv}</p>
                              )}
                      </div>
                    </div>
                    
                          <div>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                name="saveCard"
                                checked={paymentInfo.saveCard}
                                onChange={handleFormattedPaymentChange}
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
                    disabled={couponApplied || applyingCoupon}
                    className="flex-1 p-3 border border-gray-300 focus:border-[#c0a483]"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={couponApplied || applyingCoupon || !couponCode.trim()}
                    className="ml-2 bg-black text-white px-4 py-3 uppercase text-sm font-medium hover:bg-[#c0a483] transition-colors disabled:bg-gray-400"
                  >
                    {applyingCoupon ? 'Applying...' : couponApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {couponApplied && discountDetails && (
                  <div className="flex items-center mt-2 text-green-600 text-sm">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    {discountDetails.type === 'referral' ? 'Referral' : 'Discount'} code applied: 
                    {discountDetails.discountType === 'percentage' 
                      ? ` ${discountDetails.discountValue}% off` 
                      : ` $${discountDetails.discountValue.toFixed(2)} off`}
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
                    <span>Discount {couponCode && `(${couponCode.toUpperCase()})`}</span>
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
