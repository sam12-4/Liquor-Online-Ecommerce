import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      setCartItems([]);
    }
  }, []);

  // Update localStorage and cart summary whenever cartItems changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
      
      // Update cart count and total
      const count = cartItems.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
      
      const total = cartItems.reduce(
        (sum, item) => sum + (item.salePrice || item.price) * item.quantity, 
        0
      );
      setCartTotal(total);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        toast.success(`Updated ${product.name} quantity in cart`);
        return updatedItems;
      } else {
        // Add new item to cart
        toast.success(`Added ${product.name} to cart`);
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const updateCartItemQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const removedItem = prevItems.find(item => item.id === productId);
      if (removedItem) {
        toast.info(`Removed ${removedItem.name} from cart`);
      }
      return prevItems.filter(item => item.id !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info('Cart cleared');
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const getCartItem = (productId) => {
    return cartItems.find(item => item.id === productId);
  };

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    isInCart,
    getCartItem
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
