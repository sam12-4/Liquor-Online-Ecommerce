import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FunnelIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';
import ProductCard from '../components/product/ProductCard';
import AnimatedSection from '../components/common/AnimatedSection';

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: "Johnnie Walker Blue Label",
    category: "Whisky",
    price: 189.99,
    image: "https://www.thewhiskyworld.com/images/johnnie-walker-blue-label-p144-302_medium.png",
    rating: 4.9,
    reviewCount: 128,
    isHot: true
  },
  {
    id: 2,
    name: "Grey Goose Original Vodka",
    category: "Vodka",
    price: 39.99,
    salePrice: 34.99,
    image: "https://www.greygoose.com/content/dam/greygoose/global/en/products/grey-goose-vodka-bottle.png",
    rating: 4.7,
    reviewCount: 208,
    isNewArrival: true
  },
  {
    id: 3,
    name: "Dom Pérignon Vintage Champagne",
    category: "Champagne",
    price: 219.99,
    image: "https://www.domperignon.com/sites/g/files/pcfwdg526/files/2022-11/ICONIC_BOTTLE_BLANC_2013.png",
    rating: 5,
    reviewCount: 76,
    isLimitedEdition: true
  },
  {
    id: 4,
    name: "Hendrick's Gin",
    category: "Gin",
    price: 34.99,
    image: "https://www.hendricksgin.com/media/catalog/product/5/0/500px_hendricks_gin_2018_1_back_1.png",
    rating: 4.6,
    reviewCount: 152
  },
  {
    id: 5,
    name: "Macallan 18 Year Old Sherry Oak",
    category: "Whisky",
    price: 329.99,
    image: "https://www.thewhiskyworld.com/images/macallan-18-year-old-sherry-oak-2022-release-p2150-5046_medium.png",
    rating: 4.9,
    reviewCount: 54,
    isSpecial: true
  },
  {
    id: 6,
    name: "Patrón Silver Tequila",
    category: "Tequila",
    price: 49.99,
    image: "https://www.patrontequila.com/binaries/mediumretina/content/gallery/patrontequila/products/patron-silver/bottle.png",
    rating: 4.5,
    reviewCount: 187
  },
  {
    id: 7,
    name: "Moët & Chandon Impérial Brut",
    category: "Champagne",
    price: 49.99,
    salePrice: 44.99,
    image: "https://www.moet.com/sites/g/files/pcfwdg1366/files/2021-09/moet-et-chandon-imperial-champagne-brut.png",
    rating: 4.4,
    reviewCount: 224
  },
  {
    id: 8,
    name: "Bombay Sapphire Gin",
    category: "Gin",
    price: 22.99,
    image: "https://www.bombaysapphire.com/wp-content/uploads/2020/03/hp-bs-1l.png",
    rating: 4.3,
    reviewCount: 312
  },
  {
    id: 9,
    name: "Jack Daniel's Single Barrel Select",
    category: "Whisky",
    price: 65.99,
    image: "https://www.jackdaniels.com/sites/default/files/2017-10/Single%20Barrel%20Select%20Bottle.png",
    rating: 4.7,
    reviewCount: 177
  }
];

// Filter & Category options
const categories = ["All", "Whisky", "Vodka", "Gin", "Tequila", "Rum", "Champagne", "Wine"];
const priceRanges = ["All", "Under $25", "$25 - $50", "$50 - $100", "$100 - $200", "Over $200"];

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    // Load products from API/mock
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
    
    // Page title
    document.title = 'Products | Liquor Store';
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let results = [...products];
    
    // Category filter
    if (selectedCategory !== 'All') {
      results = results.filter(p => p.category === selectedCategory);
    }
    
    // Price range filter
    if (selectedPriceRange !== 'All') {
      switch (selectedPriceRange) {
        case 'Under $25':
          results = results.filter(p => (p.salePrice || p.price) < 25);
          break;
        case '$25 - $50':
          results = results.filter(p => (p.salePrice || p.price) >= 25 && (p.salePrice || p.price) <= 50);
          break;
        case '$50 - $100':
          results = results.filter(p => (p.salePrice || p.price) > 50 && (p.salePrice || p.price) <= 100);
          break;
        case '$100 - $200':
          results = results.filter(p => (p.salePrice || p.price) > 100 && (p.salePrice || p.price) <= 200);
          break;
        case 'Over $200':
          results = results.filter(p => (p.salePrice || p.price) > 200);
          break;
        default:
          break;
      }
    }
    
    // Sorting
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high':
        results.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'name-asc':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        results.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // featured - default sorting
        break;
    }
    
    setFilteredProducts(results);
  }, [products, selectedCategory, selectedPriceRange, sortBy]);

  return (
    <div className="container mx-auto px-4 py-10">
      <AnimatedSection>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">Our Products</h1>
          <p className="text-gray-600">
            Discover our extensive selection of premium spirits and beverages
          </p>
        </div>
      </AnimatedSection>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Toggle */}
        <button
          className="lg:hidden bg-gray-100 py-2 px-4 rounded-md flex items-center justify-center gap-2 mb-4"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FunnelIcon className="h-5 w-5" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Filters Section */}
        <AnimatedSection 
          className={`w-full lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}
          delay={0.2}
        >
          {/* Categories */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h3 className="font-bold text-dark text-lg mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category} className="flex items-center">
                  <button
                    className={`text-left w-full py-1 px-2 rounded-md transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h3 className="font-bold text-dark text-lg mb-4">Price Range</h3>
            <div className="space-y-2">
              {priceRanges.map(range => (
                <div key={range} className="flex items-center">
                  <button
                    className={`text-left w-full py-1 px-2 rounded-md transition-colors ${
                      selectedPriceRange === range
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedPriceRange(range)}
                  >
                    {range}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Products Grid */}
        <div className="flex-1">
          <AnimatedSection delay={0.4}>
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-gray-600">
                  Showing <span className="font-medium text-dark">{filteredProducts.length}</span> products
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 sm:flex-none">
                  <select
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
                <div className="hidden sm:flex items-center border rounded-md">
                  <button
                    className={`p-1.5 ${viewMode === 'grid' ? 'bg-gray-100 text-primary' : 'text-gray-500'}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid view"
                  >
                    <Squares2X2Icon className="h-5 w-5" />
                  </button>
                  <button
                    className={`p-1.5 ${viewMode === 'list' ? 'bg-gray-100 text-primary' : 'text-gray-500'}`}
                    onClick={() => setViewMode('list')}
                    title="List view"
                  >
                    <ListBulletIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500 text-lg mb-4">No products found matching your criteria</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedPriceRange('All');
                }}
                className="text-primary font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div 
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {filteredProducts.map(product => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 