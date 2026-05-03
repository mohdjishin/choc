import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
  const { cart, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeFromCart, cartTotal, itemCount, placeOrder } = useCart();

  const handleCheckout = async () => {
    const success = await placeOrder();
    if (success) {
      // Maybe navigate to orders page or just let the toast show
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-ganache-rich/40 backdrop-blur-sm z-[200]"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-[#FDFBF7] shadow-[-20px_0_80px_rgba(45,27,20,0.1)] z-[201] flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-ganache-rich/5 flex justify-between items-center bg-white/50 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <ShoppingBag className="w-5 h-5 text-copper-accent" />
                <h2 className="text-[11px] uppercase tracking-[0.5em] font-black text-ganache-rich">Boutique Bag</h2>
                <span className="text-[10px] text-ganache-rich/30 font-bold">({itemCount})</span>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="group p-2 hover:bg-ganache-rich hover:text-white rounded-full transition-all duration-500">
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-8 opacity-20">
                  <ShoppingBag className="w-16 h-16 stroke-[1px]" />
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black">Your bag is empty</p>
                  <button onClick={() => setIsDrawerOpen(false)} className="text-[9px] uppercase tracking-widest border-b border-ganache-rich pb-1 font-bold">Start Exploring</button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-24 h-32 bg-white rounded-sm overflow-hidden flex-shrink-0 shadow-sm">
                      <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-headline-lg italic text-ganache-rich">{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="text-ganache-rich/20 hover:text-red-800 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[9px] uppercase tracking-widest font-bold text-copper-accent/60">{item.category}</p>
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-4 bg-white/50 rounded-full px-4 py-2 border border-ganache-rich/5">
                          <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-copper-accent transition-colors"><Minus className="w-3 h-3" /></button>
                          <span className="text-[10px] font-black w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-copper-accent transition-colors"><Plus className="w-3 h-3" /></button>
                        </div>
                        <p className="text-sm font-headline-sm italic text-ganache-rich/60">AED {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 space-y-8 bg-white border-t border-ganache-rich/5">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-ganache-rich/40">
                    <span>Subtotal</span>
                    <span>AED {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] uppercase tracking-[0.4em] font-black text-ganache-rich">Grand Total</span>
                    <span className="text-2xl font-headline-lg italic text-ganache-rich">AED {cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#2D1B14] text-[#FDFBF7] py-6 rounded-full text-[11px] uppercase tracking-[0.5em] font-black shadow-2xl hover:bg-[#C19A6B] transition-all duration-700 flex items-center justify-center gap-4 group"
                >
                  Secure Checkout
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
                
                <p className="text-[9px] text-center text-ganache-rich/30 uppercase tracking-widest font-medium italic">
                  Complimentary luxury wrapping included
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
