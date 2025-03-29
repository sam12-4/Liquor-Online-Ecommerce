import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  ChartBarIcon, 
  ShoppingBagIcon, 
  TagIcon, 
  CircleStackIcon, 
  ClipboardDocumentListIcon, 
  ShoppingCartIcon, 
  ClockIcon, 
  UsersIcon, 
  Cog6ToothIcon, 
  UserIcon, 
  ArrowLeftOnRectangleIcon,
  ArchiveBoxIcon,
  DocumentTextIcon,
  TicketIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState('dashboard');

  useEffect(() => {
    document.title = 'Admin Dashboard - Liquor Online';
    
    // Set active menu based on current path
    const path = location.pathname.split('/').pop();
    setActiveMenu(path || 'dashboard');
    
    // Check if admin is logged in (in a real app, this would check a token or session)
    const checkAdminAuth = () => {
      // For now, we're just simulating authentication
      // In a real app, you would check for a valid auth token
      const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
      if (!isLoggedIn) {
        navigate('/admin');
      }
    };
    
    checkAdminAuth();
  }, [location, navigate]);

  // Mock function to handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    navigate('/admin');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-[#212529] text-white flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-gray-700">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-amber-500">🥃 Lorkon</span>
          </Link>
        </div>
        
        {/* Menu Categories */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-4">
            <p className="px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">GENERAL</p>
            <NavItem 
              to="/admin/dashboard" 
              icon={<ChartBarIcon className="h-5 w-5" />} 
              label="Dashboard" 
              active={activeMenu === 'dashboard'} 
            />
            <NavItem 
              to="/admin/dashboard/products" 
              icon={<ShoppingBagIcon className="h-5 w-5" />} 
              label="Products" 
              active={activeMenu === 'products'} 
            />
            <NavItem 
              to="/admin/dashboard/category" 
              icon={<TagIcon className="h-5 w-5" />} 
              label="Category" 
              active={activeMenu === 'category'} 
            />
            <NavItem 
              to="/admin/dashboard/inventory" 
              icon={<CircleStackIcon className="h-5 w-5" />} 
              label="Inventory" 
              active={activeMenu === 'inventory'} 
            />
            <NavItem 
              to="/admin/dashboard/excel" 
              icon={<TableCellsIcon className="h-5 w-5" />} 
              label="Excel Manager" 
              active={activeMenu === 'excel'} 
            />
            <NavItem 
              to="/admin/dashboard/orders" 
              icon={<ClipboardDocumentListIcon className="h-5 w-5" />} 
              label="Orders" 
              active={activeMenu === 'orders'} 
            />
            <NavItem 
              to="/admin/dashboard/purchases" 
              icon={<ShoppingCartIcon className="h-5 w-5" />} 
              label="Purchases" 
              active={activeMenu === 'purchases'} 
            />
            <NavItem 
              to="/admin/dashboard/attributes" 
              icon={<ClockIcon className="h-5 w-5" />} 
              label="Attributes" 
              active={activeMenu === 'attributes'} 
            />
            <NavItem 
              to="/admin/dashboard/invoices" 
              icon={<DocumentTextIcon className="h-5 w-5" />} 
              label="Invoices" 
              active={activeMenu === 'invoices'} 
            />
            <NavItem 
              to="/admin/dashboard/settings" 
              icon={<Cog6ToothIcon className="h-5 w-5" />} 
              label="Settings" 
              active={activeMenu === 'settings'} 
            />
          </div>
          
          <div className="py-4">
            <p className="px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">USERS</p>
            <NavItem 
              to="/admin/dashboard/profile" 
              icon={<UserIcon className="h-5 w-5" />} 
              label="Profile" 
              active={activeMenu === 'profile'} 
            />
            <NavItem 
              to="/admin/dashboard/roles" 
              icon={<UsersIcon className="h-5 w-5" />} 
              label="Roles" 
              active={activeMenu === 'roles'} 
            />
            <NavItem 
              to="/admin/dashboard/customers" 
              icon={<UsersIcon className="h-5 w-5" />} 
              label="Customers" 
              active={activeMenu === 'customers'} 
            />
            <NavItem 
              to="/admin/dashboard/sellers" 
              icon={<UsersIcon className="h-5 w-5" />} 
              label="Sellers" 
              active={activeMenu === 'sellers'} 
            />
          </div>
          
          <div className="py-4">
            <p className="px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">OTHER</p>
            <NavItem 
              to="/admin/dashboard/coupons" 
              icon={<TicketIcon className="h-5 w-5" />} 
              label="Coupons" 
              active={activeMenu === 'coupons'} 
            />
            <NavItem 
              to="/admin/dashboard/reports" 
              icon={<ArchiveBoxIcon className="h-5 w-5" />} 
              label="Reports" 
              active={activeMenu === 'reports'} 
            />
          </div>
        </div>
        
        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-300 hover:text-white w-full px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Welcome!</h1>
            <div className="flex items-center space-x-4">
              <button className="relative text-gray-500 hover:text-gray-700">
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  2
                </span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                A
              </div>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Navigation Item Component
const NavItem = ({ to, icon, label, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-5 py-3 transition-colors ${
        active 
          ? 'bg-gray-700 text-white' 
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default AdminDashboard; 