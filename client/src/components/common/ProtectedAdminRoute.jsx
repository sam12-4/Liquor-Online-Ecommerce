import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useUserAuth } from '../../contexts/UserAuthContext';

// This component ensures only admins can access admin routes
const ProtectedAdminRoute = ({ element }) => {
  const { isAuthenticated: isAdminAuthenticated, loading: adminLoading } = useAdminAuth();
  const { isAuthenticated: isUserAuthenticated } = useUserAuth();

  // Show loading if authentication is being checked
  if (adminLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-3 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // If admin is not authenticated or a regular user is authenticated, redirect to login
  if (!isAdminAuthenticated || isUserAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  // If admin is authenticated, render the protected component
  return element;
};

export default ProtectedAdminRoute; 