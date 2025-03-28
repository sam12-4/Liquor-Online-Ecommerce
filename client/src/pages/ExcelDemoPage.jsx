import React, { useState, useEffect } from 'react';
import ExcelProductsTest from '../components/ExcelProductsTest';
import ExcelProductUploader from '../components/ExcelProductUploader';
import { loadProductsFromExcel, getProducts } from '../data/productLoader';

function ExcelDemoPage() {
  const [activeTab, setActiveTab] = useState('test');
  const [loadedFromFile, setLoadedFromFile] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load products when component mounts
  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        const loadedProducts = await getProducts();
        setProducts(loadedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error loading products:', error);
        setError('Failed to load products');
        setLoading(false);
      }
    };
    
    loadAllProducts();
  }, []);

  // Function to load products from the Excel file
  const handleLoadFromExcel = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load products from the Excel file in the public folder
      const data = await loadProductsFromExcel('/products.xlsx');
      setProducts(data);
      setLoadedFromFile(true);
    } catch (err) {
      console.error('Error loading Excel file:', err);
      setError('Failed to load Excel file. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Excel Products Demo</h1>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('test')}
              className={`${
                activeTab === 'test'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              From Generated File
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Upload Excel
            </button>
            <button
              onClick={() => setActiveTab('dynamic')}
              className={`${
                activeTab === 'dynamic'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Dynamic Loading
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'test' && <ExcelProductsTest />}
      
      {activeTab === 'upload' && <ExcelProductUploader />}
      
      {activeTab === 'dynamic' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Dynamic Excel Loading</h2>
          
          <div className="mb-6">
            <button
              onClick={handleLoadFromExcel}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load Products from Excel File'}
            </button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          
          {loadedFromFile ? (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Products loaded from Excel file ({products.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product, index) => (
                  <div key={index} className="border p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">{product.name || product.post_title}</h3>
                    <p className="text-gray-600">
                      {product.category || product['tax:product_cat']} - 
                      {product.type || product['tax:type']}
                    </p>
                    <p className="text-green-600 font-bold">
                      ${product.price || product.regular_price}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {(product.description || product.post_excerpt || '').substring(0, 100)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Click the button above to load products from the Excel file
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ExcelDemoPage; 