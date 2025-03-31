const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { promisify } = require('util');
const copyFile = promisify(fs.copyFile);
const multer = require('multer');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const { Category, Brand, Country, Varietal, Type, Admin } = require('./models');
const { authenticateAdmin, JWT_SECRET } = require('./middleware/auth');
const { authenticateUser } = require('./middleware/auth');
const User = require('./models/User');
const Cart = require('./models/Cart');
const Wishlist = require('./models/Wishlist');
const Order = require('./models/Order');
const Notification = require('./models/Notification');
const AdminNotification = require('./models/AdminNotification');
const DiscountCode = require('./models/DiscountCode');
const { validateRegistration, validateLogin } = require('./middleware/validators');
const { sendOrderConfirmation } = require('./utils/emailService');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Clean up any duplicates in taxonomy collections on startup
cleanupTaxonomyDuplicates();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, 'temp'));
  },
  filename: function(req, file, cb) {
    cb(null, 'temp-upload.xlsx');
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function(req, file, cb) {
    // Check if file is Excel
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.xlsx' && ext !== '.xls') {
      return cb(new Error('Only Excel files are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  } 
});

// Ensure temp directory exists
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Store path to Excel file
const EXCEL_FILE_PATH = path.join(__dirname, 'public', 'products.xlsx');
const BACKUP_FOLDER = path.join(__dirname, 'backups');

// Ensure backup folder exists
if (!fs.existsSync(BACKUP_FOLDER)) {
  fs.mkdirSync(BACKUP_FOLDER, { recursive: true });
}

// Create a backup of the Excel file
async function backupExcelFile() {
  try {
    if (!fs.existsSync(EXCEL_FILE_PATH)) return;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_FOLDER, `products-backup-${timestamp}.xlsx`);
    
    await copyFile(EXCEL_FILE_PATH, backupPath);
    console.log(`Backup created at: ${backupPath}`);
    
    // Delete older backups, keeping only the 5 most recent ones
    const MAX_BACKUPS = 5;
    const files = fs.readdirSync(BACKUP_FOLDER)
      .filter(file => file.startsWith('products-backup-'))
      .map(file => ({
        name: file,
        path: path.join(BACKUP_FOLDER, file),
        time: fs.statSync(path.join(BACKUP_FOLDER, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time); // Sort newest to oldest
    
    // If we have more than MAX_BACKUPS files, delete the oldest ones
    if (files.length > MAX_BACKUPS) {
      console.log(`Removing ${files.length - MAX_BACKUPS} old backup files...`);
      for (let i = MAX_BACKUPS; i < files.length; i++) {
        fs.unlinkSync(files[i].path);
        console.log(`Deleted old backup: ${files[i].name}`);
      }
    }
    
    return backupPath;
  } catch (error) {
    console.error('Error creating backup:', error);
    return null;
  }
}

// Helper function to read products from Excel
function readProductsFromExcel() {
  try {
    if (!fs.existsSync(EXCEL_FILE_PATH)) {
      console.log('Excel file not found, returning empty array');
      return [];
    }
    
    // Read the Excel file
    const workbook = XLSX.readFile(EXCEL_FILE_PATH);
    
    // Get the first worksheet
    const worksheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[worksheetName];
    
    // Convert to JSON
    const products = XLSX.utils.sheet_to_json(worksheet);
    return products;
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return [];
  }
}

// Helper function to write products to Excel
async function writeProductsToExcel(products) {
  try {
    // Create a backup before writing
    await backupExcelFile();
    
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Convert products array to worksheet
    const worksheet = XLSX.utils.json_to_sheet(products);
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    
    // Write the workbook to file
    XLSX.writeFile(workbook, EXCEL_FILE_PATH);
    
    console.log(`Excel file updated with ${products.length} products`);
    return true;
  } catch (error) {
    console.error('Error writing to Excel file:', error);
    return false;
  }
}

// Upload and replace products Excel file
app.post('/api/products/upload', upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Create a backup of current file
    await backupExcelFile();
    
    // Replace the current Excel file with the uploaded one
    const tempFilePath = req.file.path;
    
    // Verify the file is a valid Excel file
    try {
      // Try to read the file to ensure it's valid
      const workbook = XLSX.readFile(tempFilePath);
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const uploadedProducts = XLSX.utils.sheet_to_json(worksheet);
      
      if (!Array.isArray(uploadedProducts)) {
        throw new Error('Invalid Excel format');
      }
      
      console.log(`Uploaded file contains ${uploadedProducts.length} products`);
      
      // Get current products to compare fields
      let currentProducts = [];
      if (fs.existsSync(EXCEL_FILE_PATH)) {
        const currentWorkbook = XLSX.readFile(EXCEL_FILE_PATH);
        const currentWorksheetName = currentWorkbook.SheetNames[0];
        const currentWorksheet = currentWorkbook.Sheets[currentWorksheetName];
        currentProducts = XLSX.utils.sheet_to_json(currentWorksheet);
      }
      
      // Define required fields
      const requiredFields = [
        'name', 'post_title', // Name (either field is acceptable)
        'regular_price', 'price', // Price (either field is acceptable)
        'stock', 'stock_quantity', // Stock (either field is acceptable)
        'category', 'tax:product_cat', // Category (either field is acceptable)
        'size', 'attribute:pa_product-volume' // Size (either field is acceptable)
      ];
      
      // Get all field names from current products
      const currentFieldNames = new Set();
      if (currentProducts.length > 0) {
        currentProducts.forEach(product => {
          Object.keys(product).forEach(field => {
            currentFieldNames.add(field);
          });
        });
      }
      
      // Check if uploaded file has all fields from current file
      const uploadedFieldNames = new Set();
      uploadedProducts.forEach(product => {
        Object.keys(product).forEach(field => {
          uploadedFieldNames.add(field);
        });
      });
      
      const missingFields = [];
      currentFieldNames.forEach(field => {
        if (!uploadedFieldNames.has(field)) {
          missingFields.push(field);
        }
      });
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          error: 'Uploaded Excel file is missing fields that exist in the current file',
          details: {
            missingFields,
            message: `These fields exist in the current Excel file but are missing in the uploaded file: ${missingFields.join(', ')}`
          }
        });
      }
      
      // Validate all products have required fields
      const invalidProducts = [];
      uploadedProducts.forEach((product, index) => {
        const issues = [];
        
        // Check name
        if ((!product.name || !product.name.trim()) && (!product.post_title || !product.post_title.trim())) {
          issues.push('Name is required (missing name and post_title)');
        }
        
        // Check price
        if ((!product.regular_price && product.regular_price !== 0) && (!product.price && product.price !== 0)) {
          issues.push('Price is required (missing regular_price and price)');
        }
        
        // Check stock
        if ((!product.stock && product.stock !== 0) && (!product.stock_quantity && product.stock_quantity !== 0)) {
          issues.push('Stock is required (missing stock and stock_quantity)');
        }
        
        // Check category
        if ((!product.category || !product.category.trim()) && 
            (!product['tax:product_cat'] || !product['tax:product_cat'].trim())) {
          issues.push('Category is required (missing category and tax:product_cat)');
        }
        
        // Check size - allow numeric values without "ml", values with lowercase "ml", and values with capital "ML"
        if ((product.size === undefined || product.size === null || (typeof product.size === 'string' && !product.size.trim())) && 
            (product['attribute:pa_product-volume'] === undefined || product['attribute:pa_product-volume'] === null || 
            (typeof product['attribute:pa_product-volume'] === 'string' && !product['attribute:pa_product-volume'].trim()))) {
          issues.push('Size is required (missing size and attribute:pa_product-volume)');
        }
        
        // Check image
        if ((!product.image || !product.image.trim()) && 
            (!product.image_url || !product.image_url.trim()) &&
            (!product.images || !product.images.trim())) {
          issues.push('Image is required (missing image, image_url, and images)');
        }
        
        if (issues.length > 0) {
          const productName = product.name || product.post_title || `Product at row ${index + 2}`; // +2 for Excel row (header + 1-based index)
          invalidProducts.push({
            product: productName,
            row: index + 2, // Excel row number
            issues
          });
        }
      });
      
      if (invalidProducts.length > 0) {
        return res.status(400).json({
          error: 'Some products are missing required fields',
          details: {
            invalidProducts,
            message: `${invalidProducts.length} products have missing required fields. Please fix these issues and upload again.`
          }
        });
      }
      
      // If all validations pass, proceed with file replacement
      // Copy the file to replace the products.xlsx
      fs.copyFileSync(tempFilePath, EXCEL_FILE_PATH);
      
      // Clean up the temp file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      
      // Read the new products to confirm
      const products = readProductsFromExcel();
      
      // After successful file upload and validation, automatically extract taxonomy data
      let taxonomyCounts = null;
      try {
        // Extract taxonomy data from products
        const { categories, brands, countries, varietals, types } = extractUniqueValues(products);
        
        // Save to taxonomy files
        const taxonomyDir = path.join(__dirname, 'public', 'taxonomy');
        if (!fs.existsSync(taxonomyDir)) {
          fs.mkdirSync(taxonomyDir, { recursive: true });
        }
        
        // Write each taxonomy to its own JSON file
        fs.writeFileSync(
          path.join(taxonomyDir, 'categories.json'), 
          JSON.stringify(categories, null, 2)
        );
        
        fs.writeFileSync(
          path.join(taxonomyDir, 'brands.json'), 
          JSON.stringify(brands, null, 2)
        );
        
        fs.writeFileSync(
          path.join(taxonomyDir, 'countries.json'), 
          JSON.stringify(countries, null, 2)
        );
        
        fs.writeFileSync(
          path.join(taxonomyDir, 'varietals.json'), 
          JSON.stringify(varietals, null, 2)
        );
        
        fs.writeFileSync(
          path.join(taxonomyDir, 'types.json'), 
          JSON.stringify(types, null, 2)
        );
        
        // Update MongoDB collections
        try {
          // Update collections with new values
          await updateTaxonomyCollection(Category, categories);
          await updateTaxonomyCollection(Brand, brands);
          await updateTaxonomyCollection(Country, countries);
          await updateTaxonomyCollection(Varietal, varietals);
          await updateTaxonomyCollection(Type, types);
          
          console.log('MongoDB taxonomy collections updated after Excel upload');
          
          taxonomyCounts = {
            categories: categories.length,
            brands: brands.length,
            countries: countries.length,
            varietals: varietals.length,
            types: types.length
          };
        } catch (dbError) {
          console.error('Error updating MongoDB taxonomy collections after upload:', dbError);
          // Continue even if MongoDB update fails
        }
      } catch (taxonomyError) {
        console.error('Error extracting taxonomy data after upload:', taxonomyError);
        // Continue even if taxonomy extraction fails
      }
      
      res.json({ 
        success: true, 
        message: 'Products file replaced successfully',
        productCount: products.length,
        taxonomyExtracted: taxonomyCounts !== null,
        taxonomyCounts
      });
    } catch (err) {
      // Remove temp file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      
      return res.status(400).json({ 
        error: 'Invalid Excel file format',
        details: err.message
      });
    }
  } catch (error) {
    console.error('Error uploading products file:', error);
    res.status(500).json({ 
      error: 'Failed to upload products file',
      details: error.message
    });
  }
});

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const products = readProductsFromExcel();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add a new product
app.post('/api/products', async (req, res) => {
  try {
    // Get current products
    const currentProducts = readProductsFromExcel();
    
    // Get the new product data
    const newProductData = req.body;
    
    if (!newProductData || !newProductData.name) {
      return res.status(400).json({ error: 'Invalid product data' });
    }
    
    // Generate ID (find max ID and increment)
    let maxId = 0;
    currentProducts.forEach(p => {
      const id = parseInt(p.id || p.ID || '0');
      if (!isNaN(id) && id > maxId) maxId = id;
    });
    
    const productId = maxId + 1;
    const now = new Date();
    const dateStr = now.toISOString();
    
    // Create product with auto-generated fields
    const product = {
      id: productId.toString(),
      ID: productId.toString(),
      sku: `SKU-${productId}-${Math.floor(Math.random() * 1000)}`,
      date_created: dateStr,
      date_modified: dateStr,
      ...newProductData
    };
    
    // Add product to array
    currentProducts.push(product);
    
    // Write to Excel file
    const success = await writeProductsToExcel(currentProducts);
    
    if (success) {
      res.status(201).json({ 
        success: true, 
        message: 'Product added successfully',
        product 
      });
    } else {
      res.status(500).json({ error: 'Failed to add product' });
    }
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Update a product
app.put('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = req.body;
    console.log(`Server: Updating product with ID ${productId}, type: ${typeof productId}`);
    
    // Get current products
    const products = readProductsFromExcel();
    console.log(`Server: Found ${products.length} total products in Excel`);
    
    // Find the product index - handle different ID formats
    const index = products.findIndex(p => {
      // Convert to string and trim for comparison
      const pIdStr = p.id ? String(p.id).trim() : '';
      const pIDStr = p.ID ? String(p.ID).trim() : '';
      const prodIdStr = String(productId).trim();
      
      console.log(`Server: Comparing ID '${prodIdStr}' with '${pIdStr}' or '${pIDStr}'`);
      return pIdStr === prodIdStr || pIDStr === prodIdStr;
    });
    
    if (index === -1) {
      console.log(`Server: Product with ID ${productId} not found in Excel`);
      
      // Debug: Log first few product IDs
      const idSamples = products.slice(0, 5).map(p => ({ id: p.id, ID: p.ID, type: typeof p.id }));
      console.log('Server: Sample product IDs:', idSamples);
      
      return res.status(404).json({ error: 'Product not found' });
    }
    
    console.log(`Server: Found product at index ${index}:`, products[index]);
    
    // Update product
    const updatedProduct = {
      ...products[index],
      ...productData,
      date_modified: new Date().toISOString()
    };
    
    // Ensure ID fields remain the same type as they were
    updatedProduct.id = products[index].id;
    updatedProduct.ID = products[index].ID;
    
    products[index] = updatedProduct;
    console.log(`Server: Updated product:`, updatedProduct);
    
    // Write to Excel file
    const success = await writeProductsToExcel(products);
    
    if (success) {
      res.json({ 
        success: true, 
        message: 'Product updated successfully',
        product: updatedProduct 
      });
    } else {
      res.status(500).json({ error: 'Failed to update product' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(`Server: Deleting product with ID ${productId}, type: ${typeof productId}`);
    
    // Get current products
    const products = readProductsFromExcel();
    console.log(`Server: Found ${products.length} total products in Excel`);
    
    // More robust comparison for filtering
    const originalLength = products.length;
    const filteredProducts = products.filter(p => {
      // Convert to string and trim for comparison
      const pIdStr = p.id ? String(p.id).trim() : '';
      const pIDStr = p.ID ? String(p.ID).trim() : '';
      const prodIdStr = String(productId).trim();
      
      const shouldKeep = pIdStr !== prodIdStr && pIDStr !== prodIdStr;
      if (!shouldKeep) {
        console.log(`Server: Found product to delete:`, p);
      }
      return shouldKeep;
    });
    
    if (filteredProducts.length === originalLength) {
      console.log(`Server: Product with ID ${productId} not found for deletion`);
      
      // Debug: Log first few product IDs
      const idSamples = products.slice(0, 5).map(p => ({ id: p.id, ID: p.ID, type: typeof p.id }));
      console.log('Server: Sample product IDs:', idSamples);
      
      return res.status(404).json({ error: 'Product not found' });
    }
    
    console.log(`Server: Removed ${originalLength - filteredProducts.length} products`);
    
    // Write to Excel file
    const success = await writeProductsToExcel(filteredProducts);
    
    if (success) {
      res.json({ 
        success: true, 
        message: 'Product deleted successfully' 
      });
    } else {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get product field structure
app.get('/api/products/structure', (req, res) => {
  try {
    const products = readProductsFromExcel();
    
    if (!products || products.length === 0) {
      return res.json({ fields: [], sampleProduct: {}, fieldTypes: {} });
    }
    
    // Collect all possible field names
    const allFields = new Set();
    products.forEach(p => {
      Object.keys(p).forEach(key => allFields.add(key));
    });
    
    // Determine field types based on the first product that has the field
    const fieldTypes = {};
    const fields = Array.from(allFields);
    
    fields.forEach(field => {
      const product = products.find(p => p[field] !== undefined);
      if (product) {
        const value = product[field];
        fieldTypes[field] = typeof value;
      }
    });
    
    // Get a sample product (the most complete one)
    const sampleProduct = products.reduce((best, current) => {
      const bestFields = Object.keys(best).length;
      const currentFields = Object.keys(current).length;
      return currentFields > bestFields ? current : best;
    }, products[0]);
    
    res.json({
      fields,
      sampleProduct,
      fieldTypes
    });
  } catch (error) {
    console.error('Error getting product structure:', error);
    res.status(500).json({ error: 'Failed to get product structure' });
  }
});

// Download the current products Excel file
app.get('/api/products/download', (req, res) => {
  try {
    if (!fs.existsSync(EXCEL_FILE_PATH)) {
      return res.status(404).json({ error: 'Products Excel file not found' });
    }
    
    // Set headers for file download
    res.setHeader('Content-Disposition', 'attachment; filename=products.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
    // Create a read stream and pipe it to the response
    const fileStream = fs.createReadStream(EXCEL_FILE_PATH);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading Excel file:', error);
    res.status(500).json({ error: 'Failed to download Excel file' });
  }
});

// Function to deduplicate and extract taxonomy data from products
function extractUniqueValues(products) {
  // Extract unique values - using only the specific fields used by the add/edit product form
  const categories = new Set();
  const brands = new Set();
  const countries = new Set();
  const varietals = new Set();
  const types = new Set();
  
  // Case-insensitive tracking to prevent duplicates with different capitalization
  const categoriesLower = new Set();
  const brandsLower = new Set();
  const countriesLower = new Set();
  const varietalsLower = new Set();
  const typesLower = new Set();
  
  products.forEach(product => {
    // Extract only from the primary field that the add/edit form uses
    if (product.category && product.category.trim()) {
      const category = product.category.trim();
      const categoryLower = category.toLowerCase();
      if (!categoriesLower.has(categoryLower)) {
        categories.add(category);
        categoriesLower.add(categoryLower);
      }
    }
    
    if (product.brand && product.brand.trim()) {
      const brand = product.brand.trim();
      const brandLower = brand.toLowerCase();
      if (!brandsLower.has(brandLower)) {
        brands.add(brand);
        brandsLower.add(brandLower);
      }
    }
    
    if (product.country && product.country.trim()) {
      const country = product.country.trim();
      const countryLower = country.toLowerCase();
      if (!countriesLower.has(countryLower)) {
        countries.add(country);
        countriesLower.add(countryLower);
      }
    }
    
    if (product.varietal && product.varietal.trim()) {
      const varietal = product.varietal.trim();
      const varietalLower = varietal.toLowerCase();
      if (!varietalsLower.has(varietalLower)) {
        varietals.add(varietal);
        varietalsLower.add(varietalLower);
      }
    }
    
    if (product.type && product.type.trim()) {
      const type = product.type.trim();
      const typeLower = type.toLowerCase();
      if (!typesLower.has(typeLower)) {
        types.add(type);
        typesLower.add(typeLower);
      }
    }
  });
  
  // Convert to arrays
  return {
    categories: Array.from(categories),
    brands: Array.from(brands),
    countries: Array.from(countries),
    varietals: Array.from(varietals),
    types: Array.from(types)
  };
}

// Extract and save unique values for categories, brands, countries, varietals, and types
app.get('/api/extract-taxonomy', async (req, res) => {
  try {
    // Read products from Excel
    const products = readProductsFromExcel();
    
    if (!products || products.length === 0) {
      return res.status(404).json({ error: 'No products found in Excel file' });
    }
    
    // Extract unique values
    const { categories, brands, countries, varietals, types } = extractUniqueValues(products);
    
    // Save to taxonomy files
    const taxonomyDir = path.join(__dirname, 'public', 'taxonomy');
    if (!fs.existsSync(taxonomyDir)) {
      fs.mkdirSync(taxonomyDir, { recursive: true });
    }
    
    // Write each taxonomy to its own JSON file
    fs.writeFileSync(
      path.join(taxonomyDir, 'categories.json'), 
      JSON.stringify(categories, null, 2)
    );
    
    fs.writeFileSync(
      path.join(taxonomyDir, 'brands.json'), 
      JSON.stringify(brands, null, 2)
    );
    
    fs.writeFileSync(
      path.join(taxonomyDir, 'countries.json'), 
      JSON.stringify(countries, null, 2)
    );
    
    fs.writeFileSync(
      path.join(taxonomyDir, 'varietals.json'), 
      JSON.stringify(varietals, null, 2)
    );
    
    fs.writeFileSync(
      path.join(taxonomyDir, 'types.json'), 
      JSON.stringify(types, null, 2)
    );
    
    // Update MongoDB collections
    try {
      // Clear and update categories collection
      await updateTaxonomyCollection(Category, categories);
      
      // Clear and update brands collection
      await updateTaxonomyCollection(Brand, brands);
      
      // Clear and update countries collection
      await updateTaxonomyCollection(Country, countries);
      
      // Clear and update varietals collection
      await updateTaxonomyCollection(Varietal, varietals);
      
      // Clear and update types collection
      await updateTaxonomyCollection(Type, types);
      
      console.log('MongoDB taxonomy collections updated successfully');
    } catch (dbError) {
      console.error('Error updating MongoDB taxonomy collections:', dbError);
      // Continue even if MongoDB update fails
    }
    
    // Return success with counts
    res.json({
      success: true,
      counts: {
        categories: categories.length,
        brands: brands.length,
        countries: countries.length,
        varietals: varietals.length,
        types: types.length
      }
    });
  } catch (error) {
    console.error('Error extracting taxonomy:', error);
    res.status(500).json({ 
      error: 'Failed to extract taxonomy data',
      details: error.message
    });
  }
});

// Helper function to update a taxonomy collection with new values
async function updateTaxonomyCollection(Model, values) {
  try {
    // First, clean up existing duplicates in the database (case-insensitive)
    const existingItems = await Model.find({}, 'name');
    
    // Group items by lowercase name to find duplicates
    const existingMap = {};
    existingItems.forEach(item => {
      const lowerName = item.name.toLowerCase();
      if (!existingMap[lowerName]) {
        existingMap[lowerName] = [item._id];
      } else {
        existingMap[lowerName].push(item._id);
      }
    });
    
    // For each group of duplicates, keep only one (the first one)
    const duplicatePromises = [];
    Object.keys(existingMap).forEach(lowerName => {
      if (existingMap[lowerName].length > 1) {
        // Keep the first one, remove the rest
        const idsToRemove = existingMap[lowerName].slice(1);
        const removePromise = Model.deleteMany({ _id: { $in: idsToRemove } });
        duplicatePromises.push(removePromise);
      }
    });
    
    // Wait for all duplicate removal operations to complete
    if (duplicatePromises.length > 0) {
      await Promise.all(duplicatePromises);
      console.log(`Removed ${duplicatePromises.length} duplicate entries from ${Model.modelName}`);
    }
    
    // Now get the cleaned-up list of items
    const cleanedItems = await Model.find({}, 'name');
    const existingNames = new Set(cleanedItems.map(item => item.name.toLowerCase()));
    
    // Filter out values that already exist in the database (case-insensitive)
    const newValues = values.filter(name => {
      return !existingNames.has(name.toLowerCase());
    });
    
    // If there are new values to add
    if (newValues.length > 0) {
      // Create documents for new values
      const newDocuments = newValues.map(name => ({ name }));
      
      // Insert many (only new values)
      await Model.insertMany(newDocuments);
      console.log(`Added ${newValues.length} new items to ${Model.modelName} collection`);
    } else {
      console.log(`No new items to add to ${Model.modelName} collection`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating ${Model.modelName} collection:`, error);
    throw error;
  }
}

// Get taxonomy data (updated to check MongoDB first, then fall back to JSON files)
app.get('/api/taxonomy/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    // Validate type parameter
    const validTypes = ['categories', 'brands', 'countries', 'varietals', 'types'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid taxonomy type' });
    }
    
    // Map type to model
    const modelMap = {
      'categories': Category,
      'brands': Brand,
      'countries': Country,
      'varietals': Varietal,
      'types': Type
    };
    
    // Get the model
    const Model = modelMap[type];
    
    let names = [];
    
    try {
      // Try to get data from MongoDB first
      const items = await Model.find({}).sort('name');
      names = items.map(item => item.name);
      
      if (names.length > 0) {
        // Return the unique, deduplicated names
        const uniqueNames = removeDuplicates(names);
        return res.json(uniqueNames);
      }
    } catch (dbError) {
      console.error(`Error fetching ${type} from MongoDB:`, dbError);
      // Fall back to file system if MongoDB fails
    }
    
    // Fall back to JSON file if MongoDB is empty or fails
    const filePath = path.join(__dirname, 'public', 'taxonomy', `${type}.json`);
    
    // If file doesn't exist yet, return empty array
    if (!fs.existsSync(filePath)) {
      return res.json([]);
    }
    
    // Read taxonomy data from file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Deduplicate data before returning
    const uniqueData = removeDuplicates(data);
    res.json(uniqueData);
  } catch (error) {
    console.error(`Error fetching taxonomy data:`, error);
    res.status(500).json({ error: 'Failed to fetch taxonomy data' });
  }
});

// Helper function to remove duplicates (case-insensitive)
function removeDuplicates(arr) {
  const seen = new Map();
  return arr.filter(item => {
    if (!item) return false;
    
    const itemLower = typeof item === 'string' ? item.toLowerCase() : String(item).toLowerCase();
    if (seen.has(itemLower)) {
      return false;
    }
    seen.set(itemLower, true);
    return true;
  });
}

// Function to clean up duplicates in all taxonomy collections
async function cleanupTaxonomyDuplicates() {
  const collections = [
    { name: 'categories', model: Category },
    { name: 'brands', model: Brand },
    { name: 'countries', model: Country },
    { name: 'varietals', model: Varietal },
    { name: 'types', model: Type }
  ];

  for (const { name, model } of collections) {
    try {
      console.log(`Cleaning up duplicates in ${name} collection...`);
      
      // First, clean up duplicates
      await cleanupCollectionDuplicates(model);
      
      // Then, sync with JSON files to ensure consistency
      const jsonPath = path.join(__dirname, 'public', 'taxonomy', `${name}.json`);
      if (fs.existsSync(jsonPath)) {
        try {
          const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
          
          // Create a Set of lowercase names from the JSON file for efficient lookup
          const jsonNamesLower = new Set(jsonData.map(item => 
            typeof item === 'string' ? item.toLowerCase().trim() : String(item).toLowerCase().trim()
          ));
          
          // Get all items from the database
          const dbItems = await model.find({});
          
          // Find items in DB that aren't in the JSON file (orphaned entries)
          const orphanedItems = dbItems.filter(item => 
            !jsonNamesLower.has(item.name.toLowerCase().trim())
          );
          
          if (orphanedItems.length > 0) {
            const orphanedIds = orphanedItems.map(item => item._id);
            const result = await model.deleteMany({ _id: { $in: orphanedIds } });
            console.log(`Removed ${result.deletedCount} orphaned entries from ${model.modelName} collection that were not in ${name}.json`);
          }
        } catch (jsonError) {
          console.error(`Error syncing ${name} collection with JSON file:`, jsonError);
        }
      }
    } catch (error) {
      console.error(`Error cleaning up ${name} collection:`, error);
    }
  }
}

// Function to clean up duplicates in a single collection
async function cleanupCollectionDuplicates(Model) {
  try {
    // Get all items
    const allItems = await Model.find({});
    
    if (allItems.length === 0) {
      return; // No items to process
    }
    
    // Group items by their lowercase name
    const itemsByLowerName = {};
    
    allItems.forEach(item => {
      const lowerName = item.name.toLowerCase().trim();
      if (!itemsByLowerName[lowerName]) {
        itemsByLowerName[lowerName] = [];
      }
      itemsByLowerName[lowerName].push(item);
    });
    
    // Find duplicates (any items where there are more than one with the same lowercase name)
    const duplicateGroups = Object.values(itemsByLowerName).filter(group => group.length > 1);
    
    // No duplicates found
    if (duplicateGroups.length === 0) {
      return;
    }
    
    let totalDuplicatesRemoved = 0;
    
    // For each group of duplicates, keep the first one and remove the rest
    for (const group of duplicateGroups) {
      // Keep the first item
      const [keeper, ...duplicates] = group;
      
      // Get IDs of duplicates to remove
      const duplicateIds = duplicates.map(dup => dup._id);
      
      // Remove duplicates
      const result = await Model.deleteMany({ _id: { $in: duplicateIds } });
      
      totalDuplicatesRemoved += result.deletedCount;
    }
    
    if (totalDuplicatesRemoved > 0) {
      console.log(`Removed ${totalDuplicatesRemoved} duplicates from ${Model.modelName} collection`);
    }
  } catch (error) {
    console.error(`Error cleaning up duplicates:`, error);
    throw error;
  }
}

// Add a new taxonomy item
app.post('/api/taxonomy/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { name } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
    }
    
    // Validate type parameter
    const validTypes = ['categories', 'brands', 'countries', 'varietals', 'types'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid taxonomy type' });
    }
    
    // Map type to model
    const modelMap = {
      'categories': Category,
      'brands': Brand,
      'countries': Country,
      'varietals': Varietal,
      'types': Type
    };
    
    // Get the model
    const Model = modelMap[type];
    
    // Check if the item already exists (case-insensitive)
    const existingItems = await Model.find({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    
    if (existingItems.length > 0) {
      return res.status(409).json({ error: 'Item already exists' });
    }
    
    // Create and save the new item
    const newItem = new Model({ name: name.trim() });
    await newItem.save();
    
    // Also update the JSON file
    const filePath = path.join(__dirname, 'public', 'taxonomy', `${type}.json`);
    let currentItems = [];
    
    // Read existing items if file exists
    if (fs.existsSync(filePath)) {
      currentItems = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    
    // Add new item to array and remove duplicates
    currentItems.push(name.trim());
    const uniqueItems = removeDuplicates(currentItems);
    
    // Write updated array back to file
    fs.writeFileSync(filePath, JSON.stringify(uniqueItems, null, 2));
    
    res.status(201).json({ 
      success: true, 
      message: `Added new ${type.slice(0, -1)} successfully`,
      item: newItem 
    });
  } catch (error) {
    console.error(`Error adding taxonomy item:`, error);
    res.status(500).json({ error: 'Failed to add taxonomy item', details: error.message });
  }
});

// Delete a taxonomy item (only if no products are using it)
app.delete('/api/taxonomy/:type/:name', async (req, res) => {
  try {
    const { type, name } = req.params;
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
    }
    
    // Validate type parameter
    const validTypes = ['categories', 'brands', 'countries', 'varietals', 'types'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid taxonomy type' });
    }
    
    // Map type to model and product field
    const modelMap = {
      'categories': { model: Category, field: 'category', altField: 'tax:product_cat' },
      'brands': { model: Brand, field: 'brand', altField: 'tax:product_brand' },
      'countries': { model: Country, field: 'country', altField: 'tax:Country' },
      'varietals': { model: Varietal, field: 'varietal', altField: 'tax:wine_varietal' },
      'types': { model: Type, field: 'type', altField: 'tax:product_type' }
    };
    
    // Get model and field info
    const { model: Model, field, altField } = modelMap[type];
    
    // Check if the item exists
    const existingItem = await Model.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (!existingItem) {
      return res.status(404).json({ error: 'Taxonomy item not found' });
    }
    
    // Read products from Excel to check if any are using this taxonomy item
    const products = readProductsFromExcel();
    
    // Check if any products are using this taxonomy item (case-insensitive)
    const itemNameLower = name.toLowerCase().trim();
    const productsUsingItem = products.filter(product => {
      const fieldValue = product[field]?.toLowerCase().trim() || '';
      const altFieldValue = product[altField]?.toLowerCase().trim() || '';
      return fieldValue === itemNameLower || altFieldValue === itemNameLower;
    });
    
    if (productsUsingItem.length > 0) {
      return res.status(409).json({ 
        error: `Cannot delete this ${type.slice(0, -1)} because ${productsUsingItem.length} products are using it`,
        count: productsUsingItem.length,
        products: productsUsingItem.map(p => ({ 
          id: p.id || p.ID, 
          name: p.name || p.post_title
        })).slice(0, 5) // Return info about first 5 products using this item
      });
    }
    
    // Delete the item from the database
    await Model.deleteOne({ _id: existingItem._id });
    
    // Also update the JSON file
    const filePath = path.join(__dirname, 'public', 'taxonomy', `${type}.json`);
    if (fs.existsSync(filePath)) {
      let currentItems = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Filter out the item (case-insensitive)
      currentItems = currentItems.filter(item => 
        item.toLowerCase().trim() !== itemNameLower
      );
      
      // Write updated array back to file
      fs.writeFileSync(filePath, JSON.stringify(currentItems, null, 2));
    }
    
    res.json({ 
      success: true, 
      message: `Successfully deleted ${type.slice(0, -1)}: ${name}`
    });
  } catch (error) {
    console.error(`Error deleting taxonomy item:`, error);
    res.status(500).json({ error: 'Failed to delete taxonomy item', details: error.message });
  }
});

// Get list of backup files
app.get('/api/backups', (req, res) => {
  try {
    // Check if backup folder exists
    if (!fs.existsSync(BACKUP_FOLDER)) {
      return res.json({ backups: [] });
    }
    
    // Get all backup files
    const files = fs.readdirSync(BACKUP_FOLDER)
      .filter(file => file.startsWith('products-backup-'))
      .map(file => {
        const filePath = path.join(BACKUP_FOLDER, file);
        const stats = fs.statSync(filePath);
        
        return {
          name: file,
          path: `/api/backups/download/${file}`,
          size: stats.size,
          created: stats.mtime,
          sizeFormatted: formatFileSize(stats.size)
        };
      })
      .sort((a, b) => b.created - a.created); // Sort newest to oldest
    
    res.json({ backups: files });
  } catch (error) {
    console.error('Error getting backup files:', error);
    res.status(500).json({ error: 'Failed to get backup files' });
  }
});

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

// Download a specific backup file
app.get('/api/backups/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    
    // Validate filename to prevent directory traversal attacks
    if (!filename.match(/^products-backup-[\d-T]+\.xlsx$/)) {
      return res.status(400).json({ error: 'Invalid backup filename' });
    }
    
    const filePath = path.join(BACKUP_FOLDER, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Backup file not found' });
    }
    
    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
    // Create a read stream and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading backup file:', error);
    res.status(500).json({ error: 'Failed to download backup file' });
  }
});

// Admin Authentication Routes
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    // Find admin by username or email
    const admin = await Admin.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    });

    // Check if admin exists
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({ 
        success: false, 
        message: 'Account is inactive. Please contact support.' 
      });
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Update last login time
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    // Return success
    res.json({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// Logout route
app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Check authentication status
app.get('/api/admin/me', authenticateAdmin, (req, res) => {
  res.json({ 
    success: true, 
    admin: {
      id: req.admin._id,
      username: req.admin.username,
      email: req.admin.email,
      lastLogin: req.admin.lastLogin
    }
  });
});

// User Authentication Routes

// Register User
app.post('/api/users/register', validateRegistration, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      const fieldName = existingUser.username === username ? 'username' : 'email';
      const existingValue = fieldName === 'username' ? username : email;
      const errorMessage = `This ${fieldName} "${existingValue}" already exists. Please choose another ${fieldName}.`;
      
      return res.status(400).json({ 
        success: false, 
        message: 'Registration failed - duplicate account information',
        errors: [
          { field: fieldName, message: errorMessage }
        ]
      });
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      password
    });
    
    // Save user to database
    await user.save();
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set cookie with token
    res.cookie('userToken', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    // Remove password from response
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    };
    
    // Send success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
});

// Login User
app.post('/api/users/login', validateLogin, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: username || '' },
        { email: email || username || '' } // If username is provided but no email, try it as email too
      ]
    });
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication failed',
        errors: [
          { field: 'username', message: 'Invalid credentials' }
        ]
      });
    }
    
    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication failed',
        errors: [
          { field: 'password', message: 'Invalid credentials' }
        ]
      });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set cookie with token
    res.cookie('userToken', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    // Remove password from response
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    };
    
    // Send success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
});

// Logout User
app.post('/api/users/logout', (req, res) => {
  try {
    // Clear cookie
    res.clearCookie('userToken');
    
    // Send success response
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging out',
      error: error.message
    });
  }
});

// Check User Authentication
app.get('/api/users/check-auth', authenticateUser, (req, res) => {
  try {
    // User is authenticated if middleware passes
    const userResponse = {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      createdAt: req.user.createdAt
    };
    
    // Send success response
    res.status(200).json({
      success: true,
      message: 'User is authenticated',
      user: userResponse
    });
  } catch (error) {
    console.error('Check auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking authentication',
      error: error.message
    });
  }
});

// Get User Profile
app.get('/api/users/profile', authenticateUser, (req, res) => {
  try {
    // Get user data (excluding password)
    const userResponse = {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      createdAt: req.user.createdAt
    };
    
    // Send success response
    res.status(200).json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user profile',
      error: error.message
    });
  }
});

// Google Login
app.post('/api/users/google-login', async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify Google token
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client('827334450514-oi8vu33pj2f6v2htus8bgl0n4nrma79r.apps.googleusercontent.com');
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '827334450514-oi8vu33pj2f6v2htus8bgl0n4nrma79r.apps.googleusercontent.com'
    });
    
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create a new user
      // Generate a random username based on the name
      const baseUsername = name.toLowerCase().replace(/\s+/g, '');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit number
      const username = `${baseUsername}${randomSuffix}`;
      
      // Generate a random password
      const passwordChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let password = '';
      for (let i = 0; i < 16; i++) {
        password += passwordChars.charAt(Math.floor(Math.random() * passwordChars.length));
      }
      
      user = new User({
        username,
        email,
        password,
        googleId
      });
      
      await user.save();
    } else if (!user.googleId) {
      // Update existing user with Google ID
      user.googleId = googleId;
      await user.save();
    }
    
    // Create JWT token
    const jwtToken = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set cookie with token
    res.cookie('userToken', jwtToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    // Remove password from response
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    };
    
    // Send success response
    res.status(200).json({
      success: true,
      message: 'Google login successful',
      user: userResponse
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error with Google login',
      error: error.message
    });
  }
});

// Cart API Endpoints
// Get user's cart
app.get('/api/cart', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the cart for this user
    let cart = await Cart.findOne({ userId });

    // If no cart exists yet, return an empty cart
    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [], userId }
      });
    }

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
});

// Update cart (replace entire cart)
app.post('/api/cart', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid cart data. Items should be an array.'
      });
    }

    // Find and update cart or create a new one
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items });
    } else {
      cart.items = items;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    });
  }
});

// Add item to cart
app.post('/api/cart/items', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const item = req.body;

    if (!item.productId || !item.name || !item.price || !item.quantity) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item data. Required fields: productId, name, price, quantity.'
      });
    }

    // Find cart or create a new one
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [item] });
    } else {
      // Check if item already exists
      const existingItemIndex = cart.items.findIndex(i => i.productId === item.productId);
      
      if (existingItemIndex !== -1) {
        // Update existing item quantity
        cart.items[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item to cart
        cart.items.push(item);
      }
    }

    await cart.save();

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
});

// Update cart item quantity
app.put('/api/cart/items/:productId', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quantity. Must be greater than 0.'
      });
    }

    // Find the cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find the item
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Update the quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message
    });
  }
});

// Remove item from cart
app.delete('/api/cart/items/:productId', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    // Find the cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Remove the item
    cart.items = cart.items.filter(item => item.productId !== productId);
    await cart.save();

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
});

// Clear cart
app.delete('/api/cart', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(200).json({
        success: true,
        message: 'Cart is already empty'
      });
    }

    // Clear the items
    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
});

// Wishlist API Endpoints
// Get user's wishlist
app.get('/api/wishlist', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the wishlist for this user
    let wishlist = await Wishlist.findOne({ userId });

    // If no wishlist exists yet, return an empty wishlist
    if (!wishlist) {
      return res.status(200).json({
        success: true,
        wishlist: { items: [], userId }
      });
    }

    res.status(200).json({
      success: true,
      wishlist
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist',
      error: error.message
    });
  }
});

// Update wishlist (replace entire wishlist)
app.post('/api/wishlist', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wishlist data. Items should be an array.'
      });
    }

    // Find and update wishlist or create a new one
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items });
    } else {
      wishlist.items = items;
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      wishlist
    });
  } catch (error) {
    console.error('Error updating wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating wishlist',
      error: error.message
    });
  }
});

// Add item to wishlist
app.post('/api/wishlist/items', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const item = req.body;

    if (!item.productId || !item.name || !item.price) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item data. Required fields: productId, name, price.'
      });
    }

    // Find wishlist or create a new one
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [item] });
    } else {
      // Check if item already exists
      const existingItemIndex = wishlist.items.findIndex(i => i.productId === item.productId);
      
      if (existingItemIndex === -1) {
        // Only add if not already in wishlist
        wishlist.items.push(item);
      } else {
        // Item already exists, return success without modifying
        return res.status(200).json({
          success: true,
          message: 'Item already in wishlist',
          wishlist
        });
      }
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      wishlist
    });
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to wishlist',
      error: error.message
    });
  }
});

// Remove item from wishlist
app.delete('/api/wishlist/items/:productId', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    // Find the wishlist
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    // Remove the item
    wishlist.items = wishlist.items.filter(item => item.productId !== productId);
    await wishlist.save();

    res.status(200).json({
      success: true,
      wishlist
    });
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from wishlist',
      error: error.message
    });
  }
});

// Clear wishlist
app.delete('/api/wishlist', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the wishlist
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(200).json({
        success: true,
        message: 'Wishlist is already empty'
      });
    }

    // Clear the items
    wishlist.items = [];
    await wishlist.save();

    res.status(200).json({
      success: true,
      wishlist
    });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing wishlist',
      error: error.message
    });
  }
});

// Order API Endpoints
// Create a new order (works for both logged-in and guest users)
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    
    // Validate required fields
    if (!orderData.items || !orderData.items.length) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    if (!orderData.customerInfo) {
      return res.status(400).json({
        success: false,
        message: 'Customer information is required'
      });
    }

    // Set userType based on authentication
    if (req.cookies && req.cookies.userToken) {
      try {
        // Verify token
        const decoded = jwt.verify(req.cookies.userToken, JWT_SECRET);
        // Set as registered user
        orderData.userType = 'registered';
        orderData.userId = decoded.id;
      } catch (error) {
        // Token invalid, treat as guest
        orderData.userType = 'guest';
      }
    } else {
      // No token, treat as guest
      orderData.userType = 'guest';
    }

    // Create the order
    const order = new Order(orderData);
    await order.save();

    // If a discount code was used, increment its usage count
    if (orderData.discountCode) {
      const discountCode = await DiscountCode.findOne({ 
        code: orderData.discountCode.trim().toUpperCase() 
      });
      
      if (discountCode) {
        discountCode.currentUses += 1;
        await discountCode.save();
        
        // Set the discount percentage based on the discount code type
        if (discountCode.discountType === 'percentage') {
          order.discountPercentage = discountCode.discountValue;
        } else {
          // For fixed amount discounts, calculate the percentage
          order.discountPercentage = (orderData.discount / orderData.subtotal) * 100;
        }
        await order.save();
      }
    }

    // Create notification for registered users
    if (orderData.userType === 'registered' && orderData.userId) {
      const notification = new Notification({
        userId: orderData.userId,
        title: 'Order Placed',
        message: `Your order #${order.orderId} has been placed successfully.`,
        type: 'order_placed',
        orderId: order.orderId,
        orderStatus: order.status
      });
      await notification.save();
    }

    // Create admin notification for any order
    const adminNotification = new AdminNotification({
      title: 'New Order Placed',
      message: `A new order #${order.orderId} has been placed by ${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}.`,
      type: 'order_placed',
      orderId: order.orderId,
      orderStatus: order.status
    });
    await adminNotification.save();

    // Send confirmation email
    try {
      await sendOrderConfirmation(order);
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Continue with the order process even if email fails
    }

    // Clear the user's cart if they are authenticated
    if (orderData.userType === 'registered' && orderData.userId) {
      try {
        await Cart.findOneAndUpdate(
          { userId: orderData.userId },
          { items: [] }
        );
      } catch (cartError) {
        console.error('Failed to clear user cart after order:', cartError);
        // Continue with the order process even if cart clearing fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        orderId: order.orderId,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// Get order by tracking ID (no authentication required)
app.get('/api/orders/track/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Return limited information for security
    const orderInfo = {
      orderId: order.orderId,
      customerInfo: {
        firstName: order.customerInfo.firstName,
        lastName: order.customerInfo.lastName,
        email: order.customerInfo.email
      },
      status: order.status,
      statusHistory: order.statusHistory,
      createdAt: order.createdAt,
      shippingMethod: order.shippingMethod,
      total: order.total
    };
    
    res.status(200).json({
      success: true,
      order: orderInfo
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking order',
      error: error.message
    });
  }
});

// Get user's orders (requires authentication)
app.get('/api/orders', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// Get order details (requires authentication and must be the order owner)
app.get('/api/orders/:orderId', authenticateUser, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if the user is the owner of the order
    if (order.userType === 'registered' && order.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this order'
      });
    }
    
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order details',
      error: error.message
    });
  }
});

// Update order status (admin only)
app.put('/api/admin/orders/:orderId/status', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Update order status
    const previousStatus = order.status;
    order.status = status;
    
    // Add note to status history if provided
    if (order.isModified('status')) {
      const statusHistoryEntry = {
        status,
        date: new Date()
      };
      
      if (note) {
        statusHistoryEntry.note = note;
      } else {
        statusHistoryEntry.note = `Status changed from ${previousStatus} to ${status} by admin`;
      }
      
      order.statusHistory.push(statusHistoryEntry);
    }
    
    // Set flag to skip automatic history update
    order._skipHistoryUpdate = true;
    await order.save();
    
    // Create notification for the user if registered
    if (order.userType === 'registered' && order.userId) {
      const statusVerb = status === 'delivered' ? 'has been' : 'is now';
      
      const notification = new Notification({
        userId: order.userId,
        title: `Order Status Updated`,
        message: `Your order #${order.orderId} ${statusVerb} ${status}.`,
        type: 'order_status_change',
        orderId: order.orderId,
        orderStatus: status
      });
      
      await notification.save();
    }

    // Create admin notification for status change
    const adminNotification = new AdminNotification({
      title: 'Order Status Changed',
      message: `Order #${order.orderId} status changed from ${previousStatus} to ${status}.`,
      type: 'order_status_change',
      orderId: order.orderId,
      orderStatus: status
    });
    
    await adminNotification.save();
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order: {
        orderId: order.orderId,
        status: order.status,
        previousStatus,
        statusHistory: order.statusHistory
      }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

// Add admin order endpoints before the server listen statement

// Get all orders for admin
app.get('/api/admin/orders', authenticateAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// Get single order details for admin
app.get('/api/admin/orders/:orderId', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order details',
      error: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Copy Excel file from client public folder if it doesn't exist
  const clientExcelPath = path.join(__dirname, '..', 'client', 'public', 'products.xlsx');
  if (fs.existsSync(clientExcelPath) && !fs.existsSync(EXCEL_FILE_PATH)) {
    fs.copyFileSync(clientExcelPath, EXCEL_FILE_PATH);
    console.log('Copied Excel file from client public folder');
  }
});

// Add notification routes before the server listen statement

// Get user notifications
app.get('/api/notifications', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(100);
    
    // Count unread notifications
    const unreadCount = await Notification.countDocuments({ 
      userId, 
      read: false 
    });
    
    res.status(200).json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
});

// Mark notification as read
app.put('/api/notifications/:id/read', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;
    
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    // Check if the user owns this notification
    if (notification.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this notification'
      });
    }
    
    notification.read = true;
    await notification.save();
    
    // Count remaining unread notifications
    const unreadCount = await Notification.countDocuments({ 
      userId, 
      read: false 
    });
    
    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      unreadCount
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notification',
      error: error.message
    });
  }
});

