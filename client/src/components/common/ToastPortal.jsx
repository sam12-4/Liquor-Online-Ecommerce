import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/toast-fixes.css';

const ToastPortal = () => {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    // Create a div element for the portal
    let element = document.getElementById('toast-portal-root');
    let systemCreated = false;

    // If the element doesn't exist, create it
    if (!element) {
      systemCreated = true;
      element = document.createElement('div');
      element.id = 'toast-portal-root';
      document.body.appendChild(element);
    }

    // Set the portal element
    setPortalElement(element);

    // Clean up the portal element if we created it
    return () => {
      if (systemCreated && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, []);

  // Only render the ToastContainer once we have the portal element
  if (!portalElement) return null;

  // Render the ToastContainer in the portal
  return createPortal(
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Slide}
      limit={3}
      className="toast-container-custom"
      toastClassName="toast-custom"
      bodyClassName="toast-body-custom"
      style={{ zIndex: 999999 }}
      enableMultiContainer={false}
    />,
    portalElement
  );
};

export default ToastPortal; 