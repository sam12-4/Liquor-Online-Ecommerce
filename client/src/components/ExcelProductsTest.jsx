import React, { useEffect, useState } from 'react';
import { getProducts } from '../data/productLoader';

const ExcelProductsTest = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const loadedProducts = await getProducts();
        setProducts(loadedProducts);
        setLoading(false);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products from server');
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products Loaded from Excel</h1>
      <p className="mb-4">Total Products: {products.length}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product, index) => (
          <div key={index} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{product.name || product.post_title}</h2>
            <p className="text-gray-600">
              {product.category || product['tax:product_cat']} - 
              {product.type || product['tax:type']}
            </p>
            <p className="text-green-600 font-bold">
              ${product.price || product.regular_price}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {(product.description || product.post_excerpt || '').substring(0, 100)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExcelProductsTest; 