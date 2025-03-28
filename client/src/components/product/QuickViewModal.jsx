import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, HeartIcon, ShoppingCartIcon, MinusIcon, PlusIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const [isInWish, setIsInWish] = useState(false);

  useEffect(() => {
    if (product) {
      setIsInWish(isInWishlist(product.id));
    }
  }, [product, isInWishlist]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Show a toast or feedback that item was added
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
    setIsInWish(true);
    // Show a toast or feedback that item was added to wishlist
  };

  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black bg-opacity-70 transition-opacity"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-lg max-w-4xl w-full mx-auto overflow-hidden shadow-xl z-10"
            >
              <div className="flex justify-end p-2">
                <button 
                  onClick={onClose}
                  className="text-gray-500 hover:text-dark transition-colors p-1"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="flex items-center justify-center bg-neutral-50 rounded-lg p-6">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="max-h-80 object-contain"
                  />
                </div>

                {/* Product Details */}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-primary uppercase mb-1">{product.category}</span>
                  <h2 className="text-2xl font-bold text-dark mb-2">{product.name}</h2>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        i < Math.floor(product.rating || 4) ? 
                          <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" /> : 
                          <StarIcon key={i} className="h-4 w-4 text-gray-300" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      ({product.reviewCount || Math.floor(Math.random() * 100) + 10} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center mb-4">
                    {product.salePrice ? (
                      <>
                        <span className="text-2xl font-bold text-red-500 mr-2">${product.salePrice.toFixed(2)}</span>
                        <span className="text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-dark">${product.price.toFixed(2)}</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {product.description || "This premium product is crafted with the finest ingredients, offering a smooth and refined taste experience that's perfect for any occasion."}
                  </p>

                  {/* Quantity Selector */}
                  <div className="flex items-center mb-6">
                    <span className="text-gray-700 mr-4">Quantity:</span>
                    <div className="flex border border-gray-300 rounded-md">
                      <button 
                        onClick={decreaseQuantity}
                        className="px-3 py-1 hover:bg-gray-100 transition-colors"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <div className="w-12 text-center py-1">{quantity}</div>
                      <button 
                        onClick={increaseQuantity}
                        className="px-3 py-1 hover:bg-gray-100 transition-colors"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
                    >
                      <ShoppingCartIcon className="h-5 w-5 mr-2" />
                      Add to Cart
                    </button>
                    <button
                      onClick={handleAddToWishlist}
                      className={`flex-1 ${isInWish ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center`}
                    >
                      <HeartIcon className={`h-5 w-5 mr-2 ${isInWish ? 'fill-current' : ''}`} />
                      {isInWish ? 'Added to Wishlist' : 'Add to Wishlist'}
                    </button>
                  </div>

                  {/* View Full Details Link */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Link 
                      to={`/product/${product.id}`}
                      className="text-primary hover:underline font-medium"
                      onClick={onClose}
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal; 