// Mark all notifications as read
app.put('/api/notifications/read-all', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    
    await Notification.updateMany(
      { userId, read: false },
      { $set: { read: true } }
    );
    
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      unreadCount: 0
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking all notifications as read',
      error: error.message
    });
  }
});

// Get admin notifications
app.get('/api/admin/notifications', authenticateAdmin, async (req, res) => {
  try {
    const notifications = await AdminNotification.find()
      .sort({ createdAt: -1 })
      .limit(100);
    
    // Count unread notifications
    const unreadCount = await AdminNotification.countDocuments({ read: false });
    
    res.status(200).json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin notifications',
      error: error.message
    });
  }
});

// Mark admin notification as read
app.put('/api/admin/notifications/:id/read', authenticateAdmin, async (req, res) => {
  try {
    const notificationId = req.params.id;
    
    const notification = await AdminNotification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    notification.read = true;
    await notification.save();
    
    // Count remaining unread notifications
    const unreadCount = await AdminNotification.countDocuments({ read: false });
    
    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      unreadCount
    });
  } catch (error) {
    console.error('Error updating admin notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating admin notification',
      error: error.message
    });
  }
});

// Mark all admin notifications as read
app.put('/api/admin/notifications/read-all', authenticateAdmin, async (req, res) => {
  try {
    await AdminNotification.updateMany(
      { read: false },
      { $set: { read: true } }
    );
    
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      unreadCount: 0
    });
  } catch (error) {
    console.error('Error marking all admin notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking all admin notifications as read',
      error: error.message
    });
  }
});

