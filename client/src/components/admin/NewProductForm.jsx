import { useState, useRef, useEffect } from 'react';
import { XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { uploadToCloudinary, testCloudinaryConnection } from '../../utils/cloudinaryUpload';
import { 
  addProductToExcel, 
  getProducts, 
  getExcelFieldStructure,
  updateProduct
} from '../../data/productLoader';
import { useProducts } from '../../context/ProductContext';
import { useTaxonomy } from '../../context/TaxonomyContext';

// Fields that don't need to be shown in the form (auto-generated)
const HIDDEN_FIELDS = [
  'id', 'ID', 'sku', 'date_created', 'date_modified', 'created_at', 'modified_at',
  'date_created_gmt', 'date_modified_gmt', 'featured', 'bestseller', 'trending',
  'total_sales', 'views', 'ratings_count', 'average_rating', 'image_url', 'in_stock',
  'product_attributes', 'related_ids'
];

// Fields with specific input types
const FIELD_TYPES = {
  // Number fields
  price: 'number',
  regular_price: 'number',
  cost_price: 'number',
  sale_price: 'number',
  stock: 'number',
  stock_quantity: 'number',
  alcohol: 'number',
  
  // Text areas
  description: 'textarea',
  short_description: 'textarea',
  post_excerpt: 'textarea',
  purchase_note: 'textarea',
  
  // Boolean fields (yes/no)
  isHot: 'boolean',
  isLimitedEdition: 'boolean',
  isRecommended: 'boolean',
  isSpecial: 'boolean',
  isTrending: 'boolean',
  
  // Select fields
  stock_status: 'select',
  backorders: 'select',
  tax_status: 'select',
  sold_individually: 'select',
  post_status: 'select',
  comment_status: 'select'  
};

// Options for select fields
const SELECT_OPTIONS = {
  stock_status: [
    { value: 'instock', label: 'In Stock' },
    { value: 'outofstock', label: 'Out of Stock' },
    { value: 'onbackorder', label: 'On Backorder' }
  ],
  backorders: [
    { value: 'no', label: 'No' },
    { value: 'notify', label: 'Allow, but notify customer' },
    { value: 'yes', label: 'Allow' }
  ],
  tax_status: [
    { value: 'taxable', label: 'Taxable' },
    { value: 'shipping', label: 'Shipping only' },
    { value: 'none', label: 'None' }
  ],
  sold_individually: [
    { value: 'no', label: 'No' },
    { value: 'yes', label: 'Yes' }
  ],
  post_status: [
    { value: 'publish', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'private', label: 'Private' }
  ],
  comment_status: [
    { value: 'open', label: 'Allow' },
    { value: 'closed', label: 'Disallow' }
  ]
};

const NewProductForm = ({ onClose, onProductAdded, product = null, isEditing = false }) => {
  // Access the product context for global updates
  const { refreshProducts } = useProducts();
  
  // Access taxonomy data from context
  const { categories: taxonomyCategories, brands: taxonomyBrands, countries: taxonomyCountries, varietals: taxonomyVarietals } = useTaxonomy();
  
  // Initial form data structure with common fields
  const [formData, setFormData] = useState({
    name: product?.name || product?.post_title || '',
    post_title: product?.post_title || product?.name || '',
    category: product?.category || product?.['tax:product_cat'] || '',
    type: product?.type || product?.['tax:product_type'] || product?.['tax:type'] || '',
    price: product?.price || product?.regular_price || '',
    regular_price: product?.regular_price || product?.price || '',
    sale_price: product?.sale_price || '',
    cost_price: product?.cost_price || '',
    stock: product?.stock || product?.stock_quantity || '',
    stock_status: product?.stock_status || 'instock',
    backorders: product?.backorders || 'no',
    tax_status: product?.tax_status || 'taxable',
    stock_quantity: product?.stock_quantity || product?.stock || '',
    sold_individually: product?.sold_individually || 'no',
    weight: product?.weight || '',
    description: product?.description || '',
    short_description: product?.short_description || product?.post_excerpt || '',
    post_excerpt: product?.post_excerpt || product?.short_description || '',
    brand: product?.brand || product?.['tax:product_brand'] || '',
    country: product?.country || product?.['tax:Country'] || '',
    region: product?.region || '',
    varietal: product?.varietal || product?.['tax:wine_varietal'] || '',
    alcohol: product?.alcohol || '',
    size: product?.size || product?.['attribute:pa_product-volume'] || '',
    unit: 'ml',
    isHot: product?.isHot === true || product?.isHot === 'true',
    isLimitedEdition: product?.isLimitedEdition === true || product?.isLimitedEdition === 'true',
    isRecommended: product?.isRecommended === true || product?.isRecommended === 'true',
    isSpecial: product?.isSpecial === true || product?.isSpecial === 'true',
    isTrending: product?.isTrending === true || product?.isTrending === 'true',
    post_status: product?.post_status || 'publish',
    comment_status: product?.comment_status || 'open',
    'tax:product_cat': product?.['tax:product_cat'] || product?.category || '',
    'tax:product_brand': product?.['tax:product_brand'] || product?.brand || '',
    'tax:product_type': product?.['tax:product_type'] || product?.type || '',
    'tax:Country': product?.['tax:Country'] || product?.country || '',
    'tax:wine_varietal': product?.['tax:wine_varietal'] || product?.varietal || '',
    'attribute:pa_color': product?.['attribute:pa_color'] || '',
    'attribute:pa_product-volume': product?.['attribute:pa_product-volume'] || product?.size || '',
    purchase_note: product?.purchase_note || '',
    image: null,
    imagePreview: product?.image || product?.image_url || product?.images || null
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [varietals, setVarietals] = useState([]);
  const [excelFields, setExcelFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  // Test Cloudinary connectivity on mount and load product metadata
  useEffect(() => {
    const initialize = async () => {
      setIsTestingConnection(true);
      setLoading(true);
      
      try {
        // Test Cloudinary connection
        const isConnected = await testCloudinaryConnection();
        if (!isConnected) {
          console.warn('Cloudinary connection test failed - might be CORS or configuration issue');
        } else {
          console.log('Cloudinary connection test successful');
        }
        
        // Load products (for type field only)
        const products = await getProducts();
        
        // Get Excel structure to determine available fields
        const structure = await getExcelFieldStructure();
        console.log('Excel field structure:', structure);
        
        // Handle case where structure or fields is undefined
        if (!structure || !structure.fields) {
          console.error('Excel field structure is invalid:', structure);
          throw new Error('Failed to get Excel field structure');
        }
        
        // Filter out fields that shouldn't be shown in the form
        const formFields = structure.fields.filter(field => !HIDDEN_FIELDS.includes(field));
        setExcelFields(formFields);
        
        // Use taxonomyCategories, taxonomyBrands, taxonomyCountries, taxonomyVarietals from context
        // Extract unique values for types (not in taxonomy context)
        const uniqueTypes = [...new Set(products.map(p => 
          p.type || p['tax:product_type'] || p['tax:type']
        ).filter(Boolean))];
        
        // Use taxonomy data from context
        setCategories(taxonomyCategories);
        setBrands(taxonomyBrands);
        setTypes(uniqueTypes);
        setCountries(taxonomyCountries);
        setVarietals(taxonomyVarietals);
        
        // Update formData with additional fields from Excel
        const newFormData = { ...formData };
        formFields.forEach(field => {
          if (!newFormData.hasOwnProperty(field)) {
            if (FIELD_TYPES[field] === 'boolean') {
              newFormData[field] = false;
            } else {
              newFormData[field] = '';
            }
          }
        });
        setFormData(newFormData);
        
      } catch (err) {
        console.error('Error during initialization:', err);
        setError(`Initialization error: ${err.message}`);
      } finally {
        setIsTestingConnection(false);
        setLoading(false);
      }
    };
    
    initialize();
  }, [taxonomyCategories, taxonomyBrands, taxonomyCountries, taxonomyVarietals]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? checked 
        : (type === 'number' ? (value ? parseFloat(value) : '') : value)
    }));
    
    // Sync related fields for consistent data
    if (name === 'name') {
      setFormData(prev => ({ ...prev, post_title: value }));
    } else if (name === 'post_title') {
      setFormData(prev => ({ ...prev, name: value }));
    } else if (name === 'category') {
      setFormData(prev => ({ ...prev, 'tax:product_cat': value }));
    } else if (name === 'tax:product_cat') {
      setFormData(prev => ({ ...prev, category: value }));
    } else if (name === 'brand') {
      setFormData(prev => ({ ...prev, 'tax:product_brand': value }));
    } else if (name === 'tax:product_brand') {
      setFormData(prev => ({ ...prev, brand: value }));
    } else if (name === 'stock') {
      setFormData(prev => ({ ...prev, stock_quantity: value }));
    } else if (name === 'stock_quantity') {
      setFormData(prev => ({ ...prev, stock: value }));
    } else if (name === 'price') {
      setFormData(prev => ({ ...prev, regular_price: value }));
    } else if (name === 'regular_price') {
      setFormData(prev => ({ ...prev, price: value }));
    } else if (name === 'short_description') {
      setFormData(prev => ({ ...prev, post_excerpt: value }));
    } else if (name === 'post_excerpt') {
      setFormData(prev => ({ ...prev, short_description: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.match('image.*')) {
      setError('Please select an image file (jpg, png, etc.)');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB. Please select a smaller image.');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: e.target.result
      }));
    };
    reader.readAsDataURL(file);
    setError(null);
  };

  const testCloudinaryUpload = async () => {
    try {
      setIsUploading(true);
      setError(null);
      
      if (!formData.image) {
        alert('Please select an image file first');
        setIsUploading(false);
        return;
      }
      
      // Display info about the upload preset requirement
      alert(
        'IMPORTANT: Before uploading, make sure you have created an upload preset in your Cloudinary dashboard:\n\n' +
        '1. Go to Settings > Upload > Upload presets\n' +
        '2. Click "Add upload preset"\n' +
        '3. Name it "liquor_online_preset"\n' +
        '4. Set "Signing Mode" to "Unsigned"\n' +
        '5. Save the preset\n\n' +
        'Also ensure CORS is enabled for your Cloudinary account.'
      );
      
      // Test upload
      const imageUrl = await uploadToCloudinary(formData.image);
      console.log('Image uploaded to Cloudinary:', imageUrl);
      alert(`Image uploaded successfully!\nURL: ${imageUrl}`);
    } catch (err) {
      console.error('Error uploading test image:', err);
      setError(`Failed to upload image: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.name || !formData.post_title) {
      setError('Product name is required');
      return false;
    }
    
    if (!formData.price || !formData.regular_price) {
      setError('Product price is required');
      return false;
    }
    
    if (!formData.category && !formData['tax:product_cat']) {
      setError('Product category is required');
      return false;
    }
    
    if (!formData.stock && !formData.stock_quantity) {
      setError('Stock quantity is required');
      return false;
    }
    
    if (!formData.size) {
      setError('Product size is required');
      return false;
    }
    
    // All validations passed
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationResult = validateForm();
    if (!validationResult) {
      return;
    }
    
    try {
      setIsUploading(true);
      setError(null);

      // For new products, require an image
      if (!isEditing && !formData.image) {
        setError('Please select a product image');
        setIsUploading(false);
        return;
      }

      // Prepare product data
      let productData = { ...formData };
      
      // Only upload a new image if one was selected
      if (formData.image) {
        console.log('Uploading product image to Cloudinary...');
        const imageUrl = await uploadToCloudinary(formData.image);
        console.log('Image uploaded successfully:', imageUrl);
        
        productData.image = imageUrl;
        productData.image_url = imageUrl;
      } else if (isEditing) {
        // Keep the existing image URL for editing if no new image was uploaded
        productData.image = product.image || product.image_url || product.images;
        productData.image_url = product.image || product.image_url || product.images;
      }
      
      // Remove imagePreview as it's not needed for the Excel
      delete productData.imagePreview;
      
      // Format the size and volume fields properly
      // Store size with "ml" suffix (lowercase)
      if (productData.size) {
        // Remove any existing "ml" suffix if present
        const numericSize = productData.size.toString().replace(/[^0-9.]/g, '');
        // Add lowercase "ml" suffix
        productData.size = `${numericSize}ml`;
      }
      
      // Set the attribute:pa_product-volume field to have uppercase "ML"
      if (productData.size) {
        const numericSize = productData.size.toString().replace(/[^0-9.]/g, '');
        productData['attribute:pa_product-volume'] = `${numericSize}ML`;
      }
      
      // Filter out fields that aren't in the Excel file
      const filteredProductData = {};
      Object.keys(productData).forEach(key => {
        // Only include fields that exist in the Excel or are essential
        if (excelFields.includes(key) || ['image', 'image_url'].includes(key)) {
          // Handle boolean fields to match Excel format
          if (typeof productData[key] === 'boolean') {
            filteredProductData[key] = productData[key] ? 'true' : 'false';
          } else {
            filteredProductData[key] = productData[key];
          }
        }
      });
      
      // Convert numeric values
      ['price', 'regular_price', 'sale_price', 'cost_price', 
       'stock', 'stock_quantity', 'alcohol'].forEach(field => {
        if (filteredProductData[field]) {
          filteredProductData[field] = parseFloat(filteredProductData[field]);
        }
      });

      // Filter out empty values
      Object.keys(filteredProductData).forEach(key => {
        if (filteredProductData[key] === undefined || filteredProductData[key] === '') {
          delete filteredProductData[key];
        }
      });

      let success = false;
      
      if (isEditing) {
        // Update existing product
        console.log(`Updating product ${product.id || product.ID} with data:`, filteredProductData);
        success = await updateProduct(product.id || product.ID, filteredProductData);
        
        if (success) {
          console.log('Product updated successfully');
          
          // Show success message
          const successMessage = document.createElement('div');
          successMessage.classList.add('fixed', 'top-4', 'right-4', 'bg-green-100', 'border-l-4', 'border-green-500', 'text-green-700', 'p-4', 'rounded', 'shadow-md', 'z-50');
          successMessage.innerHTML = '<div class="flex"><div class="flex-shrink-0"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg></div><div class="ml-3"><p class="text-sm">Product updated successfully!</p></div></div>';
          document.body.appendChild(successMessage);
          
          // Remove the success message after 3 seconds
          setTimeout(() => {
            if (document.body.contains(successMessage)) {
              document.body.removeChild(successMessage);
            }
          }, 3000);
          
          // Refresh products
          await refreshProducts(true);
          
          // Close form after a delay
          setTimeout(() => {
            if (onProductAdded) {
              onProductAdded();
            }
            if (onClose) {
              onClose();
            }
          }, 1000);
        }
      } else {
        // Add new product
        console.log('Adding product to Excel with data:', filteredProductData);
        success = await addProductToExcel(filteredProductData);
        
        if (success) {
          console.log('Product added successfully, now refreshing products list...');
          
          // Add a small delay before refreshing to ensure the API has completed its operation
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Explicitly refresh products from ProductContext with force refresh parameter
          // to ensure it refreshes even if other refreshes have happened recently
          const refreshed = await refreshProducts(true);
          console.log('Products refreshed:', refreshed);
          
          // Show success message
          const successMessage = document.createElement('div');
          successMessage.classList.add('fixed', 'top-4', 'right-4', 'bg-green-100', 'border-l-4', 'border-green-500', 'text-green-700', 'p-4', 'rounded', 'shadow-md', 'z-50');
          successMessage.innerHTML = '<div class="flex"><div class="flex-shrink-0"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg></div><div class="ml-3"><p class="text-sm">Product added successfully!</p></div></div>';
          document.body.appendChild(successMessage);
          
          // Remove the success message after 3 seconds
          setTimeout(() => {
            if (document.body.contains(successMessage)) {
              document.body.removeChild(successMessage);
            }
          }, 3000);
          
          // The alert is already shown in addProductToExcel
          if (onProductAdded) {
            onProductAdded();
          }
          
          // Longer delay before closing the form to ensure refresh has fully propagated
          setTimeout(() => {
            if (onClose) {
              onClose();
            }
          }, 1000);
        }
      }
      
      if (!success) {
        setError(isEditing ? 'Failed to update product' : 'Failed to add product to database');
      }
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} product:`, err);
      setError(`Error ${isEditing ? 'updating' : 'adding'} product: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  // Get input type for a field
  const getInputType = (field) => {
    return FIELD_TYPES[field] || 'text';
  };
  
  // Render a select field with options
  const renderSelectField = (field, options) => {
    return (
      <div key={field}>
        <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
          {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace(/:/g, ' - ')}
        </label>
        <select
          id={field}
          name={field}
          value={formData[field] || ''}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select an option</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  // Render a boolean field as a checkbox
  const renderBooleanField = (field) => {
    const displayName = field.replace(/^is/, '').replace(/([A-Z])/g, ' $1').trim();
    
    return (
      <div key={field} className="flex items-center">
        <input
          type="checkbox"
          id={field}
          name={field}
          checked={!!formData[field]}
          onChange={handleInputChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor={field} className="ml-2 block text-sm text-gray-700">
          {displayName}
        </label>
      </div>
    );
  };
  
  // Render a dynamic form field
  const renderField = (field) => {
    // Skip fields that are handled specially
    if (field === 'image' || field === 'imagePreview') {
      return null;
    }
    
    // Handle select fields
    if (FIELD_TYPES[field] === 'select' && SELECT_OPTIONS[field]) {
      return renderSelectField(field, SELECT_OPTIONS[field]);
    }
    
    // Handle boolean fields
    if (FIELD_TYPES[field] === 'boolean') {
      return renderBooleanField(field);
    }
    
    // Handle textarea fields
    if (FIELD_TYPES[field] === 'textarea') {
      return (
        <div key={field} className="col-span-2">
          <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
            {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace(/:/g, ' - ')}
          </label>
          <textarea
            id={field}
            name={field}
            value={formData[field] || ''}
            onChange={handleInputChange}
            rows={field === 'description' ? '4' : '2'}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
      );
    }
    
    // Handle special fields with predefined options
    if (field === 'category' || field === 'tax:product_cat') {
      return (
        <div key={field}>
          <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id={field}
            name={field}
            value={formData[field] || ''}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      );
    }
    
    if (field === 'brand' || field === 'tax:product_brand') {
      return (
        <div key={field}>
          <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
            Brand
          </label>
          <input
            type="text"
            id={field}
            name={field}
            list="brand-options"
            value={formData[field] || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <datalist id="brand-options">
            {brands.map(brand => <option key={brand} value={brand} />)}
          </datalist>
        </div>
      );
    }
    
    if (field === 'type' || field === 'tax:product_type' || field === 'tax:type') {
      return (
        <div key={field}>
          <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <input
            type="text"
            id={field}
            name={field}
            list="type-options"
            value={formData[field] || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <datalist id="type-options">
            {types.map(type => <option key={type} value={type} />)}
          </datalist>
        </div>
      );
    }
    
    if (field === 'country' || field === 'tax:Country') {
      return (
        <div key={field}>
          <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <input
            type="text"
            id={field}
            name={field}
            list="country-options"
            value={formData[field] || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <datalist id="country-options">
            {countries.map(country => <option key={country} value={country} />)}
          </datalist>
        </div>
      );
    }
    
    if (field === 'varietal' || field === 'tax:wine_varietal') {
      return (
        <div key={field}>
          <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
            Varietal
          </label>
          <input
            type="text"
            id={field}
            name={field}
            list="varietal-options"
            value={formData[field] || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <datalist id="varietal-options">
            {varietals.map(varietal => <option key={varietal} value={varietal} />)}
          </datalist>
        </div>
      );
    }
    
    // Default to regular input
    const type = getInputType(field);
    const isRequired = ['name', 'post_title', 'price', 'regular_price', 'stock', 'stock_quantity', 'size'].includes(field);
    
    return (
      <div key={field} className={field === 'name' || field === 'post_title' ? 'md:col-span-2' : ''}>
        <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
          {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace(/:/g, ' - ')}
          {isRequired && <span className="text-red-500"> *</span>}
        </label>
        <input
          type={type}
          id={field}
          name={field}
          value={formData[field] || ''}
          onChange={handleInputChange}
          required={isRequired}
          step={type === 'number' ? '0.01' : undefined}
          min={type === 'number' ? '0' : undefined}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? `Edit Product: ${product.name || product.post_title}` : 'Add New Product'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
            
              {/* Error message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 text-red-500">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Form sections */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Image Upload Section */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image {!isEditing && <span className="text-red-500">*</span>}
                  </label>
                  <div className="flex flex-col space-y-4">
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center w-full h-40 cursor-pointer ${
                        formData.imagePreview ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {formData.imagePreview ? (
                        <img 
                          src={formData.imagePreview} 
                          alt="Preview" 
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <>
                          <ArrowUpTrayIcon className="h-8 w-8 text-gray-400" />
                          <span className="mt-2 text-sm text-gray-500">
                            {isEditing ? 'Upload new image (optional)' : 'Upload image'}
                          </span>
                        </>
                      )}
                      <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={testCloudinaryUpload}
                        disabled={isUploading || !formData.image || isTestingConnection}
                        className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 disabled:opacity-50"
                      >
                        {isUploading ? 'Testing upload...' : 'Test Cloudinary Upload'}
                      </button>
                      <a 
                        href="https://cloudinary.com/console/settings/upload" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm bg-gray-50 text-gray-600 px-3 py-1 rounded hover:bg-gray-100"
                      >
                        Cloudinary Settings
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Basic Information */}
                <div className="col-span-2">
                  <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Core product fields */}
                    {renderField('name')}
                    {renderField('regular_price')}
                    {renderField('sale_price')}
                    {renderField('stock')}
                    {renderField('stock_status')}
                    {renderField('category')}
                    {renderField('type')}
                  </div>
                </div>
              </div>
              
              {/* Product Details */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Product details fields */}
                  {renderField('brand')}
                  {renderField('country')}
                  {renderField('region')}
                  {renderField('varietal')}
                  {renderField('alcohol')}
                  
                  {/* Size and Unit */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                        Size <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="size"
                        name="size"
                        value={formData.size || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., 750 (numeric only)"
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter numeric value only (e.g. 750) - "ml" will be added automatically</p>
                    </div>
                    <div>
                      <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                        Unit
                      </label>
                      <select
                        id="unit"
                        name="unit"
                        value={formData.unit || 'ml'}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        disabled
                      >
                        <option value="ml">ml</option>
                        <option value="L">L</option>
                        <option value="oz">oz</option>
                        <option value="cl">cl</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">ML will be added automatically</p>
                    </div>
                  </div>
                  
                  {/* Other fields */}
                  {renderField('cost_price')}
                  {renderField('backorders')}
                  {renderField('sold_individually')}
                  {renderField('tax_status')}
                </div>
              </div>
              
              {/* Product Flags */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Product Flags</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {renderBooleanField('isHot')}
                  {renderBooleanField('isLimitedEdition')}
                  {renderBooleanField('isRecommended')}
                  {renderBooleanField('isSpecial')}
                  {renderBooleanField('isTrending')}
                </div>
              </div>
              
              {/* Description */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Descriptions</h3>
                <div className="grid grid-cols-1 gap-4">
                  {renderField('short_description')}
                  {renderField('description')}
                  {renderField('purchase_note')}
                </div>
              </div>
              
              {/* Advanced Settings */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Advanced Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('post_status')}
                  {renderField('comment_status')}
                </div>
              </div>
              
              {/* Submit button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    isEditing ? 'Update Product' : 'Add Product'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewProductForm; 