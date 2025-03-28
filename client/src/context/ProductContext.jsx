import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProducts, loadProductsFromExcel } from '../data/productLoader';

// API URL for direct fetching
const API_URL = 'http://localhost:5000/api';

// Create the context
const ProductContext = createContext();

// Custom hook to use the context
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  
  // Load products initially
  useEffect(() => {
    loadAllProducts();
  }, []);
  
  // Function to load/reload products
  const loadAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const loadedProducts = await getProducts();
      setProducts(loadedProducts);
      setError(null);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Function to refresh products after CRUD operations
  const refreshProducts = useCallback(async (forceRefresh = false) => {
    try {
      // Check if we've refreshed in the last 2 seconds to prevent rapid re-renders
      const now = Date.now();
      if (!forceRefresh && (now - lastRefreshTime < 2000)) {
        console.log('ProductContext: Refresh skipped, too soon since last refresh');
        return true;
      }
      
      console.log('ProductContext: Refreshing products list...');
      setLoading(true);
      setLastRefreshTime(now);
      
      // Force a new network request by passing a timestamp to avoid caching
      const timestamp = now;
      const freshProductsURL = `${API_URL}/products?t=${timestamp}`;
      
      // Use a direct fetch with cache busting instead of getProducts
      const response = await fetch(freshProductsURL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      
      const loadedProducts = await response.json();
      console.log(`ProductContext: Refreshed ${loadedProducts.length} products`);
      
      // Update state with the fresh products
      setProducts(loadedProducts);
      setError(null);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('ProductContext: Error refreshing products:', err);
      setError('Failed to refresh products');
      setLoading(false);
      return false;
    }
  }, [lastRefreshTime]);
  
  // Value object to be provided to consuming components
  const value = {
    products,
    loading,
    error,
    refreshProducts,
    loadAllProducts
  };
  
  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext; 