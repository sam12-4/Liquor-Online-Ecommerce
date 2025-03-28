# Liquor Online Store with Admin Dashboard

A full-featured online store with product management via Excel integration.

## Server Setup for Excel File Management

This project now includes a server component that handles Excel file operations. This ensures all product data changes are centralized and consistent across the application.

### Features

- Centralized Excel file management through an Express server
- API endpoints for CRUD operations on products
- Automatic backups of the Excel file before changes
- Consistent data access across the entire application

### Setup Instructions

1. **Install Dependencies**

   ```bash
   # Install all dependencies (root, client, and server)
   npm run install-all
   
   # Alternatively, if you just need to set up the server
   npm run setup-server
   ```

2. **Copy Excel File to Server**

   ```bash
   # Copy the products.xlsx file from client/public to server/public
   npm run copy-excel
   ```

3. **Start Development Environment**

   ```bash
   # Start both client and server in development mode
   npm run dev
   
   # Or start them separately
   npm run client
   npm run server
   ```

### How It Works

1. The server runs on port 5000 and manages the Excel file in `server/public/products.xlsx`
2. The client communicates with the server API endpoints at `http://localhost:5000/api`
3. When products are added, updated, or deleted, the server updates the Excel file
4. All product changes are immediately visible across the application
5. Backups are created automatically in `server/backups` before any changes are made

### Available API Endpoints

- `GET /api/products` - Get all products
- `POST /api/products` - Add a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `GET /api/products/structure` - Get the Excel file structure (fields, types, etc.)

### Troubleshooting

- If you encounter connection issues, make sure both the client and server are running
- Check that the Excel file exists in `server/public/products.xlsx`
- Look for error messages in both client and server console outputs 