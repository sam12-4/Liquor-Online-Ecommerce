import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrashIcon, XMarkIcon, MinusIcon, PlusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import AnimatedSection from '../components/common/AnimatedSection';

const CartPage = () => {
  const { cartItems, cartTotal, updateCartItemQuantity, removeFromCart, clearCart } = useCart();
  const [removingItemId, setRemovingItemId] = useState(null);

  useEffect(() => {
    document.title = 'Shopping Cart | Liquor Store';
  }, []);

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateCartItemQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    setRemovingItemId(productId);
    // Delay actual removal for animation
    setTimeout(() => {
      removeFromCart(productId);
      setRemovingItemId(null);
    }, 300);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Calculate shipping cost (free over $100)
  const shippingCost = cartTotal >= 100 ? 0 : 10;
  const orderTotal = cartTotal + shippingCost;

  return (
    <div className="container mx-auto px-4 py-10">
      <AnimatedSection>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">Your Cart</h1>
          <p className="text-gray-600">
            Review your items and proceed to checkout
          </p>
        </div>
      </AnimatedSection>

      {cartItems.length === 0 ? (
        <AnimatedSection delay={0.2}>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-4">
              <ShoppingCartIcon className="mx-auto h-16 w-16 text-gray-300" />
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/shop" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        </AnimatedSection>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-grow lg:w-2/3">
            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex items-center justify-between py-2 border-b">
                  <h2 className="font-medium text-dark">{cartItems.length} item(s) in your cart</h2>
                  <button 
                    onClick={clearCart}
                    className="text-red-500 text-sm font-medium hover:text-red-700 transition flex items-center gap-1"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Clear Cart
                  </button>
                </div>
              </div>
            </AnimatedSection>

            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {cartItems.map(item => (
                <motion.div 
                  key={item.id}
                  variants={itemVariants}
                  className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 ${
                    removingItemId === item.id ? 'opacity-50 scale-95' : ''
                  }`}
                >
                  <div className="p-4 flex items-center">
                    <div className="w-20 h-20 flex-shrink-0 mr-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <div className="flex-1 mr-4">
                      <Link to={`/product/${item.id}`} className="font-medium text-dark hover:text-[#c0a483]">
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      <div className="mt-1 font-bold text-[#c0a483]">
                        ${(item.salePrice || item.price).toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-md mr-6">
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-100 transition-colors"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <div className="w-10 text-center py-1 font-medium">{item.quantity}</div>
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-100 transition-colors"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="w-20 font-bold text-dark text-right">
                      ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <AnimatedSection delay={0.4}>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-dark mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'Free'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 text-base font-bold">
                    <span>Total</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mb-4 text-xs text-gray-500">
                  {shippingCost > 0 ? (
                    <p>Add ${(100 - cartTotal).toFixed(2)} more to qualify for FREE shipping</p>
                  ) : (
                    <p>You've qualified for FREE shipping!</p>
                  )}
                </div>
                <Link 
                  to="/checkout" 
                  className="btn btn-primary bg-[#c0a483] w-full mb-3 hover:bg-black"
                >
                  Proceed to Checkout
                </Link>
                <Link 
                  to="/products" 
                  className="text-[#c0a483] text-sm font-medium hover:underline flex justify-center items-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage; 