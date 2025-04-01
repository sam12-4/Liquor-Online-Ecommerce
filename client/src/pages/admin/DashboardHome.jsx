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
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-black/5 p-3 rounded-lg">
                {stat.icon}
              </div>
              <div className="text-right">
                <Link to={stat.link} className="text-xs text-[#c0a483] hover:underline font-serif">
                  {stat.linkText}
                </Link>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="mt-2 text-sm text-gray-600 font-serif">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 font-serif">Inventory Status</h2>
          {loading ? (
            <div className="py-4 text-center h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c0a483] mx-auto"></div>
              <p className="ml-2 text-sm text-gray-500 font-serif">Loading chart data...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stockData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stockData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-3 gap-2 mt-4 w-full">
                {stockData.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-xs text-gray-600 font-serif">{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Category Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 font-serif">Top Product Categories</h2>
          {loading ? (
            <div className="py-4 text-center h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c0a483] mx-auto"></div>
              <p className="ml-2 text-sm text-gray-500 font-serif">Loading chart data...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={categoriesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#c0a483" name="Products" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 gap-6">
        {/* Notification Activity Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 font-serif">Notification Activity (Last 7 Days)</h2>
          {loading ? (
            <div className="py-4 text-center h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c0a483] mx-auto"></div>
              <p className="ml-2 text-sm text-gray-500 font-serif">Loading chart data...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={notificationsTimelineData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#c0a483" name="Order Notifications" />
                <Line type="monotone" dataKey="stock" stroke="#ef4444" name="Stock Alerts" />
                <Line type="monotone" dataKey="other" stroke="#6b7280" name="Other Notifications" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 font-serif">Low Stock Products</h2>
            <Link to="/admin/dashboard/products" className="text-sm text-[#c0a483] hover:underline font-serif">
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="py-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c0a483] mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500 font-serif">Loading products...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-serif">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-serif">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-serif">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products
                    .filter(p => {
                      const stock = parseInt(p.stock || p.stock_quantity || 0);
                      return stock > 0 && stock < 5;
                    })
                    .slice(0, 5)
                    .map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {product.image && (
                              <div className="h-10 w-10 flex-shrink-0 mr-3">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={product.image || product.images}
                                  alt={product.name || product.post_title}
                                />
                              </div>
                            )}
                            <div className="text-sm font-medium text-gray-900 font-serif">
                              {product.name || product.post_title}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-serif">
                            {product.stock || product.stock_quantity}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 font-serif">
                            Low Stock
                          </span>
                        </td>
                      </tr>
                    ))}
                  {products.filter(p => {
                    const stock = parseInt(p.stock || p.stock_quantity || 0);
                    return stock > 0 && stock < 5;
                  }).length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500 font-serif">
                        No low stock products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Recent Notifications */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 font-serif">Recent Notifications</h2>
            <Link to="/admin/dashboard/notifications" className="text-sm text-[#c0a483] hover:underline font-serif">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {notifications.slice(0, 5).map((notification, index) => (
              <Link 
                key={index} 
                to={`/admin/dashboard/notifications/${notification._id}`}
                className="block p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type, notification.orderStatus)}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900 font-serif">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#c0a483] text-white font-serif">
                          New
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600 truncate font-serif">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 font-serif">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            {notifications.length === 0 && (
              <div className="text-center py-4 text-sm text-gray-500 font-serif">
                No notifications found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notification Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 font-serif">Notification Summary</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BellIcon className="h-5 w-5 text-[#c0a483] mr-2" />
                <span className="text-sm text-gray-600 font-serif">All Notifications</span>
              </div>
              <span className="font-medium font-serif">{notifications.length}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BellIcon className="h-5 w-5 text-[#c0a483] mr-2" />
                <span className="text-sm text-gray-600 font-serif">Unread</span>
              </div>
              <span className="font-medium font-serif">{unreadNotifications}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ExclamationCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm text-gray-600 font-serif">Stock Alerts</span>
              </div>
              <span className="font-medium font-serif">{stockNotifications}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingBagIcon className="h-5 w-5 text-[#c0a483] mr-2" />
                <span className="text-sm text-gray-600 font-serif">Order Updates</span>
              </div>
              <span className="font-medium font-serif">
                {notifications.filter(n => 
                  n.type === 'order_placed' || n.type === 'order_status_change'
                ).length}
              </span>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link 
              to="/admin/dashboard/notifications" 
              className="text-[#c0a483] hover:text-black text-sm font-medium font-serif uppercase"
            >
              View All Notifications
            </Link>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 font-serif">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/admin/dashboard/products"
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <ShoppingBagIcon className="h-8 w-8 text-[#c0a483] mb-2" />
              <span className="text-sm font-medium text-gray-700 font-serif">Add Product</span>
            </Link>
            
            <Link
              to="/admin/dashboard/orders"
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <ShoppingBagIcon className="h-8 w-8 text-[#c0a483] mb-2" />
              <span className="text-sm font-medium text-gray-700 font-serif">View Orders</span>
            </Link>
            
            <Link
              to="/admin/dashboard/discount-codes"
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <TicketIcon className="h-8 w-8 text-[#c0a483] mb-2" />
              <span className="text-sm font-medium text-gray-700 font-serif">Discount Codes</span>
            </Link>
            
            <Link
              to="/admin/dashboard/excel"
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <CurrencyDollarIcon className="h-8 w-8 text-[#c0a483] mb-2" />
              <span className="text-sm font-medium text-gray-700 font-serif">Excel Manager</span>
            </Link>
          </div>
        </div>
        
        {/* System Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600 flex justify-between font-serif">
              <span>Last System Update:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome; 