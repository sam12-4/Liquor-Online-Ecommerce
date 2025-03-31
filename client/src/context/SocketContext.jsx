import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useProducts } from './ProductContext';
import { toast } from 'react-toastify';

// Create context
const SocketContext = createContext();

// Custom hook to use the context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { refreshProducts } = useProducts();

  // Initialize socket connection
  useEffect(() => {
    // Connect to the server
    const socketInstance = io('http://localhost:5000', {
      transports: ['websocket'],
      autoConnect: true
    });

    // Set up event listeners
    socketInstance.on('connect', () => {
      console.log('Connected to socket server');
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setConnected(false);
    });

    // Listen for stock updates
    socketInstance.on('stockUpdated', (updatedProducts) => {
      console.log('Received stockUpdated event, refreshing products');
      // Force refresh products when stock is updated
      refreshProducts(true);
      
      // Show toast notification for stock update with fixed height
      toast.info('Stock quantities have been updated', {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          minHeight: '64px',
          maxHeight: '64px',
          padding: '0.75rem 1rem',
          lineHeight: '1.5',
          fontSize: '14px'
        }
      });
    });

    // Store socket instance in state
    setSocket(socketInstance);

    // Clean up on unmount
    return () => {
      if (socketInstance) {
        console.log('Cleaning up socket connection');
        socketInstance.disconnect();
      }
    };
  }, [refreshProducts]);

  // Value object to be provided to consuming components
  const value = {
    socket,
    connected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext; 