import * as XLSX from 'xlsx';

/**
 * Reads an Excel file and returns the data as JSON
 * @param {File} file - The Excel file to read
 * @returns {Promise<Array>} - The data from the Excel file
 */
export async function readExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Fetches and reads an Excel file from a URL
 * @param {string} url - The URL of the Excel file
 * @returns {Promise<Array>} - The data from the Excel file
 */
export async function fetchExcelFile(url) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    
    // Get first worksheet
    const worksheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[worksheetName];
    
    // Convert to JSON
    return XLSX.utils.sheet_to_json(worksheet);
  } catch (error) {
    console.error('Error fetching Excel file:', error);
    throw error;
  }
} 