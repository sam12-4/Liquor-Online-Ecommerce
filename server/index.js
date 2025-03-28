const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { promisify } = require('util');
const copyFile = promisify(fs.copyFile);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

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
    
    // Get current products
    const products = readProductsFromExcel();
    
    // Find the product index
    const index = products.findIndex(p => (p.id === productId || p.ID === productId));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Update product
    const updatedProduct = {
      ...products[index],
      ...productData,
      date_modified: new Date().toISOString()
    };
    
    products[index] = updatedProduct;
    
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
    
    // Get current products
    const products = readProductsFromExcel();
    
    // Filter out the product
    const filteredProducts = products.filter(p => p.id !== productId && p.ID !== productId);
    
    if (filteredProducts.length === products.length) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
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