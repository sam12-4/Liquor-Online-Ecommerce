import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import AnimatedSection from '../components/common/AnimatedSection';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [removedItemId, setRemovedItemId] = useState(null);

  // Page title
  useEffect(() => {
    document.title = 'My Wishlist | Liquor Store';
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleRemove = (id) => {
    setRemovedItemId(id);
    // Delay actual removal for animation
    setTimeout(() => {
      removeFromWishlist(id);
      setRemovedItemId(null);
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

  return (
    <div className="container mx-auto py-10">
      {/* <AnimatedSection className=''>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-dark mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            Save your favorite products for later and keep track of special offers.
          </p>
        </div>
      </AnimatedSection> */}

      {wishlistItems.length === 0 ? (
        <AnimatedSection delay={0.2}>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-4">
              <svg 
                className="w-20 h-20 mx-auto text-gray-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="1.5" 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Add products to your wishlist to keep track of your favorite items.
            </p>
            <Link to="/shop" className="btn btn-primary bg-[#c0a483] hover:bg-black">
              Browse Products
            </Link>
          </div>
        </AnimatedSection>
      ) : (
        <>
          <AnimatedSection delay={0.2}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">{wishlistItems.length} item(s) in your wishlist</p>
              <button 
                onClick={clearWishlist}
                className="text-red-500 text-sm font-medium hover:text-red-700 transition flex items-center gap-1"
              >
                <TrashIcon className="h-4 w-4" />
                Clear Wishlist
              </button>
            </div>
          </AnimatedSection>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {wishlistItems.map(item => (
                <motion.div 
                  key={item.id}
                  layout
                  variants={itemVariants}
                  exit={{ opacity: 0, x: -50 }}
                  className={`bg-white rounded-lg shadow-sm overflow-hidden ${removedItemId === item.id ? 'animate-fadeOut' : ''}`}
                >
                  <div className="p-4 flex">
                    <div className="w-24 h-24 flex-shrink-0 mr-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <div className="flex-grow">
                      <Link to={`/product/${item.id}`} className="text-dark font-medium hover:text-primary">
                        {item.name}
                      </Link>
                      <p className="text-gray-500 text-sm mb-1">{item.category}</p>
                      <div className="font-bold text-primary">
                        ${(item.salePrice || item.price).toFixed(2)}
                      </div>
                      <div className="flex items-center mt-2 space-x-2">
                        <button 
                          onClick={() => handleAddToCart(item)}
                          className="text-xs flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-dark py-1 px-2 rounded transition"
                        >
                          <ShoppingCartIcon className="h-3.5 w-3.5" />
                          Add to Cart
                        </button>
                        <button 
                          onClick={() => handleRemove(item.id)}
                          className="text-xs flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-dark py-1 px-2 rounded transition"
                        >
                          <XMarkIcon className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default WishlistPage;
