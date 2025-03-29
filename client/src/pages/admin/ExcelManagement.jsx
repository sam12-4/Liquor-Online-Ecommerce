import { useState, useEffect } from 'react';
import ExcelFileUploader from '../../components/admin/ExcelFileUploader';
import { getProducts } from '../../data/productLoader';
import { DocumentTextIcon, TableCellsIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

function ExcelManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const API_URL = 'http://localhost:5000/api';

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

  const handleDownload = async () => {
    try {
      setDownloading(true);
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = `${API_URL}/products/download`;
      link.download = 'products.xlsx';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('Failed to download file. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Excel Data Management</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Current Excel File Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Current Excel File</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={handleDownload}
              disabled={downloading || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>{downloading ? 'Downloading...' : 'Download Current Excel File'}</span>
            </button>
            
            <button
              onClick={loadProducts}
              disabled={loading}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded flex items-center space-x-2 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span>Refresh Data</span>
            </button>
            
            <div className="text-sm text-gray-600">
              <span className="font-medium">{products.length}</span> products in database
            </div>
          </div>
        </div>
        
        {/* Excel File Uploader Section */}
        <ExcelFileUploader />
        
        {/* Excel File Naming Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Excel File Naming Notes</h2>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <span className="font-medium">The filename doesn't matter:</span> When you upload an Excel file, the system 
              doesn't care about the original filename. It will always replace the current 
              <code className="px-1 py-0.5 bg-gray-100 rounded">/server/public/products.xlsx</code> file.
            </p>
            <p>
              <span className="font-medium">Only file content matters:</span> The system validates the actual content of the file, 
              not the filename. Make sure all required fields and data are present regardless of what you name the file.
            </p>
            <p>
              <span className="font-medium">Backup is automatic:</span> A backup of the current Excel file is automatically created 
              before replacement, stored in the <code className="px-1 py-0.5 bg-gray-100 rounded">/server/backups</code> folder with a 
              timestamp.
            </p>
          </div>
        </div>
        
        {/* Excel Format Guide Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Excel Format Guide</h2>
            <button 
              onClick={() => setShowGuide(!showGuide)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showGuide ? 'Hide Guide' : 'Show Guide'}
            </button>
          </div>
          
          {showGuide && (
            <div className="mt-4 text-sm">
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Required Excel Structure
                </h3>
                <p className="mb-3">
                  The uploaded Excel file must maintain compatibility with the current system. 
                  It should have a similar structure to the existing product database.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Required Fields</h4>
                  <p className="text-gray-600 mb-2">
                    Each product must have the following fields filled. The system accepts alternative field names for compatibility.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Name:</span> 
                      <span className="text-gray-600"> Either 'name' or 'post_title'</span>
                    </li>
                    <li>
                      <span className="font-medium">Price:</span> 
                      <span className="text-gray-600"> Either 'regular_price' or 'price'</span>
                    </li>
                    <li>
                      <span className="font-medium">Stock:</span> 
                      <span className="text-gray-600"> Either 'stock' or 'stock_quantity'</span>
                    </li>
                    <li>
                      <span className="font-medium">Category:</span> 
                      <span className="text-gray-600"> Either 'category' or 'tax:product_cat'</span>
                    </li>
                    <li>
                      <span className="font-medium">Size:</span> 
                      <span className="text-gray-600"> Either 'size' (with lowercase "ml" suffix) or 'attribute:pa_product-volume' (with uppercase "ML")</span>
                    </li>
                    <li>
                      <span className="font-medium">Image:</span> 
                      <span className="text-gray-600"> Either 'image', 'image_url', or 'images'</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <TableCellsIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Sample Excel Format
                </h3>
                <p className="mb-3">
                  Your Excel file should have headers in the first row for each required field. 
                  Here's an example of how your Excel data should be structured:
                </p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">name</th>
                        <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">regular_price</th>
                        <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">stock</th>
                        <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">category</th>
                        <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">size</th>
                        <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">image_url</th>
                        <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">brand</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="py-2 px-3 text-sm">Johnny Walker Black Label</td>
                        <td className="py-2 px-3 text-sm">45.99</td>
                        <td className="py-2 px-3 text-sm">100</td>
                        <td className="py-2 px-3 text-sm">Whisky</td>
                        <td className="py-2 px-3 text-sm">750ml</td>
                        <td className="py-2 px-3 text-sm">https://example.com/images/jwblack.jpg</td>
                        <td className="py-2 px-3 text-sm">Johnny Walker</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-sm">Grey Goose Vodka</td>
                        <td className="py-2 px-3 text-sm">29.99</td>
                        <td className="py-2 px-3 text-sm">75</td>
                        <td className="py-2 px-3 text-sm">Vodka</td>
                        <td className="py-2 px-3 text-sm">1000ml</td>
                        <td className="py-2 px-3 text-sm">https://example.com/images/greygoose.jpg</td>
                        <td className="py-2 px-3 text-sm">Grey Goose</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-sm">
                  <p className="font-medium">Tips:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Use a spreadsheet application (Excel, Google Sheets) to create your file</li>
                    <li>Export as .xlsx format for best compatibility</li>
                    <li>Ensure all required fields have values for every product</li>
                    <li>Image URLs should be fully qualified URLs to publicly accessible images</li>
                    <li>Numeric values (price, stock) should not include currency symbols</li>
                    <li>For size, include the lowercase "ml" suffix (e.g., 750ml)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
        
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExcelManagement; 