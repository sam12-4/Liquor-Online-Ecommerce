import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FunnelIcon, XMarkIcon, AdjustmentsHorizontalIcon, Squares2X2Icon, ListBulletIcon, ViewColumnsIcon } from '@heroicons/react/24/outline';
import { StarIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import wineBanner from '../assets/images/LiquorOnlineWineBanner.jpg';
import ProductCard from '../components/product/ProductCard';
import { getFilters } from '../data/productLoader';
import { useProducts } from '../context/ProductContext';

// No need for mock product data since we're importing from productLoader

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState('default');
  const [viewMode, setViewMode] = useState('grid-3');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Use the ProductContext to get products
  const { products, loading, error } = useProducts();

  // Filter options
  const [typeOptions, setTypeOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);

  // Collapsible filter sections
  const [openSections, setOpenSections] = useState({
    categories: true,
    color: false,
    brands: false,
    type: false,
    country: false
  });

  const toggleSection = (section) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section]
    });
  };

  // Unified filter system with different filter types
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    brands: [],
    types: [],
    colors: [],
    countries: []
  });

  // Process URL parameters from navbar links
  useEffect(() => {
    if (!loading && products.length > 0) {
      const newFilters = {
        categories: [],
        brands: [],
        types: [],
        colors: [],
        countries: []
      };

      // Get category from URL
      const category = searchParams.get('category');
      if (category) {
        // Capitalize the first letter to match with filter format
        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
        newFilters.categories.push(formattedCategory);
      }

      // Get type from URL
      const type = searchParams.get('type');
      if (type) {
        // Capitalize the first letter to match with filter format
        const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
        newFilters.types.push(formattedType);
      }

      // Get brand from URL
      const brand = searchParams.get('brand');
      if (brand) {
        // Find the matching brand with proper capitalization
        const matchedBrand = products
          .map(p => p.brand || p['tax:product_brand'])
          .filter(Boolean)
          .find(b => b.toLowerCase() === brand.toLowerCase());
        
        if (matchedBrand) {
          newFilters.brands.push(matchedBrand);
        }
      }

      // Get country from URL
      const country = searchParams.get('country');
      if (country) {
        // Find the matching country with proper capitalization
        const matchedCountry = products
          .map(p => p.country || p['tax:Country'])
          .filter(Boolean)
          .find(c => c.toLowerCase() === country.toLowerCase());
        
        if (matchedCountry) {
          newFilters.countries.push(matchedCountry);
        }
      }

      // Get varietal from URL
      const varietal = searchParams.get('varietal');
      if (varietal) {
        // Handle varietal filtering if needed
        // This would depend on how varietals are stored in your product data
      }

      // Get special parameter for special products
      const special = searchParams.get('special');
      if (special) {
        // Handle special products filtering
        // This might need to be customized based on how special products are marked in your data
        // For example if they have a 'special_type' field or something similar
      }

      // Apply the collected filters only if we have any
      if (Object.values(newFilters).some(arr => arr.length > 0)) {
        setActiveFilters(newFilters);
      }
    }
  }, [searchParams, products, loading]);

  // Helper function to add a filter of any type
  const addFilter = (filterType, value) => {
    if (!activeFilters[filterType].includes(value)) {
      setActiveFilters({
        ...activeFilters,
        [filterType]: [...activeFilters[filterType], value]
      });
    }
  };

  // Helper function to remove a filter of any type
  const removeFilter = (filterType, value) => {
    setActiveFilters({
      ...activeFilters,
      [filterType]: activeFilters[filterType].filter(item => item !== value)
    });
  };

  // Helper function to clear all filters of a specific type
  const clearFilterType = (filterType) => {
    setActiveFilters({
      ...activeFilters,
      [filterType]: []
    });
  };

  // Helper function to reset all filters
  const resetAllFilters = () => {
    setActiveFilters({
      categories: [],
      brands: [],
      types: [],
      colors: [],
      countries: []
    });
  };

  // Helper function to check if a filter is active
  const isFilterActive = (filterType, value) => {
    return activeFilters[filterType].some(filter => 
      filter.toLowerCase() === value.toLowerCase()
    );
  };

  // Toggle a filter on/off
  const toggleFilter = (filterType, value) => {
    if (isFilterActive(filterType, value)) {
      removeFilter(filterType, value);
    } else {
      addFilter(filterType, value);
    }
  };

  // Add state for filters
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categoryCount, setCategoryCount] = useState({});

  useEffect(() => {
    const initFilters = async () => {
      try {
        const { categories: cats, brands: brnds } = await getFilters();
        console.log('Categories:', cats);
        setCategories(cats);
        setBrands(brnds);

        // Count products per category
        const catCounts = {};
        cats.forEach(cat => {
          catCounts[cat] = products.filter(p => {
            const category = p.category || p['tax:product_cat'];
            return category && category.toUpperCase() === cat.toUpperCase();
          }).length;
        });
        setCategoryCount(catCounts);
      } catch (error) {
        console.error('Error loading filters:', error);
      }
    };

    if (products.length > 0) {
      initFilters();
    }
  }, [products]);

  useEffect(() => {
    // Set page title
    document.title = 'Shop | Liquor Online';

    // Start with all products
    console.log('Filtering products from:', products.length, 'total products');
    let filtered = [...products];

    // Apply category filters if any are active
    if (activeFilters.categories.length > 0) {
      filtered = filtered.filter(product => {
        const category = product.category || product['tax:product_cat'];
        return category && activeFilters.categories.some(filter =>
          category.toUpperCase() === filter.toUpperCase()
        );
      });
    }

    // Apply brand filters if any are active
    if (activeFilters.brands.length > 0) {
      filtered = filtered.filter(product => {
        const brand = product.brand || product['tax:product_brand'];
        return brand && activeFilters.brands.some(filter =>
          brand.toUpperCase() === filter.toUpperCase()
        );
      });
    }

    // Apply type filters if any are active
    if (activeFilters.types.length > 0) {
      filtered = filtered.filter(product => {
        const type = product.type || product['tax:type'];
        return type && activeFilters.types.some(filter =>
          type.toUpperCase() === filter.toUpperCase()
        );
      });
    }

    // Apply color filters if any are active
    if (activeFilters.colors.length > 0) {
      filtered = filtered.filter(product => {
        const color = product['attribute:pa_color'];
        return color && activeFilters.colors.some(filter =>
          color.toUpperCase() === filter.toUpperCase()
        );
      });
    }

    // Apply country filters if any are active
    if (activeFilters.countries.length > 0) {
      filtered = filtered.filter(product => {
        const country = product.country || product['tax:Country'];
        return country && activeFilters.countries.some(filter =>
          country.toUpperCase() === filter.toUpperCase()
        );
      });
    }

    console.log('Products after filtering:', filtered.length);

    // Extract unique types from filtered products
    const types = [...new Set(filtered.map(product => product.type || product['tax:type']).filter(Boolean))];
    setTypeOptions(types.map(type => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      count: filtered.filter(p => (p.type || p['tax:type']) === type).length
    })));

    // Extract unique colors from filtered products' color attribute
    const colors = [...new Set(filtered.map(product => product['attribute:pa_color']).filter(Boolean))];
    console.log('Colors extracted from attribute:pa_color:', colors);
    setColorOptions(colors.map(color => ({
      name: color.charAt(0).toUpperCase() + color.slice(1).toLowerCase(),
      count: filtered.filter(p => p['attribute:pa_color'] === color).length
    })));

    // Extract unique brands from filtered products
    const productBrands = [...new Set(filtered.map(product => product.brand || product['tax:product_brand']).filter(Boolean))];
    setBrandOptions(productBrands.map(brand => ({
      name: brand,
      count: filtered.filter(p => (p.brand || p['tax:product_brand']) === brand).length
    })));

    // Extract unique countries
    const countries = [...new Set(filtered.map(product => product.country || product['tax:Country']).filter(Boolean))];
    setCountryOptions(countries.map(country => ({
      name: country,
      count: filtered.filter(p => (p.country || p['tax:Country']) === country).length
    })));

    console.log('Setting filtered products:', filtered.length);

    // Apply sorting if needed
    if (sortOrder === 'price-low-high') {
      filtered.sort((a, b) => (a.price || a.regular_price) - (b.price || b.regular_price));
    } else if (sortOrder === 'price-high-low') {
      filtered.sort((a, b) => (b.price || b.regular_price) - (a.price || a.regular_price));
    } else if (sortOrder === 'name-a-z') {
      filtered.sort((a, b) => (a.name || a.post_title).localeCompare(b.name || b.post_title));
    } else if (sortOrder === 'name-z-a') {
      filtered.sort((a, b) => (b.name || b.post_title).localeCompare(a.name || a.post_title));
    }

    setFilteredProducts(filtered);
  }, [products, searchParams, activeFilters, sortOrder]);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Update page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters]);

  // Count total active filters
  const totalActiveFilters = Object.values(activeFilters).reduce(
    (total, filterArray) => total + filterArray.length,
    0
  );

  // Add a function to handle view mode changes
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Add function to handle page change with smooth scroll
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="bg-white">
      {/* Banner Section */}
      <div className="relative">
        <div
          className="relative h-[200px] md:h-[250px] w-full overflow-hidden bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${wineBanner})` }}
        >
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">SHOP</h1>
            <div className="flex items-center text-sm">
              <Link to="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-2">›</span>
              <span>Shop</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Active Filters */}
        {/* {totalActiveFilters > 0 && ( */}
        {/* <div className="mb-6"> */}
        {/* <div className="flex flex-wrap gap-2 items-center"> */}
        {/* <span className="text-gray-600">Active filters:</span> */}

        {/* Category filters */}
        {/* {activeFilters.categories.map(filter => (
                <button
                  key={`category-${filter}`}
                  onClick={() => removeFilter('categories', filter)}
                  className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  {filter}
                  <XMarkIcon className="h-4 w-4 ml-1" />
                </button>
              ))} */}

        {/* Brand filters */}
        {/* {activeFilters.brands.map(filter => (
                <button
                  key={`brand-${filter}`}
                  onClick={() => removeFilter('brands', filter)}
                  className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  {filter}
                  <XMarkIcon className="h-4 w-4 ml-1" />
                </button>
              ))} */}

        {/* Type filters */}
        {/* {activeFilters.types.map(filter => (
                <button
                  key={`type-${filter}`}
                  onClick={() => removeFilter('types', filter)}
                  className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  {filter}
                  <XMarkIcon className="h-4 w-4 ml-1" />
                </button>
              ))} */}

        {/* Color filters */}
        {/* {activeFilters.colors.map(filter => (
            <button
                  key={`color-${filter}`}
                  onClick={() => removeFilter('colors', filter)}
                  className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  <span 
                    className="inline-block w-3 h-3 rounded-full mr-1" 
                    style={{ 
                      backgroundColor: filter.toLowerCase() === 'red' ? '#8B0000' :
                        filter.toLowerCase() === 'white' ? '#F5F5DC' :
                        filter.toLowerCase() === 'rosé' ? '#FFB6C1' : 
                        filter.toLowerCase() === 'orange' ? '#FFA500' : '#E5E7EB'
                    }}
                  ></span>
                  {filter}
                  <XMarkIcon className="h-4 w-4 ml-1" />
            </button>
              ))} */}

        {/* Country filters */}
        {/* {activeFilters.countries.map(filter => (
                <button 
                  key={`country-${filter}`}
                  onClick={() => removeFilter('countries', filter)}
                  className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  {filter}
                  <XMarkIcon className="h-4 w-4 ml-1" />
                </button>
              ))} */}

        {/* <button 
                onClick={resetAllFilters}
                className="text-primary text-sm hover:underline"
              >
                Clear all
              </button> */}
        {/* </div> */}
        {/* </div> */}
        {/* )} */}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <h2 className="text-lg font-medium mb-4">Search...</h2>
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search"
                className="w-full border border-gray-300 px-4 py-2 mb-8"
              />
              </div>

            {/* Dynamic Categories */}
            <div className="mb-8">
              <h3 className="text-lg font-medium border-b border-gray-300 pb-2 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`cat-${category.toLowerCase()}`}
                        className="mr-2 accent-[#868686]"
                        checked={isFilterActive('categories', category)}
                        onChange={() => toggleFilter('categories', category)}
                    />
                    <label htmlFor={`cat-${category.toLowerCase()}`} className="cursor-pointer text-[#868686]">
                      {category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()} ({categoryCount[category] || 0})
                      </label>
                    </div>
                  ))}
                </div>
              </div>

            {/* Color */}
            <div className="mb-8">
              <h3
                className="text-lg font-medium border-b border-gray-300 pb-2 mb-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('color')}
              >
                Color
                <ChevronDownIcon className={`h-5 w-5 transition-transform ${openSections.color ? 'rotate-180' : ''}`} />
              </h3>
              {openSections.color && (
                <div className="space-y-2">
                  {colorOptions.length > 0 ? (
                    colorOptions.map((option) => (
                      <div key={option.name} className="flex items-center text-[#868686]">
                        <input
                          type="checkbox"
                          id={`color-${option.name.toLowerCase()}`}
                          className="mr-2 accent-[#868686]"
                          checked={isFilterActive('colors', option.name)}
                          onChange={() => toggleFilter('colors', option.name)}
                        />
                        <label
                          htmlFor={`color-${option.name.toLowerCase()}`}
                          className="cursor-pointer flex items-center"
                        >
                          <span
                            className="inline-block w-4 h-4 rounded-full mr-2"
                            style={{
                              backgroundColor: option.name.toLowerCase() === 'red' ? '#8B0000' :
                                option.name.toLowerCase() === 'white' ? '#F5F5DC' :
                                  option.name.toLowerCase() === 'rosé' ? '#FFB6C1' :
                                    option.name.toLowerCase() === 'orange' ? '#FFA500' : '#E5E7EB'
                            }}
                          ></span>
                          {option.name} ({option.count})
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No color data available</div>
                  )}
                </div>
              )}
            </div>

            {/* Brands */}
            <div className="mb-8">
              <h3
                className="text-lg font-medium border-b border-gray-300 pb-2 mb-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('brands')}
              >
                Brands
                <ChevronDownIcon className={`h-5 w-5 transition-transform ${openSections.brands ? 'rotate-180' : ''}`} />
              </h3>
              {openSections.brands && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {brandOptions.map((brand) => (
                    <div key={brand.name} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`brand-${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="mr-2 accent-[#868686]"
                        checked={isFilterActive('brands', brand.name)}
                        onChange={() => toggleFilter('brands', brand.name)}
                      />
                      <label
                        htmlFor={`brand-${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="cursor-pointer text-[#868686]"
                      >
                        {brand.name} ({brand.count})
                      </label>
                    </div>
                  ))}
                </div>
              )}
              </div>

            {/* Type */}
            <div className="mb-8">
              <h3
                className="text-lg font-medium border-b border-gray-300 pb-2 mb-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('type')}
              >
                Type
                <ChevronDownIcon className={`h-5 w-5 transition-transform ${openSections.type ? 'rotate-180' : ''}`} />
              </h3>
              {openSections.type && (
                <div className="space-y-2">
                  {typeOptions.map((option) => (
                    <div key={option.name} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`type-${option.name.toLowerCase()}`}
                        className="mr-2 accent-[#868686]"
                        checked={isFilterActive('types', option.name)}
                        onChange={() => toggleFilter('types', option.name)}
                      />
                      <label
                        htmlFor={`type-${option.name.toLowerCase()}`}
                        className="cursor-pointer text-[#868686]"
                      >
                        {option.name} ({option.count})
                      </label>
                    </div>
                  ))}
                </div>
              )}
              </div>

            {/* Country */}
            <div className="mb-8">
              <h3
                className="text-lg font-medium border-b border-gray-300 pb-2 mb-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('country')}
              >
                Country
                <ChevronDownIcon className={`h-5 w-5 transition-transform ${openSections.country ? 'rotate-180' : ''}`} />
              </h3>
              {openSections.country && (
                <div className="space-y-2">
                  {countryOptions.map((country) => (
                    <div key={country.name} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`country-${country.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="mr-2 accent-[#868686]"
                        checked={isFilterActive('countries', country.name)}
                        onChange={() => toggleFilter('countries', country.name)}
                      />
                      <label
                        htmlFor={`country-${country.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="cursor-pointer text-[#868686]"
                      >
                        {country.name} ({country.count})
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={toggleFilters}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Filter Products</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and View Controls */}
            <div className="flex justify-between items-center mb-8">
              <div>

                <p className="text-gray-600 text-sm">
                  {totalActiveFilters > 0 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-gray-600">Active filters:</span>

                        {/* Category filters */}
                        {activeFilters.categories.map(filter => (
                          <button
                            key={`category-${filter}`}
                            onClick={() => removeFilter('categories', filter)}
                            className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                          >
                            {filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase()}
                            <XMarkIcon className="h-4 w-4 ml-1" />
                          </button>
                        ))}

                        {/* Brand filters */}
                        {activeFilters.brands.map(filter => (
                          <button
                            key={`brand-${filter}`}
                            onClick={() => removeFilter('brands', filter)}
                            className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                          >
                            {filter}
                            <XMarkIcon className="h-4 w-4 ml-1" />
                          </button>
                        ))}

                        {/* Type filters */}
                        {activeFilters.types.map(filter => (
                          <button
                            key={`type-${filter}`}
                            onClick={() => removeFilter('types', filter)}
                            className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                          >
                            {filter}
                            <XMarkIcon className="h-4 w-4 ml-1" />
                          </button>
                        ))}

                        {/* Color filters */}
                        {activeFilters.colors.map(filter => (
                          <button
                            key={`color-${filter}`}
                            onClick={() => removeFilter('colors', filter)}
                            className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                          >
                            <span
                              className="inline-block w-3 h-3 rounded-full mr-1"
                              style={{
                                backgroundColor: filter.toLowerCase() === 'red' ? '#8B0000' :
                                  filter.toLowerCase() === 'white' ? '#F5F5DC' :
                                    filter.toLowerCase() === 'rosé' ? '#FFB6C1' :
                                      filter.toLowerCase() === 'orange' ? '#FFA500' : '#E5E7EB'
                              }}
                            ></span>
                            {filter}
                            <XMarkIcon className="h-4 w-4 ml-1" />
                          </button>
                        ))}

                        {/* Country filters */}
                        {activeFilters.countries.map(filter => (
                          <button
                            key={`country-${filter}`}
                            onClick={() => removeFilter('countries', filter)}
                            className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                          >
                            {filter}
                            <XMarkIcon className="h-4 w-4 ml-1" />
                          </button>
                        ))}

                        <button
                          onClick={resetAllFilters}
                          className="text-primary text-sm hover:underline"
                        >
                          Clear all
                        </button>
                      </div>
                    </div>
                  )}
  
                  Showing {indexOfFirstProduct + 1}–{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} item(s)
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Grid View Options */}
                <div className="flex border border-gray-300">
                  <button 
                    onClick={() => handleViewModeChange('grid-2')}
                    className={`p-2 border-r border-gray-300 ${viewMode === 'grid-2' ? 'bg-black text-white' : ''}`}
                    title="2-Column Grid"
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" className="w-4 h-4">
                      <rect width="8" height="8" fill="currentColor"></rect>
                      <rect width="8" height="8" fill="currentColor" x="12"></rect>
                      <rect width="8" height="8" fill="currentColor" y="12"></rect>
                      <rect width="8" height="8" fill="currentColor" x="12" y="12"></rect>
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleViewModeChange('grid-3')}
                    className={`p-2 border-r border-gray-300 ${viewMode === 'grid-3' ? 'bg-black text-white' : ''}`}
                    title="3-Column Grid"
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" className="w-4 h-4">
                      <rect width="5" height="5" fill="currentColor" x="0" y="0"></rect>
                      <rect width="5" height="5" fill="currentColor" x="7" y="0"></rect>
                      <rect width="5" height="5" fill="currentColor" x="14" y="0"></rect>
                      <rect width="5" height="5" fill="currentColor" x="0" y="7"></rect>
                      <rect width="5" height="5" fill="currentColor" x="7" y="7"></rect>
                      <rect width="5" height="5" fill="currentColor" x="14" y="7"></rect>
                      <rect width="5" height="5" fill="currentColor" x="0" y="14"></rect>
                      <rect width="5" height="5" fill="currentColor" x="7" y="14"></rect>
                      <rect width="5" height="5" fill="currentColor" x="14" y="14"></rect>
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleViewModeChange('grid-4')}
                    className={`p-2 border-r border-gray-300 ${viewMode === 'grid-4' ? 'bg-black text-white' : ''}`}
                    title="4-Column Grid"
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" className="w-4 h-4">
                      <rect width="4" height="4" fill="currentColor" x="0" y="0"></rect>
                      <rect width="4" height="4" fill="currentColor" x="5" y="0"></rect>
                      <rect width="4" height="4" fill="currentColor" x="10" y="0"></rect>
                      <rect width="4" height="4" fill="currentColor" x="15" y="0"></rect>
                      <rect width="4" height="4" fill="currentColor" x="0" y="5"></rect>
                      <rect width="4" height="4" fill="currentColor" x="5" y="5"></rect>
                      <rect width="4" height="4" fill="currentColor" x="10" y="5"></rect>
                      <rect width="4" height="4" fill="currentColor" x="15" y="5"></rect>
                      <rect width="4" height="4" fill="currentColor" x="0" y="10"></rect>
                      <rect width="4" height="4" fill="currentColor" x="5" y="10"></rect>
                      <rect width="4" height="4" fill="currentColor" x="10" y="10"></rect>
                      <rect width="4" height="4" fill="currentColor" x="15" y="10"></rect>
                      <rect width="4" height="4" fill="currentColor" x="0" y="15"></rect>
                      <rect width="4" height="4" fill="currentColor" x="5" y="15"></rect>
                      <rect width="4" height="4" fill="currentColor" x="10" y="15"></rect>
                      <rect width="4" height="4" fill="currentColor" x="15" y="15"></rect>
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleViewModeChange('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-black text-white' : ''}`}
                    title="List View"
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" className="w-4 h-4">
                      <rect width="20" height="4" fill="currentColor"></rect>
                      <rect width="20" height="4" fill="currentColor" y="8"></rect>
                      <rect width="20" height="4" fill="currentColor" y="16"></rect>
                    </svg>
                  </button>
                </div>

                {/* Sorting */}
                <select
                  className="border border-gray-300 p-2 bg-white appearance-none pr-8 relative"
                  value={sortOrder}
                  onChange={handleSortChange}
                >
                  <option value="default">Default Sorting</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="name-a-z">Name: A to Z</option>
                  <option value="name-z-a">Name: Z to A</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`
              grid gap-6
              ${viewMode === 'grid-2' ? 'grid-cols-1 sm:grid-cols-2' : 
                viewMode === 'grid-3' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
                viewMode === 'grid-4' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' :
                'grid-cols-1'}
              ${viewMode === 'list' ? 'list-view' : ''}
            `}>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <div key={product.id || product.sku} className={`group overflow-hidden ${viewMode === 'list' ? 'flex' : ''}`}>
                    <Link to={`/product/${product.id || product.sku}`} className={`block ${viewMode === 'list' ? 'flex w-full' : ''}`}>
                      <div className={`relative bg-white border border-gray-200 flex items-center justify-center ${viewMode === 'list' ? 'w-1/3 h-[150px]' : 'p-4 h-[300px]'}`}>
                        {/* Watermark background */}
                        <div className="absolute inset-0 z-0 flex flex-col justify-center overflow-hidden opacity-5 w-full h-full">
                          {[...Array(10)].map((_, row) => (
                            <div key={row} className="flex whitespace-nowrap w-full">
                              {[...Array(10)].map((_, col) => (
                                <span
                                  key={`${row}-${col}`}
                                  className="text-transparent font-bold whitespace-nowrap py-4"
                                  style={{
                                    fontSize: '2rem',
                                    WebkitTextStroke: '1px #c0a483',
                                    textStroke: '1px #c0a483',
                                    letterSpacing: '0.01em'
                                  }}
                                >
                                  LIQUOR ONLINE&nbsp;
                                </span>
                              ))}
                            </div>
                          ))}
                        </div>
                        <img
                          src={product.image || (product.images && product.images.split(',')[0])}
                          alt={product.name || product.post_title}
                          className="max-h-full object-contain mx-auto transition-transform group-hover:scale-105 relative z-10"
                        />
                        {(product.isHot || product.isSpecial || product.isLimitedEdition || product.isNewArrival) && (
                          <div className={`absolute top-4 right-4 z-10 ${
                            product.isHot ? 'bg-[#c0a483] ' : 
                            product.isLimitedEdition ? 'bg-dark' : 
                            product.isSpecial ? 'bg-secondary' : 
                            'bg-teal-500'
                          } text-white text-xs px-2 py-1 font-medium`}>
                            {product.isHot ? 'HOT' : 
                            product.isLimitedEdition ? 'LIMITED' : 
                            product.isSpecial ? 'SPECIAL' : 
                            'NEW'}
                          </div>
                        )}
                      </div>
                      <div className={`${viewMode === 'list' ? 'p-4 w-2/3 text-left' : 'p-4 text-center'}`}>
                        <h3 className="uppercase text-black text-[12px] text-sm md:text-base mb-2 font-medium tracking-wide">
                          {product.name || product.post_title}
                        </h3>
                        <p className="text-[#a37e37] font-medium">
                          ${(product.price || product.regular_price || 0).toFixed(2)}
                        </p>
                        {viewMode === 'list' && (
                          <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                            {product.description || product.post_excerpt || 'No description available.'}
                          </p>
                        )}
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-gray-500">
                  No products found matching your criteria
              </div>
            )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:border-[#c0a483] hover:text-[#c0a483] disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:text-gray-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-10 h-10 flex items-center justify-center border ${
                        currentPage === i + 1 
                          ? 'border-[#c0a483] bg-[#c0a483] text-white' 
                          : 'border-gray-300 hover:border-[#c0a483] hover:text-[#c0a483]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:border-[#c0a483] hover:text-[#c0a483] disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:text-gray-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add styles for list view */}
      <style jsx="true">{`
        .list-view .group:hover img {
          transform: scale(1.05);
        }
        
        @media (max-width: 640px) {
          .list-view .group {
            flex-direction: column;
          }
          .list-view .group a {
            flex-direction: column;
          }
          .list-view .group a > div:first-child {
            width: 100%;
            height: 200px;
          }
          .list-view .group a > div:last-child {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ShopPage;
