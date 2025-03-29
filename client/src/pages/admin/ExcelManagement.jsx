import { useState, useEffect } from 'react';
import ExcelFileUploader from '../../components/admin/ExcelFileUploader';
import { getProducts } from '../../data/productLoader';

function ExcelManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Excel Management - Admin Dashboard';
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

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Excel Data Management</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Excel File Uploader Section */}
        <ExcelFileUploader />
        
        {/* Current Data Summary Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Current Product Data</h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-md flex-1">
                  <div className="text-sm text-blue-600 font-medium">Total Products</div>
                  <div className="text-3xl font-bold">{products.length}</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-md flex-1">
                  <div className="text-sm text-green-600 font-medium">Categories</div>
                  <div className="text-3xl font-bold">
                    {new Set(products.map(p => p.category || p['tax:product_cat']).filter(Boolean)).size}
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-md flex-1">
                  <div className="text-sm text-purple-600 font-medium">Brands</div>
                  <div className="text-3xl font-bold">
                    {new Set(products.map(p => p.brand || p['tax:product_brand']).filter(Boolean)).size}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <button
                  onClick={loadProducts}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Refresh Data
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExcelManagement; 