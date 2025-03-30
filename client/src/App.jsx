import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Remove direct ToastContainer import
// import { ToastContainer, Slide } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './styles/toast-fixes.css';

// Import our custom toast portal component
import ToastPortal from './components/common/ToastPortal';

// Context Providers
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProductProvider } from './context/ProductContext';
import { TaxonomyProvider } from './context/TaxonomyContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { UserAuthProvider } from './contexts/UserAuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AdminNotificationProvider } from './contexts/AdminNotificationContext';

// Components
import Layout from './components/layout/Layout';
import Loader from './components/common/Loader';
import ScrollToTop from './components/common/ScrollToTop';
import ProductPage from './pages/ProductPage';
import PageWrapper from './components/common/PageWrapper';
import ProtectedCustomerRoute from './components/common/ProtectedCustomerRoute';
import ProtectedAdminRoute from './components/common/ProtectedAdminRoute';

// Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const ThankYouPage = lazy(() => import('./pages/ThankYouPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const MyAccountPage = lazy(() => import('./pages/MyAccountPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const DashboardHome = lazy(() => import('./pages/admin/DashboardHome'));
const ProductsManagement = lazy(() => import('./pages/admin/ProductsManagement'));
const ExcelManagement = lazy(() => import('./pages/admin/ExcelManagement'));
const CategoriesPage = lazy(() => import('./pages/admin/CategoriesPage'));
const BrandsPage = lazy(() => import('./pages/admin/BrandsPage'));
const CountriesPage = lazy(() => import('./pages/admin/CountriesPage'));
const VarietalsPage = lazy(() => import('./pages/admin/VarietalsPage'));
const TypesPage = lazy(() => import('./pages/admin/TypesPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ExcelDemoPage = lazy(() => import('./pages/ExcelDemoPage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const ContactFaqPage = lazy(() => import('./pages/ContactFaqPage'));
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage'));
const ReturnsRefundsPage = lazy(() => import('./pages/ReturnsRefundsPage'));
const ShippingDeliveryPage = lazy(() => import('./pages/ShippingDeliveryPage'));
const FinancePage = lazy(() => import('./pages/FinancePage'));
const SpecialOrdersPage = lazy(() => import('./pages/SpecialOrdersPage'));
const PrivateCommercialPage = lazy(() => import('./pages/PrivateCommercialPage'));
const FreeDrawPage = lazy(() => import('./pages/FreeDrawPage'));
const BackupsManagement = lazy(() => import('./pages/admin/BackupsManagement'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const NotificationDetailPage = lazy(() => import('./pages/NotificationDetailPage'));
const AdminNotificationsPage = lazy(() => import('./pages/admin/AdminNotificationsPage'));
const AdminNotificationDetailPage = lazy(() => import('./pages/admin/AdminNotificationDetailPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminOrderDetailPage = lazy(() => import('./pages/admin/AdminOrderDetailPage'));

// HOC to wrap pages with animation
const withPageAnimation = (Component) => (props) => (
  <PageWrapper>
    <Component {...props} />
  </PageWrapper>
);

// Apply animation wrapper to all pages
const AnimatedHomePage = withPageAnimation(HomePage);
const AnimatedProductsPage = withPageAnimation(ProductsPage);
const AnimatedProductDetailPage = withPageAnimation(ProductDetailPage);
const AnimatedCartPage = withPageAnimation(CartPage);
const AnimatedCheckoutPage = withPageAnimation(CheckoutPage);
const AnimatedThankYouPage = withPageAnimation(ThankYouPage);
const AnimatedAccountPage = withPageAnimation(AccountPage);
const AnimatedMyAccountPage = withPageAnimation(MyAccountPage);
const AnimatedWishlistPage = withPageAnimation(WishlistPage);
const AnimatedAboutPage = withPageAnimation(AboutPage);
const AnimatedContactPage = withPageAnimation(ContactPage);
const AnimatedNotFoundPage = withPageAnimation(NotFoundPage);
const AnimatedShopPage = withPageAnimation(ShopPage);
const AnimatedLoginPage = withPageAnimation(LoginPage);
const AnimatedRegisterPage = withPageAnimation(RegisterPage);
const AnimatedAdminLoginPage = withPageAnimation(AdminLoginPage);
const AnimatedFavoritesPage = withPageAnimation(FavoritesPage);
const AnimatedProfilePage = withPageAnimation(ProfilePage);
const AnimatedExcelDemoPage = withPageAnimation(ExcelDemoPage);
const AnimatedSearchResultsPage = withPageAnimation(SearchResultsPage);
const AnimatedContactFaqPage = withPageAnimation(ContactFaqPage);
const AnimatedTrackOrderPage = withPageAnimation(TrackOrderPage);
const AnimatedReturnsRefundsPage = withPageAnimation(ReturnsRefundsPage);
const AnimatedShippingDeliveryPage = withPageAnimation(ShippingDeliveryPage);
const AnimatedFinancePage = withPageAnimation(FinancePage);
const AnimatedProductPage = withPageAnimation(ProductPage);
const AnimatedSpecialOrdersPage = withPageAnimation(SpecialOrdersPage);
const AnimatedPrivateCommercialPage = withPageAnimation(PrivateCommercialPage);
const AnimatedFreeDrawPage = withPageAnimation(FreeDrawPage);
const AnimatedBackupsManagement = withPageAnimation(BackupsManagement);
const AnimatedNotificationsPage = withPageAnimation(NotificationsPage);
const AnimatedNotificationDetailPage = withPageAnimation(NotificationDetailPage);
const AnimatedAdminNotificationsPage = withPageAnimation(AdminNotificationsPage);
const AnimatedAdminNotificationDetailPage = withPageAnimation(AdminNotificationDetailPage);
const AnimatedAdminOrdersPage = withPageAnimation(AdminOrdersPage);
const AnimatedAdminOrderDetailPage = withPageAnimation(AdminOrderDetailPage);

// Admin routes with authentication context
const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<AdminDashboard />}>
      <Route index element={<DashboardHome />} />
      <Route path="products" element={<ProductsManagement />} />
      <Route path="excel" element={<ExcelManagement />} />
      <Route path="backups" element={<AnimatedBackupsManagement />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="brands" element={<BrandsPage />} />
      <Route path="countries" element={<CountriesPage />} />
      <Route path="varietals" element={<VarietalsPage />} />
      <Route path="types" element={<TypesPage />} />
      <Route path="notifications" element={<AnimatedAdminNotificationsPage />} />
      <Route path="notifications/:id" element={<AnimatedAdminNotificationDetailPage />} />
      <Route path="orders" element={<AnimatedAdminOrdersPage />} />
      <Route path="orders/:orderId" element={<AnimatedAdminOrderDetailPage />} />
    </Route>
  </Routes>
);

function App() {
  return (
    <>
      {/* Use our custom toast portal */}
      <ToastPortal />
      
      <Router>
        <div className="font-sans text-gray-800">
          <AdminAuthProvider>
            <UserAuthProvider>
              <NotificationProvider>
                <AdminNotificationProvider>
                  <ProductProvider>
                    <TaxonomyProvider>
                      <CartProvider>
                        <WishlistProvider>
                          <ScrollToTop />
                          <Suspense fallback={<Loader />}>
                            <Layout>
                              <Routes>
                                <Route path="/" element={<AnimatedHomePage />} />
                                <Route path="/products" element={<AnimatedProductsPage />} />
                                <Route path="/product/:id" element={<AnimatedProductPage />} />
                                <Route path="/cart" element={<AnimatedCartPage />} />
                                <Route path="/checkout" element={<AnimatedCheckoutPage />} />
                                <Route path="/thank-you" element={<AnimatedThankYouPage />} />
                                <Route path="/account" element={<AnimatedAccountPage />} />
                                
                                {/* Protected customer route - admins cannot access */}
                                <Route 
                                  path="/my-account" 
                                  element={<ProtectedCustomerRoute element={<AnimatedMyAccountPage />} />}
                                />
                                
                                <Route path="/wishlist" element={<AnimatedWishlistPage />} />
                                <Route path="/about" element={<AnimatedAboutPage />} />
                                <Route path="/contact" element={<AnimatedContactPage />} />
                                <Route path="/shop" element={<AnimatedShopPage />} />
                                <Route path="/login" element={<AnimatedLoginPage />} />
                                <Route path="/register" element={<AnimatedRegisterPage />} />
                                
                                {/* Admin Routes */}
                                <Route path="/admin" element={<AnimatedAdminLoginPage />} />
                                <Route path="/admin/dashboard/*" element={<ProtectedAdminRoute element={<AdminRoutes />} />} />
                                
                                <Route path="/favorites" element={<AnimatedFavoritesPage />} />
                                <Route path="/profile" element={<AnimatedProfilePage />} />
                                <Route path="/excel-demo" element={<AnimatedExcelDemoPage />} />
                                <Route path="/search" element={<AnimatedSearchResultsPage />} />
                                <Route path="/contact-faq" element={<AnimatedContactFaqPage />} />
                                <Route path="/track-order" element={<AnimatedTrackOrderPage />} />
                                <Route path="/notifications" element={<AnimatedNotificationsPage />} />
                                <Route path="/notifications/:id" element={<AnimatedNotificationDetailPage />} />
                                <Route path="/returns-refunds" element={<AnimatedReturnsRefundsPage />} />
                                <Route path="/shipping-delivery" element={<AnimatedShippingDeliveryPage />} />
                                <Route path="/finance" element={<AnimatedFinancePage />} />
                                <Route path="/special-orders" element={<AnimatedSpecialOrdersPage />} />
                                <Route path="/private-commercial" element={<AnimatedPrivateCommercialPage />} />
                                <Route path="/free-draw" element={<AnimatedFreeDrawPage />} />
                                <Route path="*" element={<AnimatedNotFoundPage />} />
                              </Routes>
                            </Layout>
                          </Suspense>
                        </WishlistProvider>
                      </CartProvider>
                    </TaxonomyProvider>
                  </ProductProvider>
                </AdminNotificationProvider>
              </NotificationProvider>
            </UserAuthProvider>
          </AdminAuthProvider>
        </div>
      </Router>
    </>
  );
}

export default App;
