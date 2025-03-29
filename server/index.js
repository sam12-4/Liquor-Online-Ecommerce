const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { promisify } = require('util');
const copyFile = promisify(fs.copyFile);
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

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
  } catch (error) {
    console.error('Error creating backup:', error);
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
      const products = XLSX.utils.sheet_to_json(worksheet);
      
      if (!Array.isArray(products)) {
        throw new Error('Invalid Excel format');
      }
      
      console.log(`Uploaded file contains ${products.length} products`);
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
    
    // Copy the file to replace the products.xlsx
    fs.copyFileSync(tempFilePath, EXCEL_FILE_PATH);
    
    // Clean up the temp file
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    
    // Read the new products to confirm
    const products = readProductsFromExcel();
    
    res.json({ 
      success: true, 
      message: 'Products file replaced successfully',
      productCount: products.length
    });
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