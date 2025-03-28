import React, { useState } from 'react';
import { readExcelFile } from '../utils/excelReader';

function ExcelProductUploader() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is an Excel file
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      setError('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await readExcelFile(file);
      setProducts(data);
    } catch (err) {
      console.error('Error reading Excel file:', err);
      setError('Failed to read Excel file. Please check the file format and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Excel Product Uploader</h1>
      
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Upload Excel File
        </label>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2.5"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : products.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Products from Excel ({products.length})</h2>
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
          Upload an Excel file to see products
        </div>
      )}
    </div>
  );
}

export default ExcelProductUploader; 