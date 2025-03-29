import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../data/productLoader';
import { useTaxonomy } from '../../context/TaxonomyContext';
import { BookmarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import TaxonomyAddForm from '../../components/admin/TaxonomyAddForm';
import TaxonomyDeleteButton from '../../components/admin/TaxonomyDeleteButton';
import { useProducts } from '../../context/ProductContext';
import NewProductForm from '../../components/admin/NewProductForm';

function BrandsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const { brands } = useTaxonomy();
  const { refreshProducts } = useProducts();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    document.title = 'Brands - Admin Dashboard';
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

  // Function to get products by selected brand
  const getProductsByBrand = () => {
    if (!selectedBrand) return [];
    
    return products.filter(product => {
      // Only use the primary field that matches what's used in the add/edit form
      const productBrand = product.brand || '';
      return productBrand.toLowerCase() === selectedBrand.toLowerCase();
    });
  };

  const filteredProducts = selectedBrand ? getProductsByBrand() : [];

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
    <div className="container mx-auto py-6">
      {/* Product Edit Form */}
      {isEditing && selectedProduct && (
        <NewProductForm 
          onClose={handleCloseEditForm} 
          onProductAdded={handleProductEdited} 
          product={selectedProduct}
          isEditing={true}
        />
      )}
      
      <div className="flex items-center mb-6">
        <BookmarkIcon className="h-6 w-6 text-indigo-500 mr-2" />
        <h1 className="text-2xl font-bold">Brands</h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          {/* Brands list */}
          <div className="bg-white rounded-lg shadow-md p-4 h-fit">
            <h2 className="text-lg font-semibold mb-4">All Brands</h2>
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {brands.map((brand, index) => (
                <div key={index} className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedBrand(brand)}
                    className={`flex-grow text-left px-3 py-2 rounded-md ${
                      selectedBrand === brand
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {brand}
                  </button>
                  <div className="flex items-center space-x-1 px-2">
                    <TaxonomyDeleteButton 
                      type="brands" 
                      name={brand} 
                      onSuccess={() => {
                        if (selectedBrand === brand) {
                          setSelectedBrand(null);
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add Brand Form */}
            <TaxonomyAddForm 
              type="brands" 
              label="Brand" 
              onSuccess={(newBrand) => {
                // Select the newly added brand after it's added
                setTimeout(() => setSelectedBrand(newBrand), 300);
              }}
            />
          </div>
          
          {/* Products in selected brand */}
          <div className="lg:col-span-3">
            {selectedBrand ? (
              <>
                <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                  <h2 className="text-lg font-semibold flex items-center">
                    <span>Products by Brand: </span>
                    <span className="ml-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                      {selectedBrand}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({filteredProducts.length} products)
                    </span>
                  </h2>
                </div>
                
                {filteredProducts.length === 0 ? (
                  <div className="bg-yellow-50 p-4 rounded-md text-yellow-700">
                    No products found for this brand.
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
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                )}
              </>
            ) : (
              <div className="bg-indigo-50 p-6 rounded-lg text-center">
                <BookmarkIcon className="h-12 w-12 mx-auto text-indigo-500 mb-3" />
                <h3 className="text-lg font-medium text-indigo-900 mb-1">Select a Brand</h3>
                <p className="text-indigo-700">
                  Choose a brand from the list to view products from that brand.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BrandsPage; 