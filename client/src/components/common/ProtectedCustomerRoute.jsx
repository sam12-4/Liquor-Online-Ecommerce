import { Navigate } from 'react-router-dom';
import { useUserAuth } from '../../contexts/UserAuthContext';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

// This component prevents authenticated users from accessing certain routes
const ProtectedCustomerRoute = ({ element }) => {
  const { isAuthenticated: isUserAuthenticated } = useUserAuth();
  const { isAuthenticated: isAdminAuthenticated } = useAdminAuth();

  // If user is logged in or admin is logged in, redirect to home page
  if (isUserAuthenticated || isAdminAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the component (for unauthenticated users only)
  return element;
};

export default ProtectedCustomerRoute; 