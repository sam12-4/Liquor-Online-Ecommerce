import { useState } from 'react';
import { ArrowUpTrayIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const API_URL = 'http://localhost:5000/api';

function ExcelFileUploader() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [productCount, setProductCount] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Check if file is an Excel file
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      setError('Please upload an Excel file (.xlsx or .xls)');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('excelFile', file);

      const response = await fetch(`${API_URL}/products/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload file');
      }

      setSuccess(true);
      setProductCount(result.productCount || 0);
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('excel-file-input');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Error uploading Excel file:', err);
      setError(err.message || 'Failed to upload Excel file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Replace Products Excel File</h2>
      <p className="text-gray-600 mb-6">
        Upload a new Excel file to replace the current product database. This action will affect the entire store.
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Excel File (.xlsx or .xls)
        </label>
        <input
          id="excel-file-input"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md flex items-center">
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          <span>
            Excel file uploaded successfully! {productCount} products loaded.
          </span>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-white font-medium ${
          !file || loading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <ArrowUpTrayIcon className="h-5 w-5" />
            <span>Upload and Replace</span>
          </>
        )}
      </button>

      <div className="mt-4 text-sm text-gray-500">
        <p className="font-semibold">Important Notes:</p>
        <ul className="list-disc pl-5 mt-1">
          <li>This will completely replace the current product database</li>
          <li>Make sure your Excel file follows the correct format</li>
          <li>A backup of the current file will be created automatically</li>
        </ul>
      </div>
    </div>
  );
}

export default ExcelFileUploader; 