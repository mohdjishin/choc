import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Load wishlist from localStorage on mount (optionally sync with backend later)
  useEffect(() => {
    const savedWishlist = localStorage.getItem('boutique_wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
  }, []);

  // Save wishlist to localStorage on change
  useEffect(() => {
    localStorage.setItem('boutique_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    if (!user) {
      toast.error("Please login to manage your wishlist");
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const exists = wishlist.find(item => item.id === product.id);
    if (exists) {
      toast.success(`Removed ${product.name} from archive`);
      setWishlist(prev => prev.filter(item => item.id !== product.id));
    } else {
      toast.success(`Added ${product.name} to archive`);
      setWishlist(prev => [...prev, product]);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
