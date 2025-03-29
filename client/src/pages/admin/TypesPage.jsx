import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../data/productLoader';
import { useTaxonomy } from '../../context/TaxonomyContext';
import { TagIcon } from '@heroicons/react/24/outline';
import TaxonomyAddForm from '../../components/admin/TaxonomyAddForm';

function TypesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const { types } = useTaxonomy();

  useEffect(() => {
    document.title = 'Product Types - Admin Dashboard';
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

  // Function to get products by selected type
  const getProductsByType = () => {
    if (!selectedType) return [];
    
    return products.filter(product => {
      // Only use the primary field that matches what's used in the add/edit form
      const productType = product.type || '';
      return productType.toLowerCase() === selectedType.toLowerCase();
    });
  };

  const filteredProducts = selectedType ? getProductsByType() : [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center">
        <TagIcon className="h-6 w-6 mr-2" />
        Product Types
      </h1>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-700">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Types list */}
          <div className="bg-white rounded-lg shadow-md p-4 h-fit">
            <h2 className="text-lg font-semibold mb-4">All Types</h2>
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {types.map((type, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedType(type)}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    selectedType === type
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            
            {/* Add Type Form */}
            <TaxonomyAddForm 
              type="types" 
              label="Type" 
              onSuccess={(newType) => {
                // Select the newly added type after it's added
                setTimeout(() => setSelectedType(newType), 300);
              }}
            />
          </div>
          
          {/* Products in selected type */}
          <div className="lg:col-span-3">
            {selectedType ? (
              <>
                <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                  <h2 className="text-lg font-semibold flex items-center">
                    <span>Products by Type: </span>
                    <span className="ml-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                      {selectedType}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({filteredProducts.length} products)
                    </span>
                  </h2>
                </div>
                
                {filteredProducts.length === 0 ? (
                  <div className="bg-yellow-50 p-4 rounded-md text-yellow-700">
                    No products found for this type.
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
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
                                  ${product.regular_price || product.price}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                  to={`/admin/dashboard/products/edit/${product.id || product.ID}`}
                                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                                >
                                  Edit
                                </Link>
                                <Link
                                  to={`/product/${product.id || product.ID}`}
                                  target="_blank"
                                  className="text-green-600 hover:text-green-900"
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-indigo-50 p-6 rounded-lg text-center">
                <TagIcon className="h-12 w-12 mx-auto text-indigo-500 mb-3" />
                <h3 className="text-lg font-medium text-indigo-900 mb-1">Select a Type</h3>
                <p className="text-indigo-700">
                  Choose a product type from the list to view products of that type.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TypesPage; 