// Discount Code API Endpoints

// Get all discount codes (admin only)
app.get('/api/admin/discount-codes', authenticateAdmin, async (req, res) => {
  try {
    const discountCodes = await DiscountCode.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      discountCodes
    });
  } catch (error) {
    console.error('Error fetching discount codes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching discount codes',
      error: error.message
    });
  }
});

// Get single discount code (admin only)
app.get('/api/admin/discount-codes/:id', authenticateAdmin, async (req, res) => {
  try {
    const discountCode = await DiscountCode.findById(req.params.id);
    
    if (!discountCode) {
      return res.status(404).json({
        success: false,
        message: 'Discount code not found'
      });
    }
    
    res.status(200).json({
      success: true,
      discountCode
    });
  } catch (error) {
    console.error('Error fetching discount code:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching discount code',
      error: error.message
    });
  }
});

// Create a new discount code (admin only)
app.post('/api/admin/discount-codes', authenticateAdmin, async (req, res) => {
  try {
    const {
      code,
      type,
      description,
      discountType,
      discountValue,
      maxUses,
      minPurchaseAmount,
      startDate,
      endDate,
      isActive
    } = req.body;
    
    // Validate required fields
    if (!code || !description || !discountType || discountValue === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing'
      });
    }
    
    // Check if code already exists (case insensitive)
    const existingCode = await DiscountCode.findOne({ 
      code: code.trim().toUpperCase() 
    });
    
    if (existingCode) {
      return res.status(409).json({
        success: false,
        message: 'Discount code already exists'
      });
    }
    
    // Create new discount code
    const discountCode = new DiscountCode({
      code: code.trim().toUpperCase(),
      type: type || 'discount',
      description,
      discountType,
      discountValue,
      maxUses: maxUses !== undefined ? maxUses : null,
      minPurchaseAmount: minPurchaseAmount || 0,
      startDate: startDate || new Date(),
      endDate: endDate || null,
      isActive: isActive !== undefined ? isActive : true
    });
    
    await discountCode.save();
    
    res.status(201).json({
      success: true,
      message: 'Discount code created successfully',
      discountCode
    });
  } catch (error) {
    console.error('Error creating discount code:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating discount code',
      error: error.message
    });
  }
});

// Update a discount code (admin only)
app.put('/api/admin/discount-codes/:id', authenticateAdmin, async (req, res) => {
  try {
    const {
      code,
      type,
      description,
      discountType,
      discountValue,
      maxUses,
      minPurchaseAmount,
      startDate,
      endDate,
      isActive,
      currentUses
    } = req.body;
    
    const discountCode = await DiscountCode.findById(req.params.id);
    
    if (!discountCode) {
      return res.status(404).json({
        success: false,
        message: 'Discount code not found'
      });
    }
    
    // If code is being changed, check if new code already exists
    if (code && code.trim().toUpperCase() !== discountCode.code) {
      const existingCode = await DiscountCode.findOne({ 
        code: code.trim().toUpperCase(),
        _id: { $ne: req.params.id }
      });
      
      if (existingCode) {
        return res.status(409).json({
          success: false,
          message: 'Discount code already exists'
        });
      }
      
      discountCode.code = code.trim().toUpperCase();
    }
    
    // Update fields if provided
    if (type !== undefined) discountCode.type = type;
    if (description) discountCode.description = description;
    if (discountType) discountCode.discountType = discountType;
    if (discountValue !== undefined) discountCode.discountValue = discountValue;
    if (maxUses !== undefined) discountCode.maxUses = maxUses;
    if (currentUses !== undefined) discountCode.currentUses = currentUses;
    if (minPurchaseAmount !== undefined) discountCode.minPurchaseAmount = minPurchaseAmount;
    if (startDate) discountCode.startDate = startDate;
    if (endDate !== undefined) discountCode.endDate = endDate;
    if (isActive !== undefined) discountCode.isActive = isActive;
    
    await discountCode.save();
    
    res.status(200).json({
      success: true,
      message: 'Discount code updated successfully',
      discountCode
    });
  } catch (error) {
    console.error('Error updating discount code:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating discount code',
      error: error.message
    });
  }
});

// Delete a discount code (admin only)
app.delete('/api/admin/discount-codes/:id', authenticateAdmin, async (req, res) => {
  try {
    const discountCode = await DiscountCode.findById(req.params.id);
    
    if (!discountCode) {
      return res.status(404).json({
        success: false,
        message: 'Discount code not found'
      });
    }
    
    await DiscountCode.deleteOne({ _id: req.params.id });
    
    res.status(200).json({
      success: true,
      message: 'Discount code deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting discount code:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting discount code',
      error: error.message
    });
  }
});

// Validate a discount code (for users)
app.post('/api/discount-codes/validate', async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Discount code is required'
      });
    }
    
    const discountCode = await DiscountCode.findOne({ 
      code: code.trim().toUpperCase() 
    });
    
    if (!discountCode) {
      return res.status(404).json({
        success: false,
        message: 'Invalid discount code'
      });
    }
    
    // Check if code is valid
    if (!discountCode.isValid()) {
      let message = 'This discount code is no longer valid';
      
      if (discountCode.maxUses !== null && discountCode.currentUses >= discountCode.maxUses) {
        message = 'This discount code has reached its maximum number of uses';
      } else if (discountCode.endDate && new Date() > discountCode.endDate) {
        message = 'This discount code has expired';
      } else if (discountCode.startDate && new Date() < discountCode.startDate) {
        message = 'This discount code is not yet active';
      }
      
      return res.status(400).json({
        success: false,
        message
      });
    }
    
    // Check minimum purchase amount
    if (subtotal && discountCode.minPurchaseAmount > 0 && subtotal < discountCode.minPurchaseAmount) {
      return res.status(400).json({
        success: false,
        message: `This discount code requires a minimum purchase of $${discountCode.minPurchaseAmount.toFixed(2)}`
      });
    }
    
    // Calculate discount amount
    let discountAmount = 0;
    if (subtotal) {
      if (discountCode.discountType === 'percentage') {
        discountAmount = (subtotal * discountCode.discountValue) / 100;
      } else {
        discountAmount = discountCode.discountValue;
        // Don't allow discount to exceed subtotal
        if (discountAmount > subtotal) {
          discountAmount = subtotal;
        }
      }
    }
    
    res.status(200).json({
      success: true,
      discountCode: {
        _id: discountCode._id,
        code: discountCode.code,
        type: discountCode.type,
        discountType: discountCode.discountType,
        discountValue: discountCode.discountValue,
        minPurchaseAmount: discountCode.minPurchaseAmount
      },
      discountAmount: subtotal ? discountAmount : undefined
    });
  } catch (error) {
    console.error('Error validating discount code:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating discount code',
      error: error.message
    });
  }
}); 