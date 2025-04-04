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
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useUserAuth } from '../../contexts/UserAuthContext';
import NotificationBell from './NotificationBell';
import { GoogleLogin } from '@react-oauth/google';
import { useTaxonomy } from '../../context/TaxonomyContext';
import { useProducts } from '../../context/ProductContext';

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
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Check if admin is logged in
  const { isAuthenticated: isAdminAuthenticated } = useAdminAuth();

  // Check if user is logged in
  const { 
    user, 
    isAuthenticated: isUserAuthenticated, 
    login: userLogin, 
    logout: userLogout,
    error: userAuthError, 
    loading: userAuthLoading,
    loginWithGoogle
  } = useUserAuth();

  // Get cart state from context
  const { cartItems, cartTotal, removeFromCart, updateCartItemQuantity, cartCount } = useCart();

  // Get wishlist state from context
  const { wishlistItems, wishlistCount, removeFromWishlist, isInWishlist } = useWishlist();

  // Get taxonomy data for dynamic dropdown menus
  const { categories, brands, countries, varietals, types, loading: taxonomyLoading } = useTaxonomy();

  // Get products from ProductContext - same as in ShopPage
  const { products, loading: productsLoading } = useProducts();

  // State for wine types to be displayed
  const [wineTypes, setWineTypes] = useState([]);
  // State for wine-specific brands to be displayed
  const [wineBrands, setWineBrands] = useState([]);
  // State for wine-specific countries to be displayed
  const [wineCountries, setWineCountries] = useState([]);
  // State for wine-specific varietals to be displayed
  const [wineVarietals, setWineVarietals] = useState([]);
  // State for spirit types to be displayed
  const [spiritTypes, setSpiritTypes] = useState([]);
  // State for beer types to be displayed
  const [beerTypes, setBeerTypes] = useState([]);

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

      if (profileDropdownOpen && !event.target.closest('.profile-dropdown') && !event.target.closest('.profile-trigger')) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen, loginFormOpen, profileDropdownOpen]);

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

  // Extract wine, spirit, and beer types directly from product data
  // This exactly matches what ShopPage does
  useEffect(() => {
    if (!productsLoading && products && products.length > 0) {
      console.log('Extracting types from products data:', products.length);
      
      // Filter products by category
      const wineProducts = products.filter(product => {
        const category = product.category || product['tax:product_cat'];
        return category && category.toLowerCase() === 'wine';
      });

      const spiritProducts = products.filter(product => {
        const category = product.category || product['tax:product_cat'];
        return category && category.toLowerCase() === 'spirits';
      });

      const beerProducts = products.filter(product => {
        const category = product.category || product['tax:product_cat'];
        return category && category.toLowerCase() === 'beer';
      });

      // Extract unique types from filtered products
      // This is exactly how ShopPage does it
      const wineTypesList = [...new Set(wineProducts.map(product => product.type || product['tax:type']).filter(Boolean))];
      const spiritTypesList = [...new Set(spiritProducts.map(product => product.type || product['tax:type']).filter(Boolean))];
      const beerTypesList = [...new Set(beerProducts.map(product => product.type || product['tax:type']).filter(Boolean))];
      
      // Extract wine-specific brands, countries, and varietals
      const wineBrandsList = [...new Set(wineProducts.map(product => product.brand || product['tax:product_brand']).filter(Boolean))];
      const wineCountriesList = [...new Set(wineProducts.map(product => product.country || product['tax:Country']).filter(Boolean))];
      const wineVarietalsList = [...new Set(wineProducts.map(product => product.varietal || product['tax:varietal']).filter(Boolean))];

      console.log('Extracted wine types from products:', wineTypesList);
      console.log('Extracted wine brands from products:', wineBrandsList);
      console.log('Extracted wine countries from products:', wineCountriesList);
      console.log('Extracted wine varietals from products:', wineVarietalsList);
      console.log('Extracted spirit types from products:', spiritTypesList);
      console.log('Extracted beer types from products:', beerTypesList);

      setWineTypes(wineTypesList);
      setWineBrands(wineBrandsList);
      setWineCountries(wineCountriesList);
      setWineVarietals(wineVarietalsList);
      setSpiritTypes(spiritTypesList);
      setBeerTypes(beerTypesList);
    }
  }, [products, productsLoading]);

  // First, add a useEffect to debug the taxonomy data (add after other useEffects)
  useEffect(() => {
    // Log taxonomy data when it changes
    if (!taxonomyLoading) {
      console.log('Taxonomy data loaded:', {
        types: types?.length || 0,
        varietals: varietals?.length || 0,
        brands: brands?.length || 0,
        countries: countries?.length || 0
      });
    }
  }, [taxonomyLoading, types, varietals, brands, countries]);

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

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
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

  // Form state for user login
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  // Handle login form change
  const handleLoginFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle login form submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const success = await userLogin({
        username: loginForm.username,
        password: loginForm.password
      });
      
      if (success) {
        setLoginFormOpen(false);
        setLoginForm({
          username: '',
          password: '',
          rememberMe: false
        });
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await userLogout();
  };

  // Handle Google login success
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const success = await loginWithGoogle(credentialResponse);
      if (success) {
        setLoginFormOpen(false);
      }
    } catch (err) {
      console.error('Google login error:', err);
    }
  };

  // Handle Google login error
  const handleGoogleLoginError = () => {
    console.error('Google login failed');
  };

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
                        {wineTypes && wineTypes.length > 0 ? (
                          wineTypes
                            // Sort alphabetically just like shop page
                            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
                            .slice(0, 20)
                            .map((type, index) => (
                              <li key={index}>
                                <Link to={`/shop?category=wine&type=${encodeURIComponent(type.toLowerCase())}`}>
                                  {type.toLowerCase()}
                                </Link>
                              </li>
                            ))
                        ) : (
                          // Fallback for when no types are loaded
                          <>
                            <li><Link to="/shop?category=wine&type=red">red wines</Link></li>
                            <li><Link to="/shop?category=wine&type=white">white wines</Link></li>
                            <li><Link to="/shop?category=wine&type=sparkling">sparkling</Link></li>
                            <li><Link to="/shop?category=wine&type=rose">rose</Link></li>
                            <li><Link to="/shop?category=wine&type=champagne">champagne</Link></li>
                            <li><Link to="/shop?category=wine&type=sake">sake</Link></li>
                            <li><Link to="/shop?category=wine&type=port">port</Link></li>
                          </>
                        )}
                        <li><Link to="/shop?category=wine">shop all types</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3>VARIETALS</h3>
                      <ul>
                        {wineVarietals && wineVarietals.length > 0 ? (
                          wineVarietals
                            .filter(varietal => varietal && varietal.trim() !== '')
                            .slice(0, 15) 
                            .map((varietal, index) => (
                              <li key={index}>
                                <Link to={`/shop?category=wine&varietal=${encodeURIComponent(varietal.toLowerCase())}`}>
                                  {varietal.toLowerCase()}
                                </Link>
                              </li>
                            ))
                        ) : (
                          // Fallback for when no varietals are loaded
                          <>
                            <li><Link to="/shop?category=wine&varietal=cabernet">cabernet sauvignon</Link></li>
                            <li><Link to="/shop?category=wine&varietal=malbec">malbec</Link></li>
                            <li><Link to="/shop?category=wine&varietal=merlot">merlot</Link></li>
                            <li><Link to="/shop?category=wine&varietal=shiraz">shiraz</Link></li>
                            <li><Link to="/shop?category=wine&varietal=pinot-noir">pinot noir</Link></li>
                            <li><Link to="/shop?category=wine&varietal=chardonnay">chardonnay</Link></li>
                            <li><Link to="/shop?category=wine&varietal=sauvignon-blanc">sauvignon blanc</Link></li>
                          </>
                        )}
                        <li><Link to="/shop?category=wine">shop all varietals</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3>BRANDS</h3>
                      <ul>
                        {wineBrands && wineBrands.length > 0 ? (
                          wineBrands
                            .filter(brand => brand && brand.trim() !== '')
                            .slice(0, 15)
                            .map((brand, index) => (
                              <li key={index}>
                                <Link to={`/shop?category=wine&brand=${encodeURIComponent(brand.toLowerCase())}`}>
                                  {brand.toLowerCase()}
                                </Link>
                              </li>
                            ))
                        ) : (
                          // Fallback for when no brands are loaded
                          <>
                            <li><Link to="/shop?category=wine&brand=josh-cellars">josh cellars</Link></li>
                            <li><Link to="/shop?category=wine&brand=barefoot">barefoot</Link></li>
                            <li><Link to="/shop?category=wine&brand=yellow-tail">yellow tail</Link></li>
                            <li><Link to="/shop?category=wine&brand=kendall-jackson">kendall jackson</Link></li>
                            <li><Link to="/shop?category=wine&brand=robert-mondavi">robert mondavi</Link></li>
                          </>
                        )}
                        <li><Link to="/shop?category=wine">shop all brands</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3>COUNTRY</h3>
                      <ul>
                        {wineCountries && wineCountries.length > 0 ? (
                          wineCountries
                            .filter(country => country && country.trim() !== '')
                            .slice(0, 13)
                            .map((country, index) => (
                              <li key={index}>
                                <Link to={`/shop?category=wine&country=${encodeURIComponent(country.toLowerCase())}`}>
                                  {country.toLowerCase()}
                                </Link>
                              </li>
                            ))
                        ) : (
                          // Fallback for when no countries are loaded
                          <>
                            <li><Link to="/shop?category=wine&country=united-states">united states</Link></li>
                            <li><Link to="/shop?category=wine&country=france">france</Link></li>
                            <li><Link to="/shop?category=wine&country=italy">italy</Link></li>
                            <li><Link to="/shop?category=wine&country=spain">spain</Link></li>
                            <li><Link to="/shop?category=wine&country=australia">australia</Link></li>
                          </>
                        )}
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
                        {spiritTypes && spiritTypes.length > 0 ? (
                          spiritTypes
                            // Sort alphabetically just like shop page
                            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
                            .slice(0, 20)
                            .map((type, index) => (
                              <li key={index}>
                                <Link to={`/shop?category=spirits&type=${encodeURIComponent(type.toLowerCase())}`}>
                                  {type.toLowerCase()}
                                </Link>
                              </li>
                            ))
                        ) : (
                          <>
                            <li><Link to="/shop?category=spirits&type=whiskey">whiskey</Link></li>
                            <li><Link to="/shop?category=spirits&type=vodka">vodka</Link></li>
                            <li><Link to="/shop?category=spirits&type=gin">gin</Link></li>
                            <li><Link to="/shop?category=spirits&type=rum">rum</Link></li>
                            <li><Link to="/shop?category=spirits&type=tequila">tequila</Link></li>
                            <li><Link to="/shop?category=spirits&type=cognac">cognac</Link></li>
                          </>
                        )}
                        <li><Link to="/shop?category=spirits">shop all types</Link></li>
                      </ul>
                    </div>
                    <div className='bg-white'>
                      <h3>FEATURED BRANDS</h3>
                      <ul>
                        {brands
                          .filter(brand => ['johnnie walker', 'jack daniels', 'absolut', 'grey goose', 'bacardi', 'hennessy']
                                            .includes(brand.toLowerCase()))
                          .map((brand, index) => (
                            <li key={index}>
                              <Link to={`/shop?category=spirits&brand=${encodeURIComponent(brand.toLowerCase())}`}>
                                {brand.toLowerCase()}
                              </Link>
                            </li>
                          ))}
                        {brands.length === 0 && (
                          <>
                            <li><Link to="/shop?category=spirits&brand=johnnie-walker">johnnie walker</Link></li>
                            <li><Link to="/shop?category=spirits&brand=jack-daniels">jack daniel's</Link></li>
                            <li><Link to="/shop?category=spirits&brand=absolut">absolut</Link></li>
                            <li><Link to="/shop?category=spirits&brand=grey-goose">grey goose</Link></li>
                            <li><Link to="/shop?category=spirits&brand=bacardi">bacardi</Link></li>
                            <li><Link to="/shop?category=spirits&brand=hennessy">hennessy</Link></li>
                          </>
                        )}
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
                        {beerTypes && beerTypes.length > 0 ? (
                          beerTypes
                            // Sort alphabetically just like shop page
                            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
                            .slice(0, 20)
                            .map((type, index) => (
                              <li key={index}>
                                <Link to={`/shop?category=beer&type=${encodeURIComponent(type.toLowerCase())}`}>
                                  {type.toLowerCase()}
                                </Link>
                              </li>
                            ))
                        ) : (
                          <>
                            <li><Link to="/shop?category=beer&type=lager">lager</Link></li>
                            <li><Link to="/shop?category=beer&type=ale">ale</Link></li>
                            <li><Link to="/shop?category=beer&type=stout">stout</Link></li>
                            <li><Link to="/shop?category=beer&type=ipa">ipa</Link></li>
                            <li><Link to="/shop?category=beer&type=cider">cider</Link></li>
                          </>
                        )}
                        <li><Link to="/shop?category=beer">shop all types</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3>FEATURED BRANDS</h3>
                      <ul>
                        {brands
                          .filter(brand => ['corona', 'heineken', 'budweiser', 'stella artois', 'guinness']
                                           .includes(brand.toLowerCase()))
                          .map((brand, index) => (
                            <li key={index}>
                              <Link to={`/shop?category=beer&brand=${encodeURIComponent(brand.toLowerCase())}`}>
                                {brand.toLowerCase()}
                              </Link>
                            </li>
                          ))}
                        {brands.length === 0 && (
                          <>
                            <li><Link to="/shop?category=beer&brand=corona">corona</Link></li>
                            <li><Link to="/shop?category=beer&brand=heineken">heineken</Link></li>
                            <li><Link to="/shop?category=beer&brand=budweiser">budweiser</Link></li>
                            <li><Link to="/shop?category=beer&brand=stella-artois">stella artois</Link></li>
                            <li><Link to="/shop?category=beer&brand=guinness">guinness</Link></li>
                          </>
                        )}
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
            {/* Account Icon - only show if neither admin nor user is authenticated */}
            {!isAdminAuthenticated && !isUserAuthenticated && (
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
                      
                      {userAuthError && (
                        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
                          <p>{userAuthError}</p>
                        </div>
                      )}
                      
                      <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-gray-600">
                            Username or email <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text" 
                            name="username"
                            value={loginForm.username}
                            onChange={handleLoginFormChange}
                            placeholder="Your username or email"
                            className="w-full p-3 border border-gray-300 focus:border-[#c0a483] focus:outline-none"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-gray-600">
                            Password <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="password" 
                            name="password"
                            value={loginForm.password}
                            onChange={handleLoginFormChange}
                            placeholder="Password"
                            className="w-full p-3 border border-gray-300 focus:border-[#c0a483] focus:outline-none"
                            required
                          />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              name="rememberMe"
                              checked={loginForm.rememberMe}
                              onChange={handleLoginFormChange}
                              className="w-4 h-4 text-[#c0a483]" 
                            />
                            <span className="text-gray-600">Remember me</span>
                          </label>
                          
                          <Link to="/forgot-password" className="text-[#c0a483] hover:underline text-sm">
                            Lost your password?
                          </Link>
                        </div>
                        
                        <button
                          type="submit"
                          disabled={userAuthLoading}
                          className="w-full bg-black text-white py-3 uppercase font-serif transition-colors hover:bg-[#c0a483] disabled:bg-gray-400"
                        >
                          {userAuthLoading ? 'LOGGING IN...' : 'LOGIN'}
                        </button>
                      </form>

                      <div className="my-4 relative flex items-center justify-center">
                        <div className="border-t border-gray-300 absolute w-full"></div>
                        <span className="bg-white px-4 relative text-gray-500 text-sm">OR</span>
                      </div>
                      
                      <div className="flex justify-center">
                        <GoogleLogin
                          onSuccess={handleGoogleLoginSuccess}
                          onError={handleGoogleLoginError}
                          useOneTap
                          theme="outline"
                          shape="rectangular"
                          text="signin_with"
                          width="280"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Admin Dashboard link if admin is logged in */}
            {isAdminAuthenticated && (
              <div className="hidden md:block">
                <Link 
                  to="/admin/dashboard"
                  className="text-dark font-medium uppercase hover:text-[#c0a483]"
                >
                  Admin Dashboard
                </Link>
              </div>
            )}
            
            {/* User account section if user is logged in */}
            {isUserAuthenticated && !isAdminAuthenticated && (
              <div className="hidden md:block relative">
                <div className="flex items-center space-x-2">
                  <span className="text-dark font-medium">Hello, {user?.username}</span>
                  <div className="relative profile-dropdown">
                    <button 
                      className="flex items-center space-x-1 text-dark profile-trigger"
                      onClick={toggleProfileDropdown}
                    >
                      <UserIcon className="h-5 w-5" />
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    
                    {profileDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg z-[100] border border-gray-200 rounded-md">
                        <div className="py-2">
                          <Link to="/notifications" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                            My Notifications
                          </Link>
                          {/* <Link to="/my-orders" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                            My Orders
                          </Link> */}
                          <button 
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                          >
                            Log Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Notification Bell - only show for logged in users */}
            {isUserAuthenticated && !isAdminAuthenticated && (
              <div className="hidden md:block">
                <NotificationBell />
              </div>
            )}
            
            {/* Wishlist Icon - hide for admin users */}
            {!isAdminAuthenticated && (
              <Link to="/wishlist" className="hidden md:block text-dark p-2 hover:hover:text-[#c0a483] focus:outline-none relative">
                <HeartIcon className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#c0a483] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}
            
            {/* Cart Icon - hide for admin users */}
            {!isAdminAuthenticated && (
              <button onClick={toggleCart} className="text-dark p-2 hover:hover:text-[#c0a483] focus:outline-none relative">
                <ShoppingCartIcon className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#c0a483] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

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
                      <div key={item.productId} className="flex p-4 gap-4">
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
                                onClick={() => updateCartItemQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-100"
                              >
                                -
                              </button>
                              <span className="w-10 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${((item.salePrice || item.price) * item.quantity).toFixed(2)}</div>
                              <button 
                                onClick={() => removeFromCart(item.productId)}
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
