import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  CreditCardIcon,
  MapPinIcon,
  LockClosedIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import AnimatedSection from '../components/home/AnimatedSection';

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    document.title = 'My Account - Liquor Online';
    // Check if user is logged in (mock)
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock login
    const mockUser = { name: 'John Doe', email: 'john.doe@example.com' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'orders':
        return <OrdersTab />;
      case 'wishlist':
        return <WishlistTab />;
      case 'payment':
        return <PaymentMethodsTab />;
      case 'addresses':
        return <AddressesTab />;
      case 'account':
        return <AccountDetailsTab />;
      default:
        return <DashboardTab />;
    }
  };

  if (!isLoggedIn) {
    return (
      <div>
        {/* Hero Banner */}
        <div className="relative h-64 bg-dark flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://ext.same-assets.com/1701767421/4224202088.png"
              alt="Account Banner"
              className="w-full h-full object-cover opacity-30"
            />
          </div>
          <div className="relative z-10 text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              My Account
            </motion.h1>
            <motion.div
              className="flex items-center justify-center text-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link to="/" className="hover:text-white">Home</Link>
              <span className="mx-2">›</span>
              <span className="font-medium">My Account</span>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-dark mb-6 text-center">Login to Your Account</h2>
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 text-gray-700">Remember me</label>
                </div>
                <a href="#" className="text-primary hover:text-primary/80">Forgot password?</a>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
              >
                Login
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">Don't have an account? <a href="#" className="text-primary hover:text-primary/80">Register now</a></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative h-64 bg-dark flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://ext.same-assets.com/1701767421/4224202088.png"
            alt="Account Banner"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            My Account
          </motion.h1>
          <motion.div
            className="flex items-center justify-center text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <span className="font-medium">My Account</span>
          </motion.div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AnimatedSection className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-dark">John Doe</h3>
                  <p className="text-gray-500 text-sm">john.doe@example.com</p>
                </div>
              </div>

              <nav className="space-y-1">
                <AccountNavItem
                  label="Dashboard"
                  icon={<UserIcon className="h-5 w-5" />}
                  isActive={activeTab === 'dashboard'}
                  onClick={() => setActiveTab('dashboard')}
                />
                <AccountNavItem
                  label="Orders"
                  icon={<ShoppingBagIcon className="h-5 w-5" />}
                  isActive={activeTab === 'orders'}
                  onClick={() => setActiveTab('orders')}
                />
                <AccountNavItem
                  label="Wishlist"
                  icon={<HeartIcon className="h-5 w-5" />}
                  isActive={activeTab === 'wishlist'}
                  onClick={() => setActiveTab('wishlist')}
                />
                <AccountNavItem
                  label="Payment Methods"
                  icon={<CreditCardIcon className="h-5 w-5" />}
                  isActive={activeTab === 'payment'}
                  onClick={() => setActiveTab('payment')}
                />
                <AccountNavItem
                  label="Addresses"
                  icon={<MapPinIcon className="h-5 w-5" />}
                  isActive={activeTab === 'addresses'}
                  onClick={() => setActiveTab('addresses')}
                />
                <AccountNavItem
                  label="Account Details"
                  icon={<LockClosedIcon className="h-5 w-5" />}
                  isActive={activeTab === 'account'}
                  onClick={() => setActiveTab('account')}
                />
                <AccountNavItem
                  label="Logout"
                  icon={<ArrowLeftOnRectangleIcon className="h-5 w-5" />}
                  onClick={handleLogout}
                />
              </nav>
            </AnimatedSection>
          </div>

          {/* Content */}
          <AnimatedSection className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {renderTabContent()}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

const AccountNavItem = ({ label, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
        isActive 
          ? 'bg-primary text-white' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
};

// Tab components
const DashboardTab = () => (
  <div>
    <h2 className="text-2xl font-bold text-dark mb-6">Dashboard</h2>
    <p className="text-gray-600 mb-6">
      Hello, <span className="font-medium">John Doe</span>. From your account dashboard, you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <ShoppingBagIcon className="h-8 w-8 text-primary mr-3" />
          <h3 className="text-xl font-bold">Recent Orders</h3>
        </div>
        <p className="text-gray-600 mb-4">You have 2 pending orders.</p>
        <button 
          onClick={() => {}}
          className="text-primary hover:text-primary/80 font-medium"
        >
          View Orders
        </button>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <HeartIcon className="h-8 w-8 text-primary mr-3" />
          <h3 className="text-xl font-bold">Wishlist</h3>
        </div>
        <p className="text-gray-600 mb-4">You have 5 items in your wishlist.</p>
        <button 
          onClick={() => {}}
          className="text-primary hover:text-primary/80 font-medium"
        >
          View Wishlist
        </button>
      </div>
    </div>
  </div>
);

const OrdersTab = () => (
  <div>
    <h2 className="text-2xl font-bold text-dark mb-6">Your Orders</h2>
    
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#1001</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">March 15, 2024</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Completed
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$120.00</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <a href="#" className="text-primary hover:text-primary/80">View</a>
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#1002</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">March 20, 2024</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Processing
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$85.50</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <a href="#" className="text-primary hover:text-primary/80">View</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div className="mt-6">
      <p className="text-gray-600">No more orders to display.</p>
    </div>
  </div>
);

const WishlistTab = () => (
  <div>
    <h2 className="text-2xl font-bold text-dark mb-6">Your Wishlist</h2>
    
    <div className="grid grid-cols-1 gap-6">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex flex-col md:flex-row border border-gray-200 rounded-lg overflow-hidden">
          <div className="md:w-1/4 p-4 flex items-center justify-center bg-gray-50">
            <img 
              src={`https://ext.same-assets.com/1701767421/${Math.floor(Math.random() * 10000000)}.png`} 
              alt="Product" 
              className="h-32 object-contain"
            />
          </div>
          <div className="md:w-3/4 p-4 flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-medium text-dark mb-1">Premium Bottle {item}</h3>
              <div className="flex items-center text-yellow-400 mb-2">
                {Array(5).fill(0).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-500 ml-1">(24)</span>
              </div>
              <p className="text-lg font-bold text-primary">$149.99</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors">
                Add to Cart
              </button>
              <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-50 transition-colors">
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PaymentMethodsTab = () => (
  <div>
    <h2 className="text-2xl font-bold text-dark mb-6">Payment Methods</h2>
    
    <div className="mb-8">
      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gray-100 p-2 rounded-md mr-4">
              <CreditCardIcon className="h-8 w-8 text-dark" />
            </div>
            <div>
              <p className="font-medium text-dark">Visa ending in 4242</p>
              <p className="text-sm text-gray-500">Expires 12/24</p>
            </div>
          </div>
          <div className="flex items-center">
            <button className="text-gray-500 hover:text-dark mr-2">Edit</button>
            <button className="text-red-500 hover:text-red-600">Delete</button>
          </div>
        </div>
      </div>
    </div>
    
    <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors">
      Add Payment Method
    </button>
  </div>
);

const AddressesTab = () => (
  <div>
    <h2 className="text-2xl font-bold text-dark mb-6">Your Addresses</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between mb-4">
          <h3 className="font-bold text-lg text-dark">Shipping Address</h3>
          <div className="flex space-x-2">
            <button className="text-primary hover:text-primary/80 text-sm">Edit</button>
            <button className="text-red-500 hover:text-red-600 text-sm">Delete</button>
          </div>
        </div>
        <div className="text-gray-600">
          <p>John Doe</p>
          <p>123 Main Street</p>
          <p>Apt 4B</p>
          <p>New York, NY 10001</p>
          <p>United States</p>
          <p className="mt-2">Phone: (555) 123-4567</p>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between mb-4">
          <h3 className="font-bold text-lg text-dark">Billing Address</h3>
          <div className="flex space-x-2">
            <button className="text-primary hover:text-primary/80 text-sm">Edit</button>
            <button className="text-red-500 hover:text-red-600 text-sm">Delete</button>
          </div>
        </div>
        <div className="text-gray-600">
          <p>John Doe</p>
          <p>123 Main Street</p>
          <p>Apt 4B</p>
          <p>New York, NY 10001</p>
          <p>United States</p>
          <p className="mt-2">Phone: (555) 123-4567</p>
        </div>
      </div>
    </div>
    
    <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors">
      Add New Address
    </button>
  </div>
);

const AccountDetailsTab = () => (
  <div>
    <h2 className="text-2xl font-bold text-dark mb-6">Account Details</h2>
    
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-gray-700 mb-2">First Name</label>
          <input 
            type="text" 
            id="firstName" 
            defaultValue="John"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-gray-700 mb-2">Last Name</label>
          <input 
            type="text" 
            id="lastName" 
            defaultValue="Doe"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
        <input 
          type="email" 
          id="email" 
          defaultValue="john.doe@example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      
      <div>
        <label htmlFor="phoneNumber" className="block text-gray-700 mb-2">Phone Number</label>
        <input 
          type="tel" 
          id="phoneNumber" 
          defaultValue="(555) 123-4567"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      
      <h3 className="font-bold text-dark mt-8 mb-4">Password Change</h3>
      
      <div>
        <label htmlFor="currentPassword" className="block text-gray-700 mb-2">Current Password</label>
        <input 
          type="password" 
          id="currentPassword" 
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      
      <div>
        <label htmlFor="newPassword" className="block text-gray-700 mb-2">New Password</label>
        <input 
          type="password" 
          id="newPassword" 
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm New Password</label>
        <input 
          type="password" 
          id="confirmPassword" 
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      
      <button 
        type="submit"
        className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary/90 transition-colors"
      >
        Save Changes
      </button>
    </form>
  </div>
);

export default AccountPage; 