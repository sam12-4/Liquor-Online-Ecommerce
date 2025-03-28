import { useState } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';
import { HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import QuickViewModal from './QuickViewModal';

const ProductCard = ({ product }) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const handleQuickView = (e) => {
    e.preventDefault();
    setIsQuickViewOpen(true);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
  };

  return (
    <>
      <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col relative">
        {/* Product Badge */}
        {(product.isHot || product.isSpecial || product.isLimitedEdition || product.isNewArrival) && (
          <div className={`absolute top-4 left-4 z-10 ${
            product.isHot ? 'bg-primary' : 
            product.isLimitedEdition ? 'bg-dark' : 
            product.isSpecial ? 'bg-secondary' : 
            'bg-teal-500'
          } text-white text-xs px-2 py-1 font-medium`}>
            {product.isHot ? 'HOT' : 
            product.isLimitedEdition ? 'LIMITED' : 
            product.isSpecial ? 'SPECIAL' : 
            'NEW'}
          </div>
        )}
        
        <Link to={`/product/${product.id}`} className="block relative pt-4 pb-2 px-4 flex-grow">
          <div className="h-48 flex items-center justify-center mb-2">
            <img 
              src={product.image} 
              alt={product.name}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          
          {/* Category Tag */}
          <div className="text-xs font-medium text-primary mb-1 uppercase">
            {product.category}
          </div>
          
          {/* Product Title */}
          <h3 className="text-dark font-medium text-base mb-1 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon 
                  key={i} 
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(product.rating || 4) ? 'text-yellow-400' : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.reviewCount || Math.floor(Math.random() * 100) + 10})</span>
          </div>
        </Link>
        
        <div className="p-4 pt-0 mt-auto">
          {/* Price */}
          <div className="flex items-center text-lg font-bold mb-3">
            {product.salePrice ? (
              <>
                <span className="text-red-500 mr-2">${product.salePrice.toFixed(2)}</span>
                <span className="text-gray-400 line-through text-sm">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-dark">${product.price.toFixed(2)}</span>
            )}
          </div>

          <Link
            to={`/product/${product.id}`}
            className="btn btn-primary w-full text-center"
          >
            View Product
          </Link>
        </div>
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white shadow-md flex rounded-md">
            <button 
              onClick={handleAddToCart}
              className="p-2 hover:text-primary transition-colors"
              title="Add to cart"
            >
              <ShoppingCartIcon className="h-5 w-5" />
            </button>
            <button 
              onClick={handleQuickView}
              className="p-2 hover:text-primary transition-colors border-l border-r border-gray-200"
              title="Quick view"
            >
              <EyeIcon className="h-5 w-5" />
            </button>
            <button 
              onClick={handleAddToWishlist}
              className={`p-2 transition-colors ${isInWishlist(product.id) ? 'text-red-500' : 'hover:text-primary'}`}
              title="Add to wishlist"
            >
              <HeartIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal 
        product={product} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </>
  );
};

export default ProductCard;
