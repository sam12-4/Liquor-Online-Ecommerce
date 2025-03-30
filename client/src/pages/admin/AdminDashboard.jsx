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
  TableCellsIcon,
  BookmarkIcon,
  GlobeAltIcon,
  BeakerIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import AdminNotificationBell from '../../components/admin/AdminNotificationBell';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, isAuthenticated, loading, logout } = useAdminAuth();
  const [activeMenu, setActiveMenu] = useState('dashboard');

  useEffect(() => {
    document.title = 'Admin Dashboard - Liquor Online';
    
    // Set active menu based on current path
    const path = location.pathname.split('/').pop();
    setActiveMenu(path || 'dashboard');
    
    // Redirect to login page if not authenticated
    if (!loading && !isAuthenticated) {
      navigate('/admin');
    }
  }, [location, navigate, loading, isAuthenticated]);

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  // Show loading if authentication is being checked
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-bold text-xl">Access Denied</p>
          <p className="mt-2 text-gray-600">Please log in to access the admin dashboard.</p>
          <button 
            onClick={() => navigate('/admin')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
              to="/admin/dashboard/excel" 
              icon={<TableCellsIcon className="h-5 w-5" />} 
              label="Excel Manager" 
              active={activeMenu === 'excel'} 
            />
            <NavItem 
              to="/admin/dashboard/backups" 
              icon={<ArchiveBoxIcon className="h-5 w-5" />} 
              label="Backup Files" 
              active={activeMenu === 'backups'} 
            />
          </div>
          
          <div className="py-4">
            <p className="px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">TAXONOMY</p>
            <NavItem 
              to="/admin/dashboard/categories" 
              icon={<TagIcon className="h-5 w-5" />} 
              label="Categories" 
              active={activeMenu === 'categories'} 
            />
            <NavItem 
              to="/admin/dashboard/brands" 
              icon={<BookmarkIcon className="h-5 w-5" />} 
              label="Brands" 
              active={activeMenu === 'brands'} 
            />
            <NavItem 
              to="/admin/dashboard/countries" 
              icon={<GlobeAltIcon className="h-5 w-5" />} 
              label="Countries" 
              active={activeMenu === 'countries'} 
            />
            <NavItem 
              to="/admin/dashboard/varietals" 
              icon={<BeakerIcon className="h-5 w-5" />} 
              label="Varietals" 
              active={activeMenu === 'varietals'} 
            />
            <NavItem 
              to="/admin/dashboard/types" 
              icon={<TagIcon className="h-5 w-5 text-blue-400" />} 
              label="Types" 
              active={activeMenu === 'types'} 
            />
          </div>
          
          <div className="py-4">
            <p className="px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">INVENTORY</p>
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
              to="/admin/dashboard/customers" 
              icon={<UsersIcon className="h-5 w-5" />} 
              label="Customers" 
              active={activeMenu === 'customers'} 
            />
          </div>
          
          <div className="py-4">
            <p className="px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">OTHER</p>
            <NavItem 
              to="/admin/dashboard/notifications" 
              icon={<BellIcon className="h-5 w-5" />} 
              label="Notifications" 
              active={activeMenu === 'notifications'} 
            />
            <NavItem 
              to="/admin/dashboard/discount-codes" 
              icon={<TicketIcon className="h-5 w-5" />} 
              label="Discount Codes" 
              active={activeMenu === 'discount-codes'} 
            />
            <NavItem 
              to="/admin/dashboard/settings" 
              icon={<Cog6ToothIcon className="h-5 w-5" />} 
              label="Settings" 
              active={activeMenu === 'settings'} 
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
            <h1 className="text-2xl font-semibold text-gray-800">Welcome, {admin?.username || 'Admin'}!</h1>
            <div className="flex items-center space-x-4">
              <AdminNotificationBell />
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                {admin?.username?.charAt(0).toUpperCase() || 'A'}
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