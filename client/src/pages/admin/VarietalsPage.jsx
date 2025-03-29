import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../data/productLoader';
import { useTaxonomy } from '../../context/TaxonomyContext';
import { BeakerIcon } from '@heroicons/react/24/outline';

function VarietalsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVarietal, setSelectedVarietal] = useState(null);
  const { varietals } = useTaxonomy();

  useEffect(() => {
    document.title = 'Varietals - Admin Dashboard';
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

  // Function to get products by selected varietal
  const getProductsByVarietal = () => {
    if (!selectedVarietal) return [];
    
    return products.filter(product => {
      // Only use the primary field that matches what's used in the add/edit form
      const productVarietal = product.varietal || '';
      return productVarietal.toLowerCase() === selectedVarietal.toLowerCase();
    });
  };

  const filteredProducts = selectedVarietal ? getProductsByVarietal() : [];

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <BeakerIcon className="h-6 w-6 text-purple-500 mr-2" />
        <h1 className="text-2xl font-bold">Varietals</h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          {/* Varietals list */}
          <div className="bg-white rounded-lg shadow-md p-4 h-fit">
            <h2 className="text-lg font-semibold mb-4">All Varietals</h2>
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {varietals.map((varietal, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedVarietal(varietal)}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    selectedVarietal === varietal
                      ? 'bg-purple-100 text-purple-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {varietal}
                </button>
              ))}
            </div>
          </div>
          
          {/* Products with selected varietal */}
          <div className="lg:col-span-3">
            {selectedVarietal ? (
              <>
                <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                  <h2 className="text-lg font-semibold flex items-center">
                    <span>Products with Varietal: </span>
                    <span className="ml-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {selectedVarietal}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({filteredProducts.length} products)
                    </span>
                  </h2>
                </div>
                
                {filteredProducts.length === 0 ? (
                  <div className="bg-yellow-50 p-4 rounded-md text-yellow-700">
                    No products found with this varietal.
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
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Brand
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Country
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
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
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {product.category || 'Uncategorized'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {product.brand || 'Unknown Brand'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {product.country || 'Unknown'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                ${product.regular_price || product.price}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Link
                                to={`/admin/dashboard/products/edit/${product.id || product.ID}`}
                                className="text-purple-600 hover:text-purple-900 mr-3"
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
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <BeakerIcon className="h-12 w-12 mx-auto text-purple-500 mb-3" />
                <h3 className="text-lg font-medium text-purple-900 mb-1">Select a Varietal</h3>
                <p className="text-purple-700">
                  Choose a varietal from the list to view products with that varietal.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VarietalsPage; 