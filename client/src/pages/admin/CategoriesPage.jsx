import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../data/productLoader';
import { useTaxonomy } from '../../context/TaxonomyContext';
import { TagIcon } from '@heroicons/react/24/outline';

function CategoriesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { categories } = useTaxonomy();

  useEffect(() => {
    document.title = 'Categories - Admin Dashboard';
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products data');
    } finally {
      setLoading(false);
    }
  };

  // Function to get products by selected category
  const getProductsByCategory = () => {
    if (!selectedCategory) return [];
    
    return products.filter(product => {
      // Only use the primary field that matches what's used in the add/edit form
      const productCategory = product.category || '';
      return productCategory.toLowerCase() === selectedCategory.toLowerCase();
    });
  };

  const filteredProducts = selectedCategory ? getProductsByCategory() : [];

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <TagIcon className="h-6 w-6 text-blue-500 mr-2" />
        <h1 className="text-2xl font-bold">Categories</h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-600 mb-6">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories list */}
          <div className="bg-white rounded-lg shadow-md p-4 h-fit">
            <h2 className="text-lg font-semibold mb-4">All Categories</h2>
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    selectedCategory === category
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Products in selected category */}
          <div className="lg:col-span-3">
            {selectedCategory ? (
              <>
                <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                  <h2 className="text-lg font-semibold flex items-center">
                    <span>Products in Category: </span>
                    <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {selectedCategory}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({filteredProducts.length} products)
                    </span>
                  </h2>
                </div>
                
                {filteredProducts.length === 0 ? (
                  <div className="bg-yellow-50 p-4 rounded-md text-yellow-700">
                    No products found in this category.
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img 
                                    className="h-10 w-10 rounded-md object-cover" 
                                    src={product.image || product.image_url || product.images} 
                                    alt={product.name || product.post_title}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '/placeholder.png';
                                    }}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {product.name || product.post_title}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {product.brand || 'Unknown Brand'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                ${product.regular_price || product.price}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {product.stock || product.stock_quantity}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {product.size || product['attribute:pa_product-volume']}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Link
                                to={`/admin/dashboard/products/edit/${product.id || product.ID}`}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                Edit
                              </Link>
                              <a 
                                href="#" 
                                className="text-red-600 hover:text-red-900"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // Delete functionality would go here
                                }}
                              >
                                Delete
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <TagIcon className="h-12 w-12 mx-auto text-blue-500 mb-3" />
                <h3 className="text-lg font-medium text-blue-900 mb-1">Select a Category</h3>
                <p className="text-blue-700">
                  Choose a category from the list to view products in that category.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesPage; 