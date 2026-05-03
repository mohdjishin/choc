import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import api from '../utils/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useAuth();
  const isInitialMount = useRef(true);

  // Load cart from backend when user changes (login/logout)
  useEffect(() => {
    if (user) {
      api.get('/cart')
        .then(res => {
          // The backend returns models.Cart which has Items
          // We need to map these Items back to full products if possible, 
          // but for now, we'll store what we have. 
          // Note: The frontend expects full product objects in the cart.
          // This is a bit of a mismatch. 
          // Refined Plan: The backend should ideally return populated products.
          // For now, I'll trust the items from backend and let the UI handle it.
          if (res.items) {
            // Transform backend items to frontend format
            // Since backend only has product_id, we might need to fetch details.
            // BUT, if we keep localStorage as a secondary source, it might be easier.
            setCart(res.items.map(item => ({
              id: item.product_id,
              quantity: item.quantity,
              // We'll try to get other fields from localStorage if available
              ...getLocalStorageDetails(item.product_id)
            })));
          }
        })
        .catch(err => console.error("Failed to fetch cart from backend", err));
    } else {
      setCart([]);
    }
  }, [user]);

  const getLocalStorageDetails = (productId) => {
    const saved = localStorage.getItem('boutique_bag');
    if (saved) {
      const items = JSON.parse(saved);
      return items.find(i => i.id === productId) || {};
    }
    return {};
  };

  // Sync with backend on cart changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    localStorage.setItem('boutique_bag', JSON.stringify(cart));

    if (user && cart.length >= 0) {
      const backendItems = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));
      
      api.post('/cart', { items: backendItems })
        .catch(err => console.error("Failed to sync cart with backend", err));
    }
  }, [cart, user]);

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      toast.error("Please login to add items to your bag");
      return false;
    }
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    setIsDrawerOpen(true);
    return true;
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartTotal, 
      itemCount,
      isDrawerOpen,
      setIsDrawerOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
