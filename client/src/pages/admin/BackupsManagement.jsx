import { useState, useEffect } from 'react';
import { ArrowDownTrayIcon, ArchiveBoxIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

function BackupsManagement() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    document.title = 'Backup Management - Admin Dashboard';
    loadBackups();
  }, []);

  const loadBackups = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/backups`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch backups: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setBackups(data.backups || []);
    } catch (err) {
      console.error('Error loading backups:', err);
      setError('Failed to load backup data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBackups();
    setRefreshing(false);
  };

  const handleDownload = async (backupPath) => {
    try {
      console.log('Original backupPath:', backupPath);
      
      // Extract just the filename from the path
      const filename = backupPath.split('/').pop();
      console.log('Extracted filename:', filename);
      
      // Make sure we're requesting directly from the endpoint with the filename parameter
      const downloadUrl = `${API_URL}/backups/download/${filename}`;
      console.log('Download URL:', downloadUrl);
      
      // Use fetch with credentials to get the file
      const response = await fetch(downloadUrl, {
        credentials: 'include' // Include cookies for authentication
      });
      
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
      }
      
      // Get the blob from response
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error('Error downloading backup file:', err);
      alert('Failed to download backup file. Please try again.');
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <ArchiveBoxIcon className="h-7 w-7 mr-2 text-blue-500" />
          Excel Backup Files
        </h1>
        
        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-lg text-red-700 mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Available Backup Files</h2>
        <p className="text-gray-600 mb-6">
          The system automatically creates backups of your Excel data when you upload new files. 
          Only the 5 most recent backups are kept to save storage space.
        </p>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : backups.length === 0 ? (
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <ArchiveBoxIcon className="h-12 w-12 mx-auto text-blue-500 mb-2" />
            <h3 className="text-lg font-medium text-blue-800 mb-1">No Backups Available</h3>
            <p className="text-blue-600">
              No backup files have been created yet. Backups are automatically created when you upload new Excel files.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Backup Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {backups.map((backup, index) => (
                  <tr key={index} className={index === 0 ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ArchiveBoxIcon className={`h-5 w-5 mr-2 ${index === 0 ? 'text-blue-500' : 'text-gray-400'}`} />
                        <span className={`${index === 0 ? 'font-medium' : ''}`}>
                          {backup.name}
                          {index === 0 && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Latest</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(backup.created)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {backup.sizeFormatted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        onClick={() => handleDownload(backup.path)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default BackupsManagement; 