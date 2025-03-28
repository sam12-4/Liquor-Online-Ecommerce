import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import ChatWidget from './ChatWidget';
import ScrollToTop from './ScrollToTop';

const Layout = ({ children }) => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Add meta viewport tag for responsiveness
  useEffect(() => {
    // Check if viewport meta tag exists, if not add it
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(viewportMeta);
    } else {
      // Update it to ensure proper responsive behavior
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <NavBar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
      <ChatWidget />
    </div>
  );
};

export default Layout;
