import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  UsersIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  CurrencyDollarIcon,
  TagIcon 
} from '@heroicons/react/24/outline';
import { useProducts } from '../../context/ProductContext';

const DashboardHome = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('1M');
  const { products, refreshProducts } = useProducts();
  
  // Load products when component mounts, if needed
  useEffect(() => {
    const loadData = async () => {
      try {
        // Only refresh if we don't have products yet
        if (products.length === 0) {
          await refreshProducts();
        }
      } catch (err) {
        console.error('Error loading products for dashboard:', err);
      }
    };
    
    loadData();
  }, []); // Empty dependency array to run only on mount
  
  // Calculate product statistics
  const totalProducts = products.length;
  const featuredProducts = products.filter(p => p.isFeatured === 'true' || p.isFeatured === true).length;
  const specialProducts = products.filter(p => p.isSpecial === 'true' || p.isSpecial === true).length;
  const trendingProducts = products.filter(p => p.isTrending === 'true' || p.isTrending === true).length;
  
  // Mock data for the dashboard
  const statsData = [
    { 
      title: 'Total Products', 
      value: totalProducts.toString(), 
      icon: <ShoppingBagIcon className="h-6 w-6 text-orange-400" />, 
      change: 3.5, 
      period: 'Last Week' 
    },
    { 
      title: 'Featured Products', 
      value: featuredProducts.toString(), 
      icon: <UsersIcon className="h-6 w-6 text-orange-400" />, 
      change: 8.1, 
      period: 'Last Month' 
    },
    { 
      title: 'Special Offers', 
      value: specialProducts.toString(), 
      icon: <TagIcon className="h-6 w-6 text-orange-400" />, 
      change: -0.5, 
      period: 'Last Month' 
    },
    { 
      title: 'Trending Items', 
      value: trendingProducts.toString(), 
      icon: <CurrencyDollarIcon className="h-6 w-6 text-orange-400" />, 
      change: -10.5, 
      period: 'Last Month' 
    }
  ];
  
  // Mock data for chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Mock data for locations
  const locations = [
    { name: 'Canada', percentage: 28 },
    { name: 'United States', percentage: 36 },
    { name: 'China', percentage: 14 },
    { name: 'Brazil', percentage: 12 },
    { name: 'Others', percentage: 10 }
  ];
  
  // Mock data for top pages
  const topPages = [
    { path: 'lorkon/ecommerce/home', views: 489, exitRate: 3.4 },
    { path: 'lorkon/dashboard/home', views: 426, exitRate: 5.8 },
    { path: 'lorkon/chat.html', views: 294, exitRate: 10.2 },
    { path: 'lorkon/auth/login.html', views: 359, exitRate: 3.2 },
    { path: 'lorkon/email.html', views: 985, exitRate: 41.2 },
    { path: 'lorkon/social.html', views: 653, exitRate: 2.6 },
    { path: 'lorkon/blog.html', views: 478, exitRate: 1.4 }
  ];
  
  return (
    <div className="space-y-6">
      {/* Error Notification Banner */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex items-center">
          <div className="flex-shrink-0 text-red-500">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              We regret to inform you that our server is currently experiencing technical difficulties.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                {stat.icon}
              </div>
              <div className="text-right">
                <Link to="#" className="text-xs text-blue-600 hover:underline">View More</Link>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="mt-2 flex items-center justify-between">
              <div className={`flex items-center text-sm ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(stat.change)}%</span>
              </div>
              <div className="text-gray-500 text-sm">{stat.period}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Performance</h2>
          <div className="flex border rounded-md overflow-hidden">
            {['1D', '1W', '1M', '3M', '1Y'].map((timeframe) => (
              <button
                key={timeframe}
                className={`px-3 py-1 text-sm ${
                  activeTimeframe === timeframe
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTimeframe(timeframe)}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>
        
        {/* Chart Display - In a real app this would be a Chart.js or similar charting library */}
        <div className="h-64 flex items-end space-x-2">
          {months.map((month, index) => {
            // Generate random height for each bar
            const pageViewsHeight = 30 + Math.random() * 70;
            const clicksHeight = 10 + Math.random() * 20;
            
            return (
              <div key={month} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center space-y-1">
                  <div 
                    className="w-full bg-orange-500 rounded-t" 
                    style={{ height: `${pageViewsHeight}px` }}
                  ></div>
                  <div 
                    className="w-full bg-teal-500 rounded-t" 
                    style={{ height: `${clicksHeight}px` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-2">{month}</div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center mt-4 space-x-8">
          <div className="flex items-center">
            <div className="h-3 w-3 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-xs text-gray-600">Page Views</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-teal-500 rounded-full mr-2"></div>
            <span className="text-xs text-gray-600">Clicks</span>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Conversions</h2>
          
          {/* Circular progress indicator - in a real app use a proper chart library */}
          <div className="flex justify-center my-6">
            <div className="relative h-40 w-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#f0f0f0" 
                  strokeWidth="10" 
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#f97316" 
                  strokeWidth="10" 
                  strokeDasharray="251.2" 
                  strokeDashoffset="88" 
                  transform="rotate(-90 50 50)" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">65.2%</span>
              </div>
            </div>
          </div>
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">Returning Customer</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <div className="text-lg font-bold">23.5k</div>
              <div className="text-xs text-gray-500">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">41.05k</div>
              <div className="text-xs text-gray-500">Last Week</div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link to="#" className="text-xs text-blue-600 hover:underline">View Details</Link>
          </div>
        </div>
        
        {/* Sessions by Country */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sessions by Country</h2>
          
          {/* World Map - Simplified for this example */}
          <div className="h-40 w-full bg-gray-100 rounded-md mb-6 flex items-center justify-center">
            <img 
              src="https://placehold.co/300x150/e0e0e0/cccccc?text=World+Map" 
              alt="World Map" 
              className="max-h-full" 
            />
          </div>
          
          <div className="space-y-3">
            {locations.map((location, index) => (
              <div key={index} className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm text-gray-600 flex-1">{location.name}</span>
                <span className="text-sm font-medium">{location.percentage}%</span>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center">
              <div className="text-lg font-bold">23.5k</div>
              <div className="text-xs text-gray-500">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">41.05k</div>
              <div className="text-xs text-gray-500">Last Week</div>
            </div>
          </div>
        </div>
        
        {/* Top Pages */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Top Pages</h2>
            <Link to="#" className="text-xs text-orange-500 hover:underline">View all</Link>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 text-xs font-medium text-gray-500 pb-2 border-b">
              <div>Page Path</div>
              <div className="text-center">Page Views</div>
              <div className="text-right">Exit Rate</div>
            </div>
            
            {topPages.map((page, index) => (
              <div key={index} className="grid grid-cols-3 text-sm">
                <div className="truncate">{page.path}</div>
                <div className="text-center">{page.views}</div>
                <div className={`text-right ${page.exitRate > 20 ? 'text-red-500' : 'text-green-500'}`}>
                  {page.exitRate}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome; 