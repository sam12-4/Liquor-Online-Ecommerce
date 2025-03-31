import { useState, useEffect } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon
} from '@heroicons/react/24/outline';
import { useProducts } from '../../context/ProductContext';
import { useSocket } from '../../context/SocketContext';
import NewProductForm from '../../components/admin/NewProductForm';
import { deleteProduct } from '../../data/productLoader';
import { useLocation } from 'react-router-dom';

const ProductsManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [stockUpdated, setStockUpdated] = useState(false);
  
  // Use the ProductContext to get products
  const { products, refreshProducts } = useProducts();
  // Get socket connection status
  const { connected } = useSocket();
  // Use location to get state from navigation
  const location = useLocation();
  
  // Load products when component mounts
  useEffect(() => {
    let mounted = true;
    const loadProductsData = async () => {
      try {
        setLoading(true);
        await refreshProducts();
        if (mounted) {
          setError(null);
          setLoading(false);
          
          // Check for productIdToEdit in location state
          if (location.state?.productIdToEdit) {
            handleEdit(location.state.productIdToEdit);
            // Clear the state to prevent reopening on refresh
            window.history.replaceState({}, document.title);
          }
        }
      } catch (err) {
        console.error('Error loading products:', err);
        if (mounted) {
          setError('Failed to load products from server');
          setLoading(false);
        }
      }
    };
    
    loadProductsData();
    
    return () => {
      mounted = false;
    };
  }, [location]); // Add location to the dependencies
  
  // Listen for stock update events
  useEffect(() => {
    // Set up a listener for the socket.io stockUpdated event
    const handleStockUpdate = () => {
      setStockUpdated(true);
      
      // Show visual indicator for 3 seconds
      setTimeout(() => {
        setStockUpdated(false);
      }, 3000);
    };
    
    // Get the socket.io client from the window object
    const socket = window.io?.connect();
    if (socket) {
      socket.on('stockUpdated', handleStockUpdate);
      
      return () => {
        socket.off('stockUpdated', handleStockUpdate);
      };
    }
  }, []);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  // Handle sort
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Sort and filter products
  const sortedAndFilteredProducts = () => {
    // First filter by search term
    let filteredProducts = [...products];
    
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        (product.name || product.post_title || '').toLowerCase().includes(lowerCaseSearch) ||
        (product.id || product.ID || '').toString().includes(lowerCaseSearch) ||
        (product.category || product['tax:product_cat'] || '').toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    // Then sort
    if (sortConfig.key) {
      filteredProducts.sort((a, b) => {
        // Handle different property names in the Excel file
        const aValue = a[sortConfig.key] || a.post_title || '';
        const bValue = b[sortConfig.key] || b.post_title || '';
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredProducts;
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedAndFilteredProducts().length / itemsPerPage);
  const paginatedProducts = sortedAndFilteredProducts().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // CRUD operation handlers
  const handleEdit = (productId) => {
    // Find the product to edit - use a more robust comparison
    const productToEdit = products.find(p => {
      // Convert all possible ID variations to strings for comparison
      const productIdStr = String(productId).trim();
      const pIdStr = p.id ? String(p.id).trim() : '';
      const pIDStr = p.ID ? String(p.ID).trim() : '';
      
      console.log(`Comparing product ID ${productIdStr} with ${pIdStr} or ${pIDStr}`);
      
      return pIdStr === productIdStr || pIDStr === productIdStr;
    });
    
    if (productToEdit) {
      console.log('Editing product:', productToEdit);
      setSelectedProduct(productToEdit);
      setIsEditing(true);
    } else {
      alert(`Product with ID ${productId} not found. Please check the console for debug info.`);
      console.error('All products:', products);
      console.error('Product ID being searched:', productId, typeof productId);
    }
  };
  
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
          
          // Refresh products list
          await refreshProducts(true);
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
  
  const handleAddNew = () => {
    // Reset any selected product
    setSelectedProduct(null);
    setShowNewProductForm(true);
  };
  
  const handleProductAdded = () => {
    // No need to manually reload products - the NewProductForm component 
    // will refresh the products in the context after adding a product
  };
  
  const handleProductEdited = async () => {
    // Refresh products after edit
    await refreshProducts(true);
    setIsEditing(false);
    setSelectedProduct(null);
  };
  
  // Close edit form
  const handleCloseEditForm = () => {
    setIsEditing(false);
    setSelectedProduct(null);
  };
  
  // Render sort indicator
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronUpDownIcon className="h-4 w-4 ml-1" />;
    }
    
    return sortConfig.direction === 'ascending' 
      ? <ChevronUpDownIcon className="h-4 w-4 ml-1 text-blue-500" />
      : <ChevronUpDownIcon className="h-4 w-4 ml-1 text-blue-500 transform rotate-180" />;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex items-center">
          <div className="flex-shrink-0 text-red-500">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
        
        <div className="flex items-center">
          {stockUpdated && (
            <div className="mr-4 px-3 py-1 bg-green-100 text-green-800 rounded-full animate-pulse flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              Stock updated in real-time
            </div>
          )}
          
          {connected ? (
            <div className="mr-4 px-3 py-1 bg-green-100 text-green-800 rounded-full flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              Real-time connected
            </div>
          ) : (
            <div className="mr-4 px-3 py-1 bg-gray-100 text-gray-800 rounded-full flex items-center">
              <span className="h-2 w-2 bg-gray-500 rounded-full mr-2"></span>
              Real-time disconnected
            </div>
          )}
          
          <button
            onClick={handleAddNew}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Product
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products by name, ID, or category..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button 
            onClick={() => refreshProducts(true)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Refresh
          </button>
        </div>
      </div>
      
      {showNewProductForm && !isEditing && (
        <NewProductForm 
          onClose={() => setShowNewProductForm(false)} 
          onProductAdded={handleProductAdded} 
        />
      )}
      
      {isEditing && selectedProduct && (
        <NewProductForm 
          onClose={handleCloseEditForm} 
          onProductAdded={handleProductEdited} 
          product={selectedProduct}
          isEditing={true}
        />
      )}
      
      {/* Products table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('id')}
                >
                  <div className="flex items-center">
                    ID {renderSortIcon('id')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center">
                    Product Name {renderSortIcon('name')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('category')}
                >
                  <div className="flex items-center">
                    Category {renderSortIcon('category')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('price')}
                >
                  <div className="flex items-center">
                    Price {renderSortIcon('price')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('stock')}
                >
                  <div className="flex items-center">
                    Stock {renderSortIcon('stock')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.id || product.ID || index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.name || product.post_title || 'Unnamed Product'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category || product['tax:product_cat'] || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${product.price || product.regular_price || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.stock_quantity || product.stock || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button 
                          onClick={() => handleEdit(product.id || product.ID || index + 1)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id || product.ID || index + 1)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, sortedAndFilteredProducts().length)}
                </span>{' '}
                of <span className="font-medium">{sortedAndFilteredProducts().length}</span> products
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                {[...Array(totalPages).keys()].map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page + 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsManagement; 