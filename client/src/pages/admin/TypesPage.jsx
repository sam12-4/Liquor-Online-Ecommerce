import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../data/productLoader';
import { useTaxonomy } from '../../context/TaxonomyContext';
import { TagIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import TaxonomyAddForm from '../../components/admin/TaxonomyAddForm';
import TaxonomyDeleteButton from '../../components/admin/TaxonomyDeleteButton';
import { useProducts } from '../../context/ProductContext';
import NewProductForm from '../../components/admin/NewProductForm';

function TypesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const { types } = useTaxonomy();
  const { refreshProducts } = useProducts();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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

  // Function to handle product edit
  const handleEdit = (productId) => {
    // Find the product to edit
    const productToEdit = products.find(p => {
      // Convert all possible ID variations to strings for comparison
      const productIdStr = String(productId).trim();
      const pIdStr = p.id ? String(p.id).trim() : '';
      const pIDStr = p.ID ? String(p.ID).trim() : '';
      
      return pIdStr === productIdStr || pIDStr === productIdStr;
    });
    
    if (productToEdit) {
      console.log('Editing product:', productToEdit);
      setSelectedProduct(productToEdit);
      setIsEditing(true);
    } else {
      alert(`Product with ID ${productId} not found.`);
      console.error('All products:', products);
      console.error('Product ID being searched:', productId, typeof productId);
    }
  };
  
  // Close edit form
  const handleCloseEditForm = () => {
    setIsEditing(false);
    setSelectedProduct(null);
  };
  
  // Handle product edited
  const handleProductEdited = async () => {
    // Refresh products after edit
    await refreshProducts(true);
    loadProducts();
    setIsEditing(false);
    setSelectedProduct(null);
  };

  // Function to handle product delete
  const handleDelete = async (productId) => {
    if (window.confirm(`Are you sure you want to delete product ${productId}?`)) {
      try {
        setLoading(true);
        // Call the API to delete the product
        const success = await deleteProduct(productId);
        
        if (success) {
          // Show success message
          const successMessage = document.createElement('div');
          successMessage.classList.add('fixed', 'top-4', 'right-4', 'bg-green-100', 'border-l-4', 'border-green-500', 'text-green-700', 'p-4', 'rounded', 'shadow-md', 'z-50');
          successMessage.innerHTML = '<div class="flex"><div class="flex-shrink-0"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg></div><div class="ml-3"><p class="text-sm">Product deleted successfully!</p></div></div>';
          document.body.appendChild(successMessage);
          
          // Remove the success message after 3 seconds
          setTimeout(() => {
            if (document.body.contains(successMessage)) {
              document.body.removeChild(successMessage);
            }
          }, 3000);
          
          // Refresh products and reload data
          await refreshProducts(true);
          loadProducts();
        } else {
          alert('Failed to delete product');
        }
      } catch (err) {
        console.error('Error deleting product:', err);
        alert(`Error deleting product: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Product Edit Form */}
      {isEditing && selectedProduct && (
        <NewProductForm 
          onClose={handleCloseEditForm} 
          onProductAdded={handleProductEdited} 
          product={selectedProduct}
          isEditing={true}
        />
      )}
      
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
                <div key={index} className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedType(type)}
                    className={`flex-grow text-left px-3 py-2 rounded-md ${
                      selectedType === type
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {type}
                  </button>
                  <div className="flex items-center space-x-1 px-2">
                    <TaxonomyDeleteButton 
                      type="types" 
                      name={type} 
                      onSuccess={() => {
                        if (selectedType === type) {
                          setSelectedType(null);
                        }
                      }}
                    />
                  </div>
                </div>
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
                                <div className="flex items-center space-x-3">
                                  <button
                                    onClick={() => handleEdit(product.id || product.ID)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    <PencilIcon className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(product.id || product.ID)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                </div>
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