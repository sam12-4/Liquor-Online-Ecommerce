import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FunnelIcon, XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { getProducts } from '../data/productLoader';
import ProductCard from '../components/product/ProductCard';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('relevance');

  // Get the search query from URL
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const loadedProducts = await getProducts();
        setAllProducts(loadedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        setAllProducts([]);
      }
    };
    
    loadProducts();
    
    if (query) {
      document.title = `Search Results for '${query}' | Liquor Online`;
    } else {
      document.title = 'Search Results | Liquor Online';
    }
  }, [query]);
  
  // Get filter options from allProducts, not from the imported products
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [countries, setCountries] = useState([]);
  
  // Update filter options when allProducts changes
  useEffect(() => {
    if (allProducts.length > 0) {
      setCategories([...new Set(allProducts.map(product => product.category))]);
      setTypes([...new Set(allProducts.map(product => product.type))]);
      setBrands([...new Set(allProducts.map(product => product.brand))]);
      setCountries([...new Set(allProducts.map(product => product.country))]);
    }
  }, [allProducts]);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Apply search and filters
  useEffect(() => {
    setLoading(true);

    let results = [...allProducts];

    // Search query filter
    if (query) {
      results = results.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.type.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      results = results.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    // Type filter
    if (selectedTypes.length > 0) {
      results = results.filter(product =>
        selectedTypes.includes(product.type)
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      results = results.filter(product =>
        selectedBrands.includes(product.brand)
      );
    }

    // Country filter
    if (selectedCountries.length > 0) {
      results = results.filter(product =>
        selectedCountries.includes(product.country)
      );
    }

    // Price range filter
    results = results.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort results
    if (sortOption === 'price-asc') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      results.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name-asc') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'name-desc') {
      results.sort((a, b) => b.name.localeCompare(a.name));
    }

    setSearchResults(results);
    setLoading(false);
  }, [
    query,
    selectedCategories,
    selectedTypes,
    selectedBrands,
    selectedCountries,
    priceRange,
    sortOption,
    allProducts
  ]);

  // Toggle filter category selection
  const toggleCategorySelection = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category]
    );
  };

  // Toggle filter type selection
  const toggleTypeSelection = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(item => item !== type)
        : [...prev, type]
    );
  };

  // Toggle filter brand selection
  const toggleBrandSelection = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(item => item !== brand)
        : [...prev, brand]
    );
  };

  // Toggle filter country selection
  const toggleCountrySelection = (country) => {
    setSelectedCountries(prev =>
      prev.includes(country)
        ? prev.filter(item => item !== country)
        : [...prev, country]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSelectedBrands([]);
    setSelectedCountries([]);
    setPriceRange([0, 1000]);
    setSortOption('relevance');
  };

  return (
    <div className="bg-light min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">
            {query
              ? `Search results for "${query}"`
              : 'All Products'
            }
          </h1>
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">›</span>
            <span>Search</span>
            {query && (
              <>
                <span className="mx-2">›</span>
                <span>"{query}"</span>
              </>
            )}
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden w-full mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center bg-white py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {showFilters ? (
              <>
                <XMarkIcon className="h-5 w-5 mr-2" />
                Hide Filters
              </>
            ) : (
              <>
                <FunnelIcon className="h-5 w-5 mr-2" />
                Show Filters
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Filters</h2>
                <button
                  onClick={resetFilters}
                  className="text-primary text-sm hover:underline"
                >
                  Reset All
                </button>
              </div>

              {/* Categories Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 pb-2 border-b">Categories</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategorySelection(category)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-gray-700 capitalize cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Types Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 pb-2 border-b">Types</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {types.map((type, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`type-${type}`}
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleTypeSelection(type)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`type-${type}`}
                        className="text-gray-700 capitalize cursor-pointer"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 pb-2 border-b">Brands</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {brands.map((brand, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`brand-${brand}`}
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrandSelection(brand)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`brand-${brand}`}
                        className="text-gray-700 cursor-pointer"
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Countries Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 pb-2 border-b">Countries</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {countries.map((country, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`country-${country}`}
                        checked={selectedCountries.includes(country)}
                        onChange={() => toggleCountrySelection(country)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`country-${country}`}
                        className="text-gray-700 cursor-pointer"
                      >
                        {country}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 pb-2 border-b">Price Range</h3>
                <div className="px-2">
                  <div className="flex justify-between mb-2 text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-4">
                    <input
                      type="number"
                      min="0"
                      max={priceRange[1]}
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-20 border border-gray-300 p-2 text-sm"
                    />
                    <span className="mx-2 self-center">-</span>
                    <input
                      type="number"
                      min={priceRange[0]}
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-20 border border-gray-300 p-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:w-3/4">
            {/* Sort Controls */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap justify-between items-center">
              <div className="mb-2 md:mb-0">
                <span className="text-gray-700 mr-2">
                  {searchResults.length} results found
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700 mr-2">Sort by:</span>
                <select
                  className="border border-gray-300 rounded p-2 focus:outline-none focus:border-primary"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>

            {/* Search Results */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <h2 className="text-xl font-bold mb-4">No results found</h2>
                <p className="text-gray-600 mb-6">
                  We couldn't find any products matching your search
                  {query && <> for "<span className="font-semibold">{query}</span>"</>}.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={resetFilters}
                    className="btn btn-primary"
                  >
                    Clear All Filters
                  </button>
                  <Link to="/shop" className="btn btn-secondary">
                    Browse All Products
                  </Link>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            )}

            {/* Pagination - Simple version */}
            {searchResults.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-current="page"
                    className="z-10 bg-primary border-primary text-white relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    2
                  </a>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    3
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
