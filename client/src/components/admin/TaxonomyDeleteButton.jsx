import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { deleteTaxonomyItem } from '../../data/productLoader';
import { useTaxonomy } from '../../context/TaxonomyContext';

const TaxonomyDeleteButton = ({ type, name, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState(null);
  const [productsUsing, setProductsUsing] = useState([]);
  const { refreshTaxonomies } = useTaxonomy();

  const handleDelete = async () => {
    if (!name) return;
    
    setIsDeleting(true);
    setError(null);
    setProductsUsing([]);
    
    try {
      const result = await deleteTaxonomyItem(type, name);
      
      // Close dialog
      setShowDialog(false);
      
      // Refresh taxonomy data
      await refreshTaxonomies();
      
      // Notify parent
      if (onSuccess) {
        onSuccess(name);
      }
    } catch (err) {
      // Check if the error is because products are using this taxonomy
      if (err.message && err.message.includes('products are using it')) {
        // Try to extract products list from error message if available
        try {
          const errorData = JSON.parse(err.message.substring(err.message.indexOf('{')));
          if (errorData.products && Array.isArray(errorData.products)) {
            setProductsUsing(errorData.products);
          }
        } catch (parseError) {
          console.error('Could not parse error data:', parseError);
        }
      }
      
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleOpenDialog = () => {
    setShowDialog(true);
    setError(null);
    setProductsUsing([]);
  };
  
  // Show delete confirmation dialog
  if (showDialog) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Delete {type.slice(0, -1)}: {name}
          </h3>
          
          {error ? (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              <p className="font-medium mb-2">Cannot delete this item:</p>
              <p>{error}</p>
              
              {productsUsing.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium mb-1">Products using this {type.slice(0, -1)}:</p>
                  <ul className="list-disc pl-5 text-sm">
                    {productsUsing.map((product, index) => (
                      <li key={index}>{product.name || `Product ID: ${product.id}`}</li>
                    ))}
                    {productsUsing.length === 5 && <li>... and more</li>}
                  </ul>
                  <p className="mt-2 text-sm italic">
                    You must remove this {type.slice(0, -1)} from all products before deleting it.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="mb-4 text-gray-600">
              Are you sure you want to delete this {type.slice(0, -1)}? This action cannot be undone.
            </p>
          )}
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowDialog(false)}
              disabled={isDeleting}
              className="px-4 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {error ? 'Close' : 'Cancel'}
            </button>
            
            {!error && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
                {isDeleting && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Show delete button
  return (
    <button
      onClick={handleOpenDialog}
      className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
      aria-label={`Delete ${name}`}
      title={`Delete ${name}`}
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  );
};

export default TaxonomyDeleteButton; 