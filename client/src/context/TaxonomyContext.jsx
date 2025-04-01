import { createContext, useContext, useState, useEffect } from 'react';
import { getTaxonomyData } from '../data/productLoader';

// Create the context
const TaxonomyContext = createContext();

// Custom hook for using the taxonomy context
export const useTaxonomy = () => useContext(TaxonomyContext);

// Enable debug logging
const DEBUG = true;

// Maximum retries for taxonomy data loading
const MAX_RETRIES = 5;
// Initial delay between retries (will increase with backoff)
const INITIAL_RETRY_DELAY = 1000;
// Maximum delay between retries
const MAX_RETRY_DELAY = 10000;

// Helper function to remove duplicates (case-insensitive)
const removeDuplicates = (array) => {
  if (!array || !Array.isArray(array)) return [];
  
  const seen = new Map();
  return array.filter(item => {
    if (!item) return false;
    
    const itemLower = item.toLowerCase().trim();
    if (seen.has(itemLower)) {
      return false;
    }
    seen.set(itemLower, true);
    return true;
  });
};

// Helper function to fetch taxonomy data with improved retry logic
const fetchTaxonomyWithRetry = async (type, retries = MAX_RETRIES, initialDelay = INITIAL_RETRY_DELAY) => {
  let lastError;
  let delay = initialDelay;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (DEBUG) console.log(`Fetching ${type} taxonomy data, attempt ${attempt + 1}`);
      const data = await getTaxonomyData(type);
      
      // Validate received data
      if (!data || !Array.isArray(data)) {
        throw new Error(`Invalid data format received for ${type}`);
      }
      
      if (DEBUG) console.log(`Received ${data.length} ${type} items`);
      return data;
    } catch (error) {
      lastError = error;
      console.error(`Error fetching ${type} on attempt ${attempt + 1}:`, error);
      
      // Wait before retrying with exponential backoff
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        // Increase delay for next attempt (exponential backoff) but cap at max delay
        delay = Math.min(delay * 1.5, MAX_RETRY_DELAY);
      }
    }
  }
  
  // Return empty array as fallback when all retries fail
  console.warn(`All ${retries} attempts to fetch ${type} failed, using empty array as fallback`);
  return [];
};

// Provider component
export const TaxonomyProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [countries, setCountries] = useState([]);
  const [varietals, setVarietals] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Function to load all taxonomy data
  const loadAllTaxonomies = async (isRetry = false) => {
    if (!isRetry) {
      setLoading(true);
    }
    setError(null);
    
    try {
      if (DEBUG) console.log('Starting taxonomy data loading...');
      
      // Load all taxonomies in parallel
      const [
        categoriesData,
        brandsData,
        countriesData,
        varietalsData,
        typesData
      ] = await Promise.all([
        fetchTaxonomyWithRetry('categories'),
        fetchTaxonomyWithRetry('brands'),
        fetchTaxonomyWithRetry('countries'),
        fetchTaxonomyWithRetry('varietals'),
        fetchTaxonomyWithRetry('types')
      ]);
      
      // Check if any of the taxonomy data is empty (possible failure case)
      const hasAnyEmptyData = [
        categoriesData.length === 0,
        brandsData.length === 0,
        countriesData.length === 0,
        varietalsData.length === 0,
        typesData.length === 0
      ].some(isEmpty => isEmpty);
      
      // If any data is empty and we haven't hit max retries, try again
      if (hasAnyEmptyData && retryCount < 3) {
        console.warn(`Some taxonomy data is empty, retrying (attempt ${retryCount + 1})...`);
        setRetryCount(prevCount => prevCount + 1);
        
        // Wait a bit longer for the next retry
        setTimeout(() => loadAllTaxonomies(true), 3000);
        return;
      }
      
      // Print summary of loaded data
      if (DEBUG) {
        console.log('Taxonomy data loaded successfully:');
        console.log(`- Categories: ${categoriesData.length} items`);
        console.log(`- Brands: ${brandsData.length} items`);
        console.log(`- Countries: ${countriesData.length} items`);
        console.log(`- Varietals: ${varietalsData.length} items`);
        console.log(`- Types: ${typesData.length} items`);
      }
      
      // Deduplicate and sort all arrays alphabetically
      setCategories(removeDuplicates(categoriesData).sort((a, b) => a.localeCompare(b)));
      setBrands(removeDuplicates(brandsData).sort((a, b) => a.localeCompare(b)));
      setCountries(removeDuplicates(countriesData).sort((a, b) => a.localeCompare(b)));
      setVarietals(removeDuplicates(varietalsData).sort((a, b) => a.localeCompare(b)));
      setTypes(removeDuplicates(typesData).sort((a, b) => a.localeCompare(b)));
      
      // Reset retry count on success
      setRetryCount(0);
      
      // Update last updated timestamp
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading taxonomy data:', err);
      setError(err.message || 'Failed to load taxonomy data');
      
      // Add retry logic for complete failures
      if (retryCount < 3) {
        console.warn(`Complete taxonomy loading failure, retrying (attempt ${retryCount + 1})...`);
        setRetryCount(prevCount => prevCount + 1);
        setTimeout(() => loadAllTaxonomies(true), 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load taxonomy data on mount
  useEffect(() => {
    loadAllTaxonomies();
    
    // Set up periodic refresh (every 5 minutes)
    const refreshInterval = setInterval(() => {
      // Only refresh if not already loading
      if (!loading) {
        console.log('Performing scheduled taxonomy data refresh');
        loadAllTaxonomies();
      }
    }, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Value to be provided by the context
  const value = {
    categories,
    brands,
    countries,
    varietals,
    types,
    loading,
    error,
    lastUpdated,
    refreshTaxonomies: () => {
      // Only refresh if not already loading
      if (!loading) {
        setRetryCount(0); // Reset retry count for manual refresh
        loadAllTaxonomies();
      }
    }
  };

  return (
    <TaxonomyContext.Provider value={value}>
      {children}
    </TaxonomyContext.Provider>
  );
};

export default TaxonomyContext; 