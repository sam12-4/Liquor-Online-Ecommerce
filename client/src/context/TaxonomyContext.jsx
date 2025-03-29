import { createContext, useContext, useState, useEffect } from 'react';
import { getTaxonomyData } from '../data/productLoader';

// Create the context
const TaxonomyContext = createContext();

// Custom hook for using the taxonomy context
export const useTaxonomy = () => useContext(TaxonomyContext);

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

// Provider component
export const TaxonomyProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [countries, setCountries] = useState([]);
  const [varietals, setVarietals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Function to load all taxonomy data
  const loadAllTaxonomies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load all taxonomies in parallel
      const [
        categoriesData,
        brandsData,
        countriesData,
        varietalsData
      ] = await Promise.all([
        getTaxonomyData('categories'),
        getTaxonomyData('brands'),
        getTaxonomyData('countries'),
        getTaxonomyData('varietals')
      ]);
      
      // Deduplicate and sort all arrays alphabetically
      setCategories(removeDuplicates(categoriesData).sort((a, b) => a.localeCompare(b)));
      setBrands(removeDuplicates(brandsData).sort((a, b) => a.localeCompare(b)));
      setCountries(removeDuplicates(countriesData).sort((a, b) => a.localeCompare(b)));
      setVarietals(removeDuplicates(varietalsData).sort((a, b) => a.localeCompare(b)));
      
      // Update last updated timestamp
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading taxonomy data:', err);
      setError(err.message || 'Failed to load taxonomy data');
    } finally {
      setLoading(false);
    }
  };

  // Load taxonomy data on mount
  useEffect(() => {
    loadAllTaxonomies();
  }, []);

  // Value to be provided by the context
  const value = {
    categories,
    brands,
    countries,
    varietals,
    loading,
    error,
    lastUpdated,
    refreshTaxonomies: loadAllTaxonomies
  };

  return (
    <TaxonomyContext.Provider value={value}>
      {children}
    </TaxonomyContext.Provider>
  );
};

export default TaxonomyContext; 