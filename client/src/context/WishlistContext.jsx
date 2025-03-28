import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

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

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
      setWishlistItems([]);
    }
  }, []);

  // Update localStorage whenever wishlistItems changes
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems(prevItems => {
      // Check if item already exists in wishlist
      if (prevItems.some(item => item.id === product.id)) {
        toast.info(`${product.name} is already in your wishlist`);
        return prevItems;
      } else {
        // Add new item to wishlist
        toast.success(`Added ${product.name} to wishlist`);
        return [...prevItems, product];
      }
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prevItems => {
      const removedItem = prevItems.find(item => item.id === productId);
      if (removedItem) {
        toast.info(`Removed ${removedItem.name} from wishlist`);
      }
      return prevItems.filter(item => item.id !== productId);
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    toast.info('Wishlist cleared');
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const value = {
    wishlistItems,
    wishlistCount: wishlistItems.length,
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
