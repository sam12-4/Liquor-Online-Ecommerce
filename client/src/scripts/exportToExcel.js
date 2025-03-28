import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { products } from '../data/products.js';

// Get current file path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new workbook
const workbook = XLSX.utils.book_new();

// Convert products array to worksheet
const worksheet = XLSX.utils.json_to_sheet(products);

// Add the worksheet to the workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '../data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the workbook to a file
const outputFile = path.join(outputDir, 'products.xlsx');
XLSX.writeFile(workbook, outputFile);

console.log(`Excel file created successfully at: ${outputFile}`); 