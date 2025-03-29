import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HeartIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/product/ProductCard';

const ProductPage = () => {
  const { id: productSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();
  const { products } = useProducts();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        // Find the product with matching ID or slug
        const foundProduct = products.find(p => {
          const productId = p.id?.toString() || p.ID?.toString();
          return productId === productSlug || 
                 (p.slug && p.slug === productSlug) || 
                 p.name?.toLowerCase().replace(/\s+/g, '-') === productSlug;
        });
        
        if (foundProduct) {
          setProduct(foundProduct);
          setLoading(false);
          
          // Set related products
          const category = foundProduct.category || foundProduct['tax:product_cat'];
          let relatedItems = products
            .filter(p => {
              const productId = p.id?.toString() || p.ID?.toString();
              return (p.category === category || p['tax:product_cat'] === category) && 
                    productId !== productSlug;
            })
            .slice(0, 4);
          setRelatedProducts(relatedItems);
          
          // Set page title
          document.title = `${foundProduct.name || foundProduct.post_title} | Liquor Online`;
        } else {
          setError('Product not found');
          setNotFound(true);
          setLoading(false);
          document.title = 'Product Not Found | Liquor Online';
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error loading product data');
        setLoading(false);
      }
    };
    
    if (products.length > 0) {
      fetchProductDetails();
    }
  }, [productSlug, products]);

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const toggleFavorite = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">🔍</div>
        <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link to="/shop" className="bg-[#c0a483] text-white py-2 px-6 hover:bg-black">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        {/* <div className="mb-6">
          <div className="flex items-center text-gray-500 text-sm">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">›</span>
            <Link to={`/shop?category=${product.category}`} className="hover:text-primary capitalize">
              {product.category}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-dark font-medium uppercase">{product.name}</span>
          </div>
        </div> */}
        {/* Product Image */}

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div className='p-10 '>
            <div className="flex justify-center items-center bg-white p-4 relative border border-gray-200 hover:cursor-crosshair">
              {/* Watermark background */}
              <div className="absolute inset-0 z-0 flex flex-col justify-center overflow-hidden opacity-10 w-full h-full">
                {[...Array(10)].map((_, row) => (
                  <div key={row} className="flex whitespace-nowrap w-full">
                    {[...Array(10)].map((_, col) => (
                      <span
                        key={`${row}-${col}`}
                        className="text-transparent font-bold whitespace-nowrap py-4"
                        style={{
                          fontSize: '50px',
                          wordSpacing: '20px',
                          lineHeight: '1.2',
                          WebkitTextStroke: '1px #c0a483',
                          textStroke: '1px #c0a483',
                          letterSpacing: '0.1em'
                        }}
                      >
                        LIQUOR ONLINE&nbsp;
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <img
                src={product.image}
                alt={product.name}
                className="min-h-[450px] object-contain relative z-10"
              />
            </div>
          </div>

          {/* Product Information */}
          <div>
            <div className="mb-6 pt-20">
              <div className="flex items-center text-[#868686] text-sm">
                <Link to="/" className="hover:text-[#c0a483]">Home</Link>
                <span className="mx-2">›</span>
                <Link to={`/shop?category=${product.category}`} className="hover:text-[#c0a483] capitalize">
                  {product.category}
                </Link>
                <span className="mx-2">›</span>
                <span className="text-dark font-medium uppercase">{product.name}</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-dark mb-4 uppercase">
              {product.name}
            </h1>

            <div className="text-xl font-bold text-[#c0a483] mb-6">
              ${product.price.toFixed(2)}
            </div>
            <hr />

            <div className="my-6">
              <p className="text-[#868686] leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.stock > 0 ? (
              <div className="text-green-600 font-medium mb-4">{product.stock} in stock</div>
            ) : (
              <div className="text-red-600 font-medium mb-4">Out of stock</div>
            )}

            <div className="flex flex-wrap items-center mb-6 gap-4">
              <div className="flex border border-gray-300">
                <button
                  onClick={decrementQuantity}
                  className="w-10 h-10 flex items-center justify-center border-r border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-12 h-10 text-center focus:outline-none"
                />
                <button
                  onClick={incrementQuantity}
                  className="w-10 h-10 flex items-center justify-center border-l border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="py-2 px-8 w-[70%] bg-dark text-white hover:bg-[#c0a483] uppercase font-semibold transition-colors"
              >
                Add to Cart
              </button>

              <button
                onClick={toggleFavorite}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:border-[#c0a483] hover:text-[#c0a483]  transition-colors"
              >
                {product && isInWishlist(product.id) ? (
                  <HeartIconSolid className="h-5 w-5 text-[#c0a483]" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full py-3 bg-[#c0a483] text-white uppercase font-semibold mb-6 hover:bg-[#a38b6c]"
            >
              Buy Now
            </button>

            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className='flex gap-2'>
                  <h3 className="font-semibold text-[#868686]">Category:</h3>
                  <p className="uppercase text-dark">{product.category}</p>
                </div>
                <div className='flex gap-2'>
                  <h3 className="font-semibold text-[#868686]">Country:</h3>
                  <p className="uppercase text-dark">{product.country}</p>
                </div>
                <div className='flex gap-2'>
                  <h3 className="font-semibold text-[#868686]">Type:</h3>
                  <p className="uppercase text-dark">{product.type}</p>
                </div>
                <div className='flex gap-2'>
                  <h3 className="font-semibold text-[#868686]">Product Volume:</h3>
                  <p className="text-dark">{product.size || '750 ML'}</p>
                </div>
                <div className='flex gap-2'>
                  <h3 className="font-semibold text-[#868686]">Brand:</h3>
                  <p className="uppercase text-dark">{product.brand}</p>
                </div>
                <div className='flex gap-2'>
                  <h3 className="font-semibold text-[#868686]">Product Count:</h3>
                  <p className="text-dark">{product.stock || 9}</p>
                </div>
                <div className='flex gap-2'>
                  <h3 className="font-semibold text-[#868686]">SKU:</h3>
                  <p className="uppercase text-dark">{product.sku}</p>
                </div>
                <div className='flex gap-2'>
                  <h3 className="font-semibold text-[#868686] ">Tags:</h3>
                  <p className="text-dark">
                    {product.tags ? (
                      product.tags.map((tag, index) => (
                        <span key={tag}>
                          {tag}
                          {index < product.tags.length - 1 ? ', ' : ''}
                        </span>
                      ))
                    ) : (
                      <span>Celebrity Spirits, LETEQ, Limited Editions</span>
                    )}
                  </p>
                </div>
              </div>

              {product.isSpecial && (
                <div className="mt-4">
                  <p className="text-[#c0a483] font-semibold">SPECIAL ITEM</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[#868686]">Share:</span>
                <a 
                  href="https://www.facebook.com/share_channel/#"
                  target='_blank' 
                  className="text-[#868686] hover:text-[#c0a483] transition-colors"
                  aria-label="Share on Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-200 pt-16">
            <h2 className="text-3xl font-bold text-center mb-12 relative">
              Related Products
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-10px] w-24 h-0.5 bg-[#c0a483]"></div>
            </h2>
            <div className="relative">
              {relatedProducts.length > 4 && (
                <button
                  onClick={() => {
                    const container = document.getElementById('related-products-container');
                    container.scrollBy({
                      left: -300,
                      behavior: 'smooth'
                    });
                  }}
                  className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white text-[#c0a483] border border-[#c0a483] shadow-md z-10 flex items-center justify-center hover:bg-[#c0a483] hover:text-white transition-all"
                >
                  <span className="sr-only">Previous</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
              )}

              <div 
                id="related-products-container" 
                className={`grid ${relatedProducts.length > 4 ? 'flex overflow-x-auto snap-x scrollbar-hide' : 'grid-cols-4'} gap-6 pb-4`}
              >
                {relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct.id} className={`${relatedProducts.length > 4 ? 'min-w-[300px] snap-start' : ''}`}>
                    <Link to={`/product/${relatedProduct.id}`} className="block">
                      <div className="bg-white border border-gray-200 p-4 relative group">
                        <div className="absolute inset-0 z-0 flex flex-col justify-center overflow-hidden opacity-10 w-full h-full">
                          {[...Array(10)].map((_, row) => (
                            <div key={row} className="flex whitespace-nowrap w-full">
                              {[...Array(10)].map((_, col) => (
                                <span
                                  key={`${row}-${col}`}
                                  className="text-transparent font-bold whitespace-nowrap py-4"
                                  style={{
                                    fontSize: '30px',
                                    wordSpacing: '20px',
                                    lineHeight: '1.2',
                                    WebkitTextStroke: '1px #c0a483',
                                    textStroke: '1px #c0a483',
                                    letterSpacing: '0.1em'
                                  }}
                                >
                                  LIQUOR ONLINE&nbsp;
                                </span>
                              ))}
                            </div>
                          ))}
                        </div>
                        {relatedProduct.isHot && (
                          <div className="absolute top-4 right-4 bg-[#c0a483] text-white text-xs px-3 py-1 z-20">
                            Hot
                          </div>
                        )}

                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-[300px] object-contain relative z-10"
                        />
                      </div>
                      <div className="text-center mt-4">
                        <h3 className="text-sm uppercase font-bold tracking-wider mb-2">{relatedProduct.name}</h3>
                        <p className="text-[#c0a483] font-bold">${relatedProduct.price.toFixed(2)}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {relatedProducts.length > 4 && (
                <button
                  onClick={() => {
                    const container = document.getElementById('related-products-container');
                    container.scrollBy({
                      left: 300,
                      behavior: 'smooth'
                    });
                  }}
                  className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white text-[#c0a483] border border-[#c0a483] shadow-md z-10 flex items-center justify-center hover:bg-[#c0a483] hover:text-white transition-all"
                >
                  <span className="sr-only">Next</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
