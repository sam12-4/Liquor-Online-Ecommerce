import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useUserAuth } from '../contexts/UserAuthContext';
import { AUTH_EVENTS, authEvents } from '../contexts/UserAuthContext';

const API_URL = 'http://localhost:5000/api';

// Initial wishlist state
const initialState = {
  items: [],
  totalItems: 0
};

// Actions for the wishlist
export const WISHLIST_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_WISHLIST: 'CLEAR_WISHLIST'
};

// Reducer function to handle wishlist actions
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case WISHLIST_ACTIONS.ADD_ITEM: {
      // Check if item already exists in wishlist
      if (state.items.some(item => item.id === action.payload.id)) {
        return state; // Item already in wishlist, don't add again
      }

      // Add new item to wishlist
      return {
        ...state,
        items: [...state.items, action.payload],
        totalItems: state.totalItems + 1
      };
    }

    case WISHLIST_ACTIONS.REMOVE_ITEM: {
      const filteredItems = state.items.filter(item => item.id !== action.payload);

      return {
        ...state,
        items: filteredItems,
        totalItems: filteredItems.length
      };
    }

    case WISHLIST_ACTIONS.CLEAR_WISHLIST:
      return initialState;

    default:
      return state;
  }
};

// Create context
const WishlistContext = createContext();

// Provider component
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useUserAuth();

  // Listen for authentication events
  useEffect(() => {
    // Handle login event
    const handleLogin = () => {
      fetchUserWishlist();
    };

    // Handle logout event
    const handleLogout = () => {
      // Save current wishlist to localStorage before clearing
      try {
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
      } catch (error) {
        console.error('Error saving wishlist to localStorage:', error);
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
  }, [wishlistItems]);

  // Load wishlist based on authentication status
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserWishlist();
    } else {
      // Load wishlist from localStorage when not authenticated
      try {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          setWishlistItems(JSON.parse(savedWishlist));
        }
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
        setWishlistItems([]);
      }
    }
  }, [isAuthenticated]);

  // Update localStorage whenever wishlistItems changes (only for non-authenticated users)
  useEffect(() => {
    try {
      // Only save to localStorage if not authenticated
      if (!isAuthenticated) {
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
      }
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlistItems, isAuthenticated]);

  // Sync local wishlist with database when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      // Check if we have items in local storage to sync
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        const localItems = JSON.parse(savedWishlist);
        if (localItems.length > 0) {
          // Sync local wishlist with user's wishlist in the database
          syncLocalWishlistWithDatabase(localItems);
        } else {
          // If local wishlist is empty, fetch user's wishlist from database
          fetchUserWishlist();
        }
      } else {
        // If no local wishlist, fetch user's wishlist from database
        fetchUserWishlist();
      }
    }
  }, [isAuthenticated]);

  // Fetch wishlist from the database
  const fetchUserWishlist = async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/wishlist`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const data = await response.json();
      
      if (data.success && data.wishlist) {
        setWishlistItems(data.wishlist.items || []);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load your wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  // Sync local wishlist with database when user logs in
  const syncLocalWishlistWithDatabase = async (localItems) => {
    if (!isAuthenticated || !localItems.length) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ items: localItems })
      });

      if (!response.ok) {
        throw new Error('Failed to sync wishlist');
      }

      const data = await response.json();
      
      if (data.success && data.wishlist) {
        setWishlistItems(data.wishlist.items || []);
        // Clear localStorage wishlist after successful sync
        localStorage.removeItem('wishlist');
      }
    } catch (error) {
      console.error('Error syncing wishlist:', error);
      toast.error('Failed to sync your wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    // Update state first for immediate UI feedback
    setWishlistItems(prevItems => {
      // Check if item already exists in wishlist
      if (prevItems.some(item => item.productId === product.id)) {
        toast.info(`${product.name} is already in your wishlist`);
        return prevItems;
      } else {
        // Prepare the wishlist item
        const newItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          salePrice: product.salePrice,
          image: product.image,
          category: product.category,
          type: product.type,
          country: product.country,
          brand: product.brand,
          varietal: product.varietal,
          size: product.size,
          abv: product.abv
        };
        
        // If user is authenticated, save to database
        if (isAuthenticated) {
          fetch(`${API_URL}/wishlist/items`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(newItem)
          }).catch(error => {
            console.error('Error adding item to wishlist:', error);
            toast.error('Failed to update your wishlist');
          });
        }
        
        toast.success(`Added ${product.name} to wishlist`);
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromWishlist = async (productId) => {
    // Update state first for immediate UI feedback
    setWishlistItems(prevItems => {
      const removedItem = prevItems.find(item => item.productId === productId);
      const updatedItems = prevItems.filter(item => item.productId !== productId);
      
      if (removedItem) {
        toast.info(`Removed ${removedItem.name} from wishlist`);
        
        // If user is authenticated, remove from database
        if (isAuthenticated) {
          fetch(`${API_URL}/wishlist/items/${productId}`, {
            method: 'DELETE',
            credentials: 'include'
          }).catch(error => {
            console.error('Error removing item from wishlist:', error);
            toast.error('Failed to remove item from wishlist');
          });
        }
      }
      
      return updatedItems;
    });
  };

  const clearWishlist = async () => {
    // Update state first for immediate UI feedback
    setWishlistItems([]);
    toast.info('Wishlist cleared');
    
    // If user is authenticated, clear wishlist in database
    if (isAuthenticated) {
      try {
        const response = await fetch(`${API_URL}/wishlist`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to clear wishlist');
        }
      } catch (error) {
        console.error('Error clearing wishlist:', error);
        toast.error('Failed to clear your wishlist');
      }
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.productId === productId);
  };

  const value = {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

// Custom hook to use the wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
