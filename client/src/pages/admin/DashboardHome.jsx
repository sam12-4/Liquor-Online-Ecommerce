import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  ExclamationCircleIcon,
  CurrencyDollarIcon,
  TagIcon,
  TicketIcon,
  BellIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { useProducts } from '../../context/ProductContext';
import { useAdminNotifications } from '../../contexts/AdminNotificationContext';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, ResponsiveContainer 
} from 'recharts';

const DashboardHome = () => {
  // Product data
  const { products, refreshProducts } = useProducts();
  
  // Notifications
  const { notifications } = useAdminNotifications();
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Chart colors
  const COLORS = ['#4f46e5', '#eab308', '#ef4444', '#10b981', '#8b5cf6', '#6b7280'];
  
  // Load products and recent orders when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load products if needed
        if (products.length === 0) {
          await refreshProducts();
        }
        
        // Remove the problematic fetch request since the endpoint doesn't exist
        // Just set an empty array for recentOrders
        setRecentOrders([]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    
    loadData();
  }, [refreshProducts, products.length]);
  
  // Calculate key metrics
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => {
    const stock = parseInt(p.stock || p.stock_quantity || 0);
    return stock > 0 && stock < 5;
  }).length;
  const outOfStockProducts = products.filter(p => {
    const stock = parseInt(p.stock || p.stock_quantity || 0);
    return stock === 0;
  }).length;
  const inStockProducts = totalProducts - lowStockProducts - outOfStockProducts;
  const specialProducts = products.filter(p => 
    p.isSpecial === 'true' || p.isSpecial === true || 
    p.isLimitedEdition === 'true' || p.isLimitedEdition === true
  ).length;
  
  // Calculate notification metrics
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const stockNotifications = notifications.filter(n => 
    n.type === 'out_of_stock' || n.type === 'low_stock'
  ).length;
  
  // Prepare data for stock distribution pie chart
  const stockData = [
    { name: 'In Stock', value: inStockProducts, color: '#4f46e5' },
    { name: 'Low Stock', value: lowStockProducts, color: '#eab308' },
    { name: 'Out of Stock', value: outOfStockProducts, color: '#ef4444' }
  ];
  
  // Prepare data for product categories chart
  const getCategoryDistribution = () => {
    const categories = {};
    products.forEach(product => {
      const category = product.category || product['tax:product_cat'] || 'Uncategorized';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    // Convert to array and sort by count
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Get top 5 categories
  };
  
  const categoriesData = getCategoryDistribution();
  
  // Prepare data for notifications activity chart
  const getNotificationsTimeline = () => {
    // Create an array with last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        orders: 0,
        stock: 0,
        other: 0
      });
    }
    
    // Populate with notification data
    notifications.forEach(notification => {
      const notifDate = new Date(notification.createdAt);
      const notifDateStr = notifDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Find the matching day
      const dayEntry = days.find(day => day.date === notifDateStr);
      if (dayEntry) {
        if (notification.type === 'order_placed' || notification.type === 'order_status_change') {
          dayEntry.orders += 1;
        } else if (notification.type === 'out_of_stock' || notification.type === 'low_stock') {
          dayEntry.stock += 1;
        } else {
          dayEntry.other += 1;
        }
      }
    });
    
    return days;
  };
  
  const notificationsTimelineData = getNotificationsTimeline();
  
  // Stats cards data
  const statsData = [
    { 
      title: 'Total Products', 
      value: totalProducts.toString(), 
      icon: <ShoppingBagIcon className="h-6 w-6 text-[#c0a483]" />, 
      link: '/admin/dashboard/products',
      linkText: 'Manage Products'
    },
    { 
      title: 'Low Stock Items', 
      value: lowStockProducts.toString(), 
      icon: <ExclamationCircleIcon className="h-6 w-6 text-yellow-500" />, 
      link: '/admin/dashboard/products',
      linkText: 'View Low Stock'
    },
    { 
      title: 'Out of Stock', 
      value: outOfStockProducts.toString(), 
      icon: <ExclamationCircleIcon className="h-6 w-6 text-red-600" />, 
      link: '/admin/dashboard/products',
      linkText: 'Restock Products'
    },
    { 
      title: 'Special Products', 
      value: specialProducts.toString(), 
      icon: <TagIcon className="h-6 w-6 text-[#c0a483]" />, 
      link: '/admin/dashboard/products',
      linkText: 'View Special Products'
    }
  ];
  
  // Get notification icon based on type
  const getNotificationIcon = (type, status) => {
    if (type === 'order_placed') {
      return <ShoppingBagIcon className="h-4 w-4 text-indigo-600" />;
    }
    
    if (type === 'out_of_stock') {
      return <ExclamationCircleIcon className="h-4 w-4 text-red-600" />;
    }
    
    if (type === 'low_stock') {
      return <ExclamationCircleIcon className="h-4 w-4 text-yellow-500" />;
    }
    
    if (type === 'order_status_change') {
      switch (status) {
        case 'pending to be confirmed':
          return <ClockIcon className="h-4 w-4 text-yellow-500" />;
        case 'confirmed':
          return <CheckCircleIcon className="h-4 w-4 text-blue-500" />;
        case 'processing':
          return <ShoppingBagIcon className="h-4 w-4 text-purple-500" />;
        case 'shipped':
          return <TruckIcon className="h-4 w-4 text-indigo-500" />;
        case 'delivered':
          return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
        case 'cancelled':
          return <ExclamationCircleIcon className="h-4 w-4 text-red-500" />;
        default:
          return <BellIcon className="h-4 w-4 text-gray-500" />;
      }
    }
    
    return <BellIcon className="h-4 w-4 text-gray-500" />;
  };
  
  // Custom Recharts tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium text-sm">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 font-serif">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1 font-serif">
          View and manage your store's inventory, orders, and notifications.
        </p>
      </div>
      
      {/* Error Message */}
      {error && (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex items-center">
          <div className="flex-shrink-0 text-red-500">
              <ExclamationCircleIcon className="h-5 w-5" />
          </div>
          <div className="ml-3">
              <p className="text-sm text-red-700 font-serif">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div key={index} className="stats-card bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-black/5 p-3 rounded-lg">
                {stat.icon}
              </div>
              <div className="text-right">
                <Link to={stat.link} className="text-xs text-[#c0a483] hover:underline font-serif animated-link">
                  {stat.linkText}
                </Link>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="mt-2 text-sm text-gray-600 font-serif">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Content Sections - 3 columns on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Low Stock Products */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full transition-all duration-300 hover:shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 font-serif flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 mr-2" />
              Low Stock Products
            </h2>
            
            {lowStockProducts.length === 0 ? (
              <div className="bg-green-50 p-4 rounded-md text-green-700 font-serif">
                <p className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  All products have sufficient stock levels.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto responsive-table">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Stock</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {lowStockProducts.map((product, index) => (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 flex-shrink-0 mr-3">
                              <img 
                                src={product.image_url} 
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded-md border border-gray-200" 
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {product.stock || product.stock_quantity || 0} left
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Link
                            to="/admin/dashboard/products"
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-[#c0a483] bg-[#f8f5f0] hover:bg-[#f0e9df] transition-colors duration-150"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Recent Notifications */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full transition-all duration-300 hover:shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 font-serif flex items-center">
              <BellIcon className="h-5 w-5 text-[#c0a483] mr-2" />
              Recent Notifications
            </h2>
            
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="bg-blue-50 p-4 rounded-md text-blue-700 font-serif">
                  <p>No new notifications.</p>
                </div>
              ) : (
                notifications.slice(0, 5).map((notification) => (
                  <div 
                    key={notification._id}
                    className={`notification-item p-3 rounded-md transition-all duration-200 ${
                      !notification.isRead ? 'notification-unread' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                        <p className="text-xs text-gray-500">{formatTimeAgo(notification.createdAt)}</p>
          </div>
        </div>
      </div>
                ))
              )}
              
              <div className="mt-4 pt-3 border-t border-gray-200">
                <Link
                  to="/admin/dashboard/notifications"
                  className="text-sm text-[#c0a483] hover:text-black flex items-center font-serif animated-link"
                >
                  <span>View all notifications</span>
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
          </div>
          
      {/* Bottom Sections - 2 columns on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 font-serif">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/admin/dashboard/products"
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:-translate-y-1 hover:shadow-sm"
            >
              <ShoppingBagIcon className="h-8 w-8 text-[#c0a483] mb-2" />
              <span className="text-sm font-medium text-gray-700 font-serif">Add Product</span>
            </Link>
            
            <Link
              to="/admin/dashboard/orders"
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:-translate-y-1 hover:shadow-sm"
            >
              <ShoppingBagIcon className="h-8 w-8 text-[#c0a483] mb-2" />
              <span className="text-sm font-medium text-gray-700 font-serif">View Orders</span>
            </Link>
            
            <Link
              to="/admin/dashboard/discount-codes"
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:-translate-y-1 hover:shadow-sm"
            >
              <TicketIcon className="h-8 w-8 text-[#c0a483] mb-2" />
              <span className="text-sm font-medium text-gray-700 font-serif">Discount Codes</span>
            </Link>
            
            <Link
              to="/admin/dashboard/excel"
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:-translate-y-1 hover:shadow-sm"
            >
              <CurrencyDollarIcon className="h-8 w-8 text-[#c0a483] mb-2" />
              <span className="text-sm font-medium text-gray-700 font-serif">Excel Manager</span>
            </Link>
          </div>
        </div>
        
        {/* System Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 font-serif">System Status</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 font-serif">Products Database</div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 font-serif">
                Active
              </span>
          </div>
          
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 font-serif">Orders System</div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 font-serif">
                Active
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 font-serif">Stock Monitoring</div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 font-serif">
                Active
              </span>
        </div>
        
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 font-serif">Notification System</div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 font-serif">
                Active
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 font-serif">Excel Integration</div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 font-serif">
                Active
              </span>
                </div>
              </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500 font-serif">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome; 