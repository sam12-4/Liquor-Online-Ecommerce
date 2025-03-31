import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useUserAuth } from '../contexts/UserAuthContext';
import { AUTH_EVENTS, authEvents } from '../contexts/UserAuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const API_URL = 'http://localhost:5000/api';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useUserAuth();

  // Listen for authentication events
  useEffect(() => {
    // Handle login event
    const handleLogin = () => {
      fetchUserCart();
    };

    // Handle logout event
    const handleLogout = () => {
      // Save current cart to localStorage before clearing
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    };

    // Register event listeners
    const loginCleanup = authEvents.on(AUTH_EVENTS.LOGIN, handleLogin);
    const logoutCleanup = authEvents.on(AUTH_EVENTS.LOGOUT, handleLogout);

    // Clean up event listeners
    return () => {
      loginCleanup();
      logoutCleanup();
    };
  }, [cartItems]);

  // Fetch cart from API if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserCart();
    } else {
      // Load cart from localStorage when not authenticated
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCartItems([]);
      }
    }
  }, [isAuthenticated]);

  // Update cart summary whenever cartItems changes
  useEffect(() => {
    try {
      // Only save to localStorage if not authenticated
      if (!isAuthenticated) {
        localStorage.setItem('cart', JSON.stringify(cartItems));
      }
      
      // Update cart count and total
      const count = cartItems.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
      
      const total = cartItems.reduce(
        (sum, item) => sum + (item.salePrice || item.price) * item.quantity, 
        0
      );
      setCartTotal(total);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  }, [cartItems, isAuthenticated]);

  // Sync local cart with database when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      // Check if we have items in local storage to sync
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const localItems = JSON.parse(savedCart);
        if (localItems.length > 0) {
          // Sync local cart with user's cart in the database
          syncLocalCartWithDatabase(localItems);
        } else {
          // If local cart is empty, fetch user's cart from database
          fetchUserCart();
        }
      } else {
        // If no local cart, fetch user's cart from database
        fetchUserCart();
      }
    }
  }, [isAuthenticated]);

  // Fetch cart from the database
  const fetchUserCart = async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      
      if (data.success && data.cart) {
        setCartItems(data.cart.items || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load your cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Sync local cart with database when user logs in
  const syncLocalCartWithDatabase = async (localItems) => {
    if (!isAuthenticated || !localItems.length) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ items: localItems })
      });

      if (!response.ok) {
        throw new Error('Failed to sync cart');
      }

      const data = await response.json();
      
      if (data.success && data.cart) {
        setCartItems(data.cart.items || []);
        // Clear localStorage cart after successful sync
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
      toast.error('Failed to sync your cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Save cart to database
  const saveCartToDatabase = async (items) => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ items })
      });

      if (!response.ok) {
        throw new Error('Failed to save cart');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving cart:', error);
      toast.error('Failed to update your cart');
      return null;
    }
  };

  const addToCart = async (product, quantity = 1) => {
    // Validate stock before adding to cart
    if (!product.stock || product.stock <= 0) {
      toast.error(`Sorry, ${product.name} is out of stock.`);
      return;
    }

    // Update state first for immediate UI feedback
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.productId === product.id);
      
      let updatedItems;
      if (existingItemIndex !== -1) {
        // Calculate new quantity
        const currentQuantity = prevItems[existingItemIndex].quantity;
        const newQuantity = currentQuantity + quantity;
        
        // Check if new quantity exceeds available stock
        if (newQuantity > product.stock) {
          toast.warning(`Cannot add more than ${product.stock} units of ${product.name} to cart.`);
          
          // Update to max available stock if currently below
          if (currentQuantity < product.stock) {
            updatedItems = [...prevItems];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: product.stock
            };
            toast.info(`Updated ${product.name} quantity to maximum available stock (${product.stock}).`);
          } else {
            // No change if already at max
            return prevItems;
          }
        } else {
          // Update quantity of existing item (within stock limits)
          updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: newQuantity
          };
          toast.success(`Updated ${product.name} quantity in cart`);
        }
      } else {
        // Ensure we don't add more than available stock
        const itemQuantity = Math.min(quantity, product.stock);
        
        // Add new item to cart
        const newItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          salePrice: product.salePrice,
          image: product.image,
          quantity: itemQuantity,
          category: product.category,
          type: product.type,
          country: product.country,
          brand: product.brand,
          varietal: product.varietal,
          size: product.size,
          abv: product.abv,
          stock: product.stock // Store stock info for later validation
        };
        updatedItems = [...prevItems, newItem];
        
        if (itemQuantity < quantity) {
          toast.warning(`Added ${itemQuantity} of ${product.name} to cart (maximum available stock).`);
        } else {
          toast.success(`Added ${product.name} to cart`);
        }
      }
      
      // If user is authenticated, save to database
      if (isAuthenticated) {
        fetch(`${API_URL}/cart/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            productId: product.id,
            name: product.name,
            price: product.price,
            salePrice: product.salePrice,
            image: product.image,
            quantity: Math.min(quantity, product.stock), // Ensure quantity doesn't exceed stock
            category: product.category,
            type: product.type,
            country: product.country,
            brand: product.brand,
            varietal: product.varietal,
            size: product.size,
            abv: product.abv
          })
        }).catch(error => {
          console.error('Error adding item to cart:', error);
          toast.error('Failed to update your cart');
        });
      }
      
      return updatedItems;
    });
  };

  const updateCartItemQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    // Update state first for immediate UI feedback
    setCartItems(prevItems => {
      // Find the current item to check its stock
      const currentItem = prevItems.find(item => item.productId === productId);
      
      if (!currentItem) return prevItems;
      
      // Check if requested quantity exceeds stock
      if (currentItem.stock && quantity > currentItem.stock) {
        toast.warning(`Cannot add more than ${currentItem.stock} units of ${currentItem.name} to cart.`);
        
        // Update to maximum available stock
        const updatedItems = prevItems.map(item => 
          item.productId === productId ? { ...item, quantity: currentItem.stock } : item
        );
        
        // If user is authenticated, save to database
        if (isAuthenticated) {
          fetch(`${API_URL}/cart/items/${productId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ quantity: currentItem.stock })
          }).catch(error => {
            console.error('Error updating cart item:', error);
            toast.error('Failed to update cart item');
          });
        }
        
        return updatedItems;
      }
      
      // Normal update (within stock limits)
      const updatedItems = prevItems.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      );
      
      // If user is authenticated, save to database
      if (isAuthenticated) {
        fetch(`${API_URL}/cart/items/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ quantity })
        }).catch(error => {
          console.error('Error updating cart item:', error);
          toast.error('Failed to update cart item');
        });
      }
      
      return updatedItems;
    });
  };

  const removeFromCart = async (productId) => {
    // Update state first for immediate UI feedback
    setCartItems(prevItems => {
      const removedItem = prevItems.find(item => item.productId === productId);
      const updatedItems = prevItems.filter(item => item.productId !== productId);
      
      if (removedItem) {
        toast.info(`Removed ${removedItem.name} from cart`);
        
        // If user is authenticated, remove from database
        if (isAuthenticated) {
          fetch(`${API_URL}/cart/items/${productId}`, {
            method: 'DELETE',
            credentials: 'include'
          }).catch(error => {
            console.error('Error removing item from cart:', error);
            toast.error('Failed to remove item from cart');
          });
        }
      }
      
      return updatedItems;
    });
  };

  const clearCart = async () => {
    // Update state first for immediate UI feedback
    setCartItems([]);
    toast.info('Cart cleared');
    
    // If user is authenticated, clear cart in database
    if (isAuthenticated) {
      try {
        const response = await fetch(`${API_URL}/cart`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to clear cart');
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
        toast.error('Failed to clear your cart');
      }
    }
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.productId === productId);
  };

  const getCartItem = (productId) => {
    return cartItems.find(item => item.productId === productId);
  };

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    isLoading,
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
