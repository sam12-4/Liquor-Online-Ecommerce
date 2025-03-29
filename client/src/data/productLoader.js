import * as XLSX from 'xlsx';
import originalProducts, { categories, brands, countries, regions } from './products.js';

// Default to using the original products
let products = originalProducts;

// API URL
const API_URL = 'http://localhost:5000/api';

/**
 * Loads products from an Excel file via the server API
 * @returns {Promise<Array>} - The products data
 */
export async function loadProductsFromExcel() {
  try {
    console.log('Loading products from server API');
    
    // Fetch products from the server
    const response = await fetch(`${API_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }
    
    const loadedProducts = await response.json();
    
    // Update the global products variable
    products = loadedProducts;
    
    console.log(`Successfully loaded ${loadedProducts.length} products from server`);
    return loadedProducts;
  } catch (error) {
    console.error('Error loading products from server:', error);
    // Fall back to original products
    console.log('Falling back to original products');
    products = originalProducts;
    return originalProducts;
  }
}

/**
 * Gets the current products (either from the API or the original JS file)
 * @returns {Promise<Array>} - The products data
 */
export async function getProducts() {
  // If we haven't loaded products yet, load them from the API
  if (products === originalProducts) {
    return await loadProductsFromExcel();
  }
  return products;
}

/**
 * Gets the unique categories, brands, countries, and regions
 * @returns {Promise<Object>} - The unique values for filtering
 */
export async function getFilters() {
  // Make sure we have loaded products
  const currentProducts = await getProducts();
  
  // If we're using the original products, return the pre-calculated filters
  if (currentProducts === originalProducts) {
    return { categories, brands, countries, regions };
  }
  
  // Otherwise, calculate filters from the current products
  const dynamicCategories = [...new Set(currentProducts.map(p => p.category || p['tax:product_cat']).filter(Boolean))];
  const dynamicBrands = [...new Set(currentProducts.map(p => p.brand || p['tax:product_brand']).filter(Boolean))];
  const dynamicCountries = [...new Set(currentProducts.map(p => p.country || p['tax:Country']).filter(Boolean))];
  const dynamicRegions = [...new Set(currentProducts.map(p => p.region).filter(Boolean))];
  
  return {
    categories: dynamicCategories,
    brands: dynamicBrands,
    countries: dynamicCountries,
    regions: dynamicRegions
  };
}

/**
 * Adds a new product via the server API
 * @param {Object} product - Product data from form
 * @returns {Promise<boolean>} - Success status
 */
export const addProductToExcel = async (product) => {
  try {
    console.log('Adding product via server API:', product);
    
    // Send product data to the server
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add product');
    }
    
    const result = await response.json();
    console.log('Server response:', result);
    
    // Update our local product list
    products = await loadProductsFromExcel();
    
    // Show success message
    alert("Product added successfully! The product will now be visible in your product listings.");
    
    return true;
  } catch (error) {
    console.error('Error adding product:', error);
    alert(`Failed to add product: ${error.message}`);
    return false;
  }
};

/**
 * Updates a product via the server API
 * @param {string} productId - ID of the product to update
 * @param {Object} productData - Updated product data
 * @returns {Promise<boolean>} - Success status
 */
export const updateProduct = async (productId, productData) => {
  try {
    console.log(`Updating product ${productId} via server API`);
    
    // Ensure productId is a string
    const idStr = String(productId);
    
    const response = await fetch(`${API_URL}/products/${idStr}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update product');
    }
    
    const result = await response.json();
    console.log('Server response:', result);
    
    // Update our local product list
    products = await loadProductsFromExcel();
    
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
};

/**
 * Deletes a product via the server API
 * @param {string} productId - ID of the product to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteProduct = async (productId) => {
  try {
    console.log(`Deleting product ${productId} via server API`);
    
    // Ensure productId is a string
    const idStr = String(productId);
    
    const response = await fetch(`${API_URL}/products/${idStr}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete product');
    }
    
    const result = await response.json();
    console.log('Server response:', result);
    
    // Update our local product list
    products = await loadProductsFromExcel();
    
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

/**
 * Gets the field structure from the Excel file via the server API
 * This helps identify all possible fields and their data types
 * @returns {Promise<Object>} - Field structure information
 */
export async function getExcelFieldStructure() {
  try {
    console.log('Getting Excel field structure from server API');
    
    const response = await fetch(`${API_URL}/products/structure`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch field structure: ${response.status} ${response.statusText}`);
    }
    
    const structure = await response.json();
    console.log('Field structure from server:', structure);
    
    return structure;
  } catch (error) {
    console.error('Error getting field structure from server:', error);
    
    // Fall back to calculating structure from in-memory products
    const currentProducts = await getProducts();
    
    if (!currentProducts || currentProducts.length === 0) {
      return { fields: [], sampleProduct: {}, fieldTypes: {} };
    }
    
    // Collect all possible field names from existing products
    const allFields = new Set();
    currentProducts.forEach(p => {
      Object.keys(p).forEach(key => allFields.add(key));
    });
    
    // Determine field types based on the first product that has the field
    const fieldTypes = {};
    const fields = Array.from(allFields);
    
    fields.forEach(field => {
      // Find first product with this field
      const product = currentProducts.find(p => p[field] !== undefined);
      if (product) {
        const value = product[field];
        fieldTypes[field] = typeof value;
      }
    });
    
    // Get a sample product (the most complete one)
    const sampleProduct = currentProducts.reduce((best, current) => {
      const bestFields = Object.keys(best).length;
      const currentFields = Object.keys(current).length;
      return currentFields > bestFields ? current : best;
    }, currentProducts[0]);
    
    return {
      fields,
      sampleProduct,
      fieldTypes
    };
  }
}

// Export the original products as the default export
export default originalProducts; 