import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { addTaxonomyItem } from '../../data/productLoader';
import { useTaxonomy } from '../../context/TaxonomyContext';

const TaxonomyAddForm = ({ type, label, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { refreshTaxonomies } = useTaxonomy();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Call API to add the item
      await addTaxonomyItem(type, name.trim());
      
      // Reset form
      setName('');
      setIsOpen(false);
      
      // Refresh taxonomy data
      await refreshTaxonomies();
      
      // Notify parent
      if (onSuccess) {
        onSuccess(name.trim());
      }
    } catch (err) {
      setError(err.message || `Failed to add ${type.slice(0, -1)}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center w-full p-2 mt-4 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        <span>Add New {label}</span>
      </button>
    );
  }
  
  return (
    <div className="mt-4 bg-blue-50 p-4 rounded-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-medium text-blue-800">Add New {label}</h3>
        <button 
          onClick={() => {
            setIsOpen(false);
            setName('');
            setError(null);
          }}
          className="text-blue-500 hover:text-blue-700"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        
        <div className="mb-3">
          <label htmlFor="taxonomyName" className="block text-sm font-medium text-blue-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="taxonomyName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Enter ${label.toLowerCase()} name`}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setName('');
              setError(null);
            }}
            className="mr-2 px-4 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaxonomyAddForm; 