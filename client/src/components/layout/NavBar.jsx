import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  UserIcon, 
  MagnifyingGlassIcon, 
  Bars3Icon, 
  XMarkIcon,
  PhoneIcon,
  MapPinIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getFilters } from '../../data/productLoader';

// Import styles
import '../../styles/navbar.css';

// Import logo
import logoGif from '../../assets/images/Gif-Logo.gif';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loginFormOpen, setLoginFormOpen] = useState(false);
  const navigate = useNavigate();

  // Get cart state from context
  const { cartItems, cartTotal, removeFromCart, updateCartItemQuantity, cartCount } = useCart();

  // Get wishlist state from context
  const { wishlistItems, wishlistCount, removeFromWishlist, isInWishlist } = useWishlist();

  const [filters, setFilters] = useState({ categories: [], brands: [] });
  
  useEffect(() => {
    const { categories, brands } = getFilters();
    setFilters({ categories, brands });
  }, []);

  // Add responsive meta tag to ensure proper scaling on mobile
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
    document.getElementsByTagName('head')[0].appendChild(meta);
  }, []);

  // Mobile menu state enhancement
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
      
      if (loginFormOpen && !event.target.closest('.login-form') && !event.target.closest('.login-trigger')) {
        setLoginFormOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen, loginFormOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };
  
  const toggleLoginForm = () => {
    setLoginFormOpen(!loginFormOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  // Calculate subtotal - we're now using cartItems directly from context
  const subtotal = cartItems.reduce((acc, item) => acc + ((item.salePrice || item.price) * item.quantity), 0);

  return (
    <header className="bg-white z-50 top-0 shadow-sm ">
      {/* Main Navigation */}
      <div className="container-fluid mx-auto px-4 md:px-6 py-2">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="block">
              <img src={logoGif} alt="Liquor Online" className="h-8 w-48 md:w-full md:h-10 lg:h-12" />
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-8">
              <li>
                <Link to="/" className="nav-item font-serif uppercase text-dark hover:text-[#c0a483] transition-colors">
                  HOME
                </Link>
              </li>
              <li className="relative group dropdown">
                <Link to="/shop?category=wine" className="nav-item font-serif uppercase text-dark hover:text-[#c0a483] transition-colors flex items-center">
                  <span className=" border-[#c0a483]">WINES</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </Link>
                <div className="mega-menu">
                  <div className="container bg-white  h-fit shadow-lg pb-8  z-50 border-t-2 pt-4">
                    <div>
                      <h3>TYPES</h3>
                      <ul>
                        <li><Link to="/shop?category=wine&type=red">red wines</Link></li>
                        <li><Link to="/shop?category=wine&type=white">white wines</Link></li>
                        <li><Link to="/shop?category=wine&type=sparkling">sparkling</Link></li>
                        <li><Link to="/shop?category=wine&type=rose">rose</Link></li>
                        <li><Link to="/shop?category=wine&type=champagne">champagne</Link></li>
                        <li><Link to="/shop?category=wine&type=sake">sake</Link></li>
                        <li><Link to="/shop?category=wine&type=port">port</Link></li>
                        <li><Link to="/shop?category=wine">shop all types</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3>VARIETALS</h3>
                      <ul>
                        <li><Link to="/shop?category=wine&varietal=cabernet">cabernet sauvignon</Link></li>
                        <li><Link to="/shop?category=wine&varietal=malbec">malbec</Link></li>
                        <li><Link to="/shop?category=wine&varietal=merlot">merlot</Link></li>
                        <li><Link to="/shop?category=wine&varietal=shiraz">shiraz</Link></li>
                        <li><Link to="/shop?category=wine&varietal=syrah">syrah</Link></li>
                        <li><Link to="/shop?category=wine&varietal=pinot-noir">pinot noir</Link></li>
                        <li><Link to="/shop?category=wine&varietal=zinfandel">zinfandel</Link></li>
                        <li><Link to="/shop?category=wine&type=rose">rose & blush</Link></li>
                        <li><Link to="/shop?category=wine&type=white&varietal=blend">white blend</Link></li>
                        <li><Link to="/shop?category=wine&varietal=chardonnay">chardonnay</Link></li>
                        <li><Link to="/shop?category=wine&varietal=sauvignon-blanc">sauvignon blanc</Link></li>
                        <li><Link to="/shop?category=wine&varietal=pinot-grigio">pinot grigio/pinot gris</Link></li>
                        <li><Link to="/shop?category=wine&varietal=riesling">riesling</Link></li>
                        <li><Link to="/shop?category=wine&varietal=moscato">muscat/moscato</Link></li>
                        <li><Link to="/shop?category=wine">shop all varietals</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3>BRANDS</h3>
                      <ul>
                        <li><Link to="/shop?category=wine&brand=cabernet">cabernet sauvignon</Link></li>
                        <li><Link to="/shop?category=wine&brand=malbec">malbec</Link></li>
                        <li><Link to="/shop?category=wine&brand=merlot">merlot</Link></li>
                        <li><Link to="/shop?category=wine&brand=shiraz">shiraz</Link></li>
                        <li><Link to="/shop?category=wine&brand=syrah">syrah</Link></li>
                        <li><Link to="/shop?category=wine&brand=pinot-noir">pinot noir</Link></li>
                        <li><Link to="/shop?category=wine&brand=zinfandel">zinfandel</Link></li>
                        <li><Link to="/shop?category=wine&type=rose">rose & blush</Link></li>
                        <li><Link to="/shop?category=wine&type=white&brand=blend">white blend</Link></li>
                        <li><Link to="/shop?category=wine&brand=chardonnay">chardonnay</Link></li>
                        <li><Link to="/shop?category=wine&brand=sauvignon-blanc">sauvignon blanc</Link></li>
                        <li><Link to="/shop?category=wine&brand=pinot-grigio">pinot grigio/pinot gris</Link></li>
                        <li><Link to="/shop?category=wine&brand=riesling">riesling</Link></li>
                        <li><Link to="/shop?category=wine&brand=moscato">muscat/moscato</Link></li>
                        <li><Link to="/shop?category=wine">shop all varietals</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3>COUNTRY</h3>
                      <ul>
                        <li><Link to="/shop?category=wine&country=united-states">united states</Link></li>
                        <li><Link to="/shop?category=wine&country=canada">canada</Link></li>
                        <li><Link to="/shop?category=wine&country=australia">australia</Link></li>
                        <li><Link to="/shop?category=wine&country=italy">italy</Link></li>
                        <li><Link to="/shop?category=wine&country=france">france</Link></li>
                        <li><Link to="/shop?category=wine&country=new-zealand">new zealand</Link></li>
                        <li><Link to="/shop?category=wine&country=argentina">argentina</Link></li>
                        <li><Link to="/shop?category=wine&country=chile">chile</Link></li>
                        <li><Link to="/shop?category=wine&country=germany">germany</Link></li>
                        <li><Link to="/shop?category=wine&country=japan">japan</Link></li>
                        <li><Link to="/shop?category=wine&country=portugal">portugal</Link></li>
                        <li><Link to="/shop?category=wine&country=spain">spain</Link></li>
                        <li><Link to="/shop?category=wine">shop all countries</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
              <li className="relative group dropdown">
                <Link to="/shop?category=spirits" className="nav-item font-serif uppercase text-dark hover:text-[#c0a483] transition-colors flex items-center">
                  SPIRITS
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </Link>
                <div className="mega-menu">
                  <div className="container bg-white shadow-lg">
                    <div className='bg-white'>
                      <h3>TYPES</h3>
                      <ul>
                        <li><Link to="/shop?category=spirits&type=whiskey">whiskey</Link></li>
                        <li><Link to="/shop?category=spirits&type=vodka">vodka</Link></li>
                        <li><Link to="/shop?category=spirits&type=gin">gin</Link></li>
                        <li><Link to="/shop?category=spirits&type=rum">rum</Link></li>
                        <li><Link to="/shop?category=spirits&type=tequila">tequila</Link></li>
                        <li><Link to="/shop?category=spirits&type=cognac">cognac</Link></li>
                        <li><Link to="/shop?category=spirits">shop all types</Link></li>
                      </ul>
                    </div>
                    <div className='bg-white'>
                      <h3>FEATURED BRANDS</h3>
                      <ul>
                        <li><Link to="/shop?brand=johnnie-walker">johnnie walker</Link></li>
                        <li><Link to="/shop?brand=jack-daniels">jack daniel's</Link></li>
                        <li><Link to="/shop?brand=absolut">absolut</Link></li>
                        <li><Link to="/shop?brand=grey-goose">grey goose</Link></li>
                        <li><Link to="/shop?brand=bacardi">bacardi</Link></li>
                        <li><Link to="/shop?brand=hennessy">hennessy</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
              <li className="relative group dropdown">
                <Link to="/shop?category=beer" className="nav-item font-serif uppercase text-dark hover:text-[#c0a483] transition-colors flex items-center">
                  BEER & MORE
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </Link>
                <div className="mega-menu">
                  <div className="container shadow-lg">
                    <div>
                      <h3>TYPES</h3>
                      <ul>
                        <li><Link to="/shop?category=beer&type=lager">lager</Link></li>
                        <li><Link to="/shop?category=beer&type=ale">ale</Link></li>
                        <li><Link to="/shop?category=beer&type=stout">stout</Link></li>
                        <li><Link to="/shop?category=beer&type=ipa">ipa</Link></li>
                        <li><Link to="/shop?category=beer&type=cider">cider</Link></li>
                        <li><Link to="/shop?category=beer">shop all types</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3>FEATURED BRANDS</h3>
                      <ul>
                        <li><Link to="/shop?brand=corona">corona</Link></li>
                        <li><Link to="/shop?brand=heineken">heineken</Link></li>
                        <li><Link to="/shop?brand=budweiser">budweiser</Link></li>
                        <li><Link to="/shop?brand=stella-artois">stella artois</Link></li>
                        <li><Link to="/shop?brand=guinness">guinness</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
              <li className="relative group dropdown">
                <Link to="/special-products" className="nav-item font-serif uppercase text-dark hover:text-[#c0a483] transition-colors flex items-center">
                  SPECIAL PRODUCTS
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </Link>
                <div className="mega-menu">
                  <div className="container shadow-lg">
                    <div>
                      <h3>SPECIAL COLLECTIONS</h3>
                      <ul>
                        <li><Link to="/shop?special=limited-edition">limited edition</Link></li>
                        <li><Link to="/shop?special=rare-find">rare finds</Link></li>
                        <li><Link to="/shop?special=exclusive">exclusive products</Link></li>
                        <li><Link to="/shop?special=gift-sets">gift sets</Link></li>
                        <li><Link to="/special-orders">special orders</Link></li>
                        <li><Link to="/private-commercial">private & commercial</Link></li>
                        <li><Link to="/free-draw">vip golf weekend</Link></li>
                        <li><Link to="/special-products">view all</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
              {/* <li>
                <Link to="/excel-demo" className="font-serif uppercase text-dark hover:text-primary transition-colors flex items-center ml-6">
                  Excel Demo
                </Link>
              </li> */}
            </ul>
          </nav>

          {/* Search & Icons */}
          <div className="flex items-center space-x-4">
            {/* Account Icon */}
            <div className="hidden md:block relative">
              <button 
                onClick={toggleLoginForm}
                className="login-trigger text-dark p-2 hover:text-primary focus:outline-none"
              >
                <span className="text-dark font-medium uppercase hover:text-[#c0a483]">Login/Register</span>
              </button>
              
              {/* Login Form Popup */}
              {loginFormOpen && (
                <div className="login-form absolute right-0 border-t-2 border-t-[#c0a483] top-full mt-2 w-96 bg-white shadow-lg z-50 border border-gray-200">
                  <div className="p-6">
                    <div className="flex justify-between border-b pb-4 mb-4">
                      <h2 className="text-xl font-serif text-dark">Sign in</h2>
                      <Link to="/my-account" className="text-[#c0a483] hover:underline hover:text-black font-serif">
                        Create An Account
                      </Link>
                    </div>
                    
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-gray-600">
                          Username or email <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          placeholder="Your name"
                          className="w-full p-3 border border-gray-300 focus:border-[#c0a483] focus:outline-none"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-gray-600">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="password" 
                          placeholder="Password"
                          className="w-full p-3 border border-gray-300 focus:border-[#c0a483] focus:outline-none"
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-[#c0a483]" />
                          <span className="text-gray-600">Remember me</span>
                        </label>
                        
                        <Link to="/forgot-password" className="text-[#c0a483] hover:underline text-sm">
                          Lost your password?
                        </Link>
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full bg-black text-white py-3 uppercase font-serif transition-colors hover:bg-[#c0a483] "
                      >
                        LOGIN
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
            
            {/* Wishlist Icon */}
            <Link to="/wishlist" className="hidden md:block text-dark p-2 hover:hover:text-[#c0a483] focus:outline-none relative">
              <HeartIcon className="h-6 w-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            {/* Cart Icon */}
            <button onClick={toggleCart} className="text-dark p-2 hover:hover:text-[#c0a483] focus:outline-none relative">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Search Icon */}
            <button onClick={toggleSearch} className="text-dark p-2 hover:hover:text-[#c0a483] focus:outline-none">
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {/* Navigation - Mobile */}
            <div className="md:hidden">
              <button 
                className="mobile-menu-button p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Green Section Below Navbar */}
      <div className="bg-[#6c8d7f] text-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="w-full md:w-1/2 text-center md:text-right pr-0 md:pr-6 py-1 md:py-2">
            <p className="text-xs sm:text-sm uppercase tracking-wider leading-relaxed font-normal font-serif">
              GROW YOUR SALES ONLINE! START SELLING LIQUOR ON YOUR OWN WEBSITE TODAY
            </p>
          </div>
          <div className="hidden md:block h-12 w-px bg-white/30"></div>
          <div className="w-full hidden md:block md:w-1/2 text-center md:text-left pl-0 md:pl-6 py-1 md:py-2">
            <p className="text-xs sm:text-sm uppercase tracking-wider leading-relaxed font-normal font-serif">
              PRICES AND OTHER OPTIONS ARE AVAILABLE AT <a target="_blank" rel="noopener noreferrer" href="https://liquoronline.ca/pricing/" className="hover:text-[#c0a483]">LIQUORONLINE.CA/PRICING</a>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu fixed inset-0 z-50 bg-white bg-opacity-95 flex flex-col pt-16 px-6 overflow-y-auto">
          <div className="flex justify-end">
            <button
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="py-4 space-y-6">
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/" 
                  className="block py-2 font-serif text-dark uppercase hover:text-[#c0a483] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  HOME
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop?category=wine" 
                  className="block py-2 font-serif text-dark uppercase hover:text-[#c0a483] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  WINES
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop?category=spirits" 
                  className="block py-2 font-serif text-dark uppercase hover:text-[#c0a483] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  SPIRITS
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop?category=beer" 
                  className="block py-2 font-serif text-dark uppercase hover:text-[#c0a483] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  BEER & MORE
                </Link>
              </li>
              <li>
                <Link 
                  to="/special-products" 
                  className="block py-2 font-serif text-dark uppercase hover:text-[#c0a483] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  SPECIAL PRODUCTS
                </Link>
                <ul className="pl-4 space-y-2 pt-2">
                  <li>
                    <Link 
                      to="/special-orders"
                      className="block py-1 text-dark hover:text-[#c0a483] transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Special Orders
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/private-commercial"
                      className="block py-1 text-dark hover:text-[#c0a483] transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Private & Commercial
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/free-draw"
                      className="block py-1 text-dark hover:text-[#c0a483] transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      VIP Golf Weekend
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg">
          <div className="container mx-auto py-4 px-4">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="flex-grow py-2 px-4 border-b border-gray-200 focus:outline-none focus:border-primary"
              />
              <button 
                type="submit" 
                className="ml-2 p-2 text-dark hover:text-primary focus:outline-none"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
              <button 
                type="button" 
                onClick={toggleSearch} 
                className="ml-2 p-2 text-dark hover:text-primary focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mini Cart Sidebar */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={toggleCart}
            />

            {/* Cart Panel */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-medium font-serif">Your Cart ({cartCount})</h2>
                <button 
                  onClick={toggleCart}
                  className="text-gray-500 hover:text-dark"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Link 
                    to="/shop"
                    onClick={toggleCart}
                    className="inline-block bg-[#c0a483] text-white py-2 px-4 hover:bg-black transition-colors font-serif"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-gray-100">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex p-4 gap-4">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-20 h-20 object-contain"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-dark">{item.name}</h3>
                          <div className="flex justify-between items-center mt-1">
                            <div className="flex items-center mt-2">
                              <button 
                                onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-100"
                              >
                                -
                              </button>
                              <span className="w-10 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${((item.salePrice || item.price) * item.quantity).toFixed(2)}</div>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-xs text-[#c0a483] hover:underline mt-1">
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t sticky bottom-0 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium">Subtotal:</span>
                      <span className="font-medium text-lg">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to="/cart"
                        onClick={toggleCart}
                        className="border border-[#c0a483] text-[#c0a483] hover:bg-[#c0a483] hover:text-white py-2 text-center font-medium font-serif"
                      >
                        View Cart
                      </Link>
                      <Link
                        to="/checkout"
                        onClick={toggleCart}
                        className="bg-[#c0a483] text-white hover:bg-[#c0a483]/90 py-2 text-center font-medium font-serif"
                      >
                        Checkout
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavBar;
