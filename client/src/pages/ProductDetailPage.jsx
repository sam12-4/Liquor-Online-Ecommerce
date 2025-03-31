import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HeartIcon, 
  ShoppingCartIcon, 
  MinusIcon, 
  PlusIcon, 
  StarIcon as StarOutline,
  TruckIcon, 
  ShieldCheckIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/product/ProductCard';
import AnimatedSection from '../components/common/AnimatedSection';

// Mock products data
const mockProducts = [
  {
    id: 1,
    name: "Johnnie Walker Blue Label",
    category: "Whisky",
    price: 189.99,
    image: "https://www.thewhiskyworld.com/images/johnnie-walker-blue-label-p144-302_medium.png",
    rating: 4.9,
    reviewCount: 128,
    isHot: true,
    description: "Johnnie Walker Blue Label is the pinnacle of Scotch whisky blending. Created from the finest and rarest whiskies with a remarkable depth of flavor, it's the ultimate expression of whisky-making. Each bottle is individually numbered, reflecting its exclusivity.",
    details: {
      abv: "40%",
      volume: "750ml",
      age: "Varied",
      origin: "Scotland",
      taste: "Rich and smoky with notes of honey, caramel, and spice"
    }
  },
  {
    id: 2,
    name: "Grey Goose Original Vodka",
    category: "Vodka",
    price: 39.99,
    salePrice: 34.99,
    image: "https://www.greygoose.com/content/dam/greygoose/global/en/products/grey-goose-vodka-bottle.png",
    rating: 4.7,
    reviewCount: 208,
    isNewArrival: true,
    description: "Grey Goose is a premium vodka, made from French wheat and distilled using an exclusive process that gives it its distinctive taste. Crafted in the Cognac region, it offers exceptional smoothness and a fresh, elegant taste.",
    details: {
      abv: "40%",
      volume: "750ml",
      origin: "France",
      taste: "Smooth with subtle sweetness and hints of almond"
    }
  },
  {
    id: 3,
    name: "Dom Pérignon Vintage Champagne",
    category: "Champagne",
    price: 219.99,
    image: "https://www.domperignon.com/sites/g/files/pcfwdg526/files/2022-11/ICONIC_BOTTLE_BLANC_2013.png",
    rating: 5,
    reviewCount: 76,
    isLimitedEdition: true,
    description: "Dom Pérignon is only produced from the best grapes in the most exceptional years. Each vintage is a unique creation with its own style and character, representing a perfect balance of Chardonnay and Pinot Noir.",
    details: {
      abv: "12.5%",
      volume: "750ml",
      vintage: "2012",
      origin: "France, Champagne",
      taste: "Complex with notes of brioche, honey, and citrus"
    }
  }
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    // Simulate API fetch
    const fetchProduct = () => {
      setLoading(true);
      // Find product by ID in mock data
      const foundProduct = mockProducts.find(p => p.id === parseInt(id));

    if (foundProduct) {
      setProduct(foundProduct);
        document.title = `${foundProduct.name} | Liquor Store`;

        // Get related products from the same category
        const related = mockProducts
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 3);
      setRelatedProducts(related);
    }

    setLoading(false);
    };
    
    fetchProduct();
  }, [id]);

  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleAddToWishlist = () => {
    if (product) {
        addToWishlist(product);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-16 w-16"></div>
          <div className="mt-4 text-gray-500">Loading product...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-dark mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/shop" className="btn btn-primary bg-[#c0a483] hover:bg-black">
            Browse Products
        </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumbs */}
      <nav className="mb-6">
        <ol className="flex text-sm">
          <li className="flex items-center">
            <Link to="/" className="text-gray-500 hover:text-primary">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li className="flex items-center">
            <Link to="/products" className="text-gray-500 hover:text-primary">Products</Link>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li className="flex items-center">
            <Link 
              to={`/products?category=${product.category}`} 
              className="text-gray-500 hover:text-primary"
            >
              {product.category}
            </Link>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li className="text-gray-700 font-medium truncate">{product.name}</li>
        </ol>
      </nav>

      {/* Product Detail Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Image */}
          <AnimatedSection className="flex items-center justify-center bg-gray-50 rounded-lg p-8">
            <motion.img 
              src={product.image} 
              alt={product.name}
              className="max-h-80 md:max-h-96 object-contain"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatedSection>

          {/* Product Info */}
          <AnimatedSection className="flex flex-col" delay={0.2}>
            <div className="mb-2">
              <span className="text-sm font-medium text-primary uppercase">{product.category}</span>
              <h1 className="text-3xl font-bold text-dark mt-1">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  i < Math.floor(product.rating) ? 
                    <StarIcon key={i} className="h-4 w-4 text-yellow-400" /> : 
                    <StarOutline key={i} className="h-4 w-4 text-gray-300" />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              {product.salePrice ? (
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-red-500">${product.salePrice.toFixed(2)}</span>
                  <span className="ml-3 text-gray-400 line-through text-lg">${product.price.toFixed(2)}</span>
                  <span className="ml-3 bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                    Save ${(product.price - product.salePrice).toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-dark">${product.price.toFixed(2)}</span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-600 mb-6 line-clamp-3">
              {product.description.split('.')[0]}.
            </p>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={handleDecreaseQuantity}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <div className="w-12 text-center py-2 font-medium">{quantity}</div>
                <button
                  onClick={handleIncreaseQuantity}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 px-6 rounded-md font-medium transition-colors flex items-center justify-center"
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
              
              <button
                onClick={handleAddToWishlist}
                className={`p-3 rounded-md ${
                  isInWishlist(product.id) 
                    ? 'bg-red-50 text-red-500' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
                title={isInWishlist(product.id) ? "Added to wishlist" : "Add to wishlist"}
              >
                <HeartIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col items-center bg-gray-50 p-3 rounded-md">
                <TruckIcon className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm text-center">Free shipping on orders over $100</span>
              </div>
              <div className="flex flex-col items-center bg-gray-50 p-3 rounded-md">
                <ShieldCheckIcon className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm text-center">Secure online payments</span>
          </div>
              <div className="flex flex-col items-center bg-gray-50 p-3 rounded-md">
                <ArchiveBoxIcon className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm text-center">30-day return policy</span>
              </div>
            </div>

            {/* Additional Details */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-dark mb-2">Product Details:</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {product.details && Object.entries(product.details).map(([key, value]) => (
                  <li key={key} className="flex justify-between">
                    <span className="text-gray-500 capitalize">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
          </div>

        {/* Product Tabs */}
        <div className="border-t border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-3 px-6 font-medium text-sm relative ${
                activeTab === 'description' 
                  ? 'text-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('description')}
            >
              Description
              {activeTab === 'description' && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeTab"
                />
              )}
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm relative ${
                activeTab === 'details' 
                  ? 'text-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Details
              {activeTab === 'details' && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeTab"
                />
              )}
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm relative ${
                activeTab === 'reviews' 
                  ? 'text-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviewCount})
              {activeTab === 'reviews' && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeTab"
                />
              )}
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-dark mb-3">Specifications</h3>
                  <ul className="space-y-2 text-sm">
                    {product.details && Object.entries(product.details).map(([key, value]) => (
                      <li key={key} className="flex">
                        <span className="text-gray-500 capitalize w-24">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-dark mb-3">Shipping Information</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex">
                      <span className="text-gray-500 w-24">Delivery:</span>
                      <span>2-5 business days</span>
                    </li>
                    <li className="flex">
                      <span className="text-gray-500 w-24">Shipping:</span>
                      <span>Free shipping on orders over $100</span>
                    </li>
                    <li className="flex">
                      <span className="text-gray-500 w-24">Returns:</span>
                      <span>30-day return policy</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-medium text-dark">Customer Reviews</h3>
                  <button className="btn btn-primary btn-sm">Write a Review</button>
                </div>
                <div className="text-center py-8">
                  <p className="text-gray-500">Reviews coming soon.</p>
                </div>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-dark mb-6">Related Products</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {relatedProducts.map(relatedProduct => (
              <div key={relatedProduct.id}>
                <ProductCard product={relatedProduct} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
