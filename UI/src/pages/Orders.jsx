import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight, Clock, CheckCircle2, Truck, XCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import LazyImage from '../components/LazyImage';

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(45,27,20,0.05)] border border-white/50 ${className}`}>
    {children}
  </div>
);

const SectionHeading = ({ sub, main }) => (
  <div className="space-y-4">
    <motion.p 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="text-[10px] uppercase tracking-[0.6em] font-bold text-copper-accent"
    >
      {sub}
    </motion.p>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-6xl lg:text-7xl font-headline-lg italic text-ganache-rich tracking-tighter leading-none"
    >
      {main}
    </motion.h2>
  </div>
);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'PENDING': return { icon: Clock, color: 'text-amber-600 bg-amber-50', label: 'Processing' };
      case 'APPROVED': return { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50', label: 'Confirmed' };
      case 'DELIVERED': return { icon: Truck, color: 'text-blue-600 bg-blue-50', label: 'Delivered' };
      case 'CANCELED': return { icon: XCircle, color: 'text-rose-600 bg-rose-50', label: 'Canceled' };
      default: return { icon: Clock, color: 'text-ganache-rich/40 bg-ganache-rich/5', label: status };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] pt-32 flex items-center justify-center">
        <div className="flex flex-col items-center gap-8">
          <div className="w-16 h-16 border-t-2 border-copper-accent rounded-full animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.5em] font-black text-ganache-rich/20">Loading Archive</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-ganache-rich selection:bg-copper-accent selection:text-white pt-32 pb-48 relative">
      <div className="max-w-[1800px] mx-auto px-8 lg:px-20 relative z-10 space-y-24">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="space-y-12">
            <Link to="/store" className="inline-flex items-center gap-6 text-[10px] uppercase tracking-[0.5em] font-black text-ganache-rich/20 hover:text-ganache-rich transition-all group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> Back to Boutique
            </Link>
            <SectionHeading sub="Collections History" main="Your Archive" />
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] uppercase tracking-[0.4em] font-black text-ganache-rich/10 mb-2">Total Curation</p>
            <p className="text-4xl font-headline-md italic text-ganache-rich opacity-40">{orders.length} Selections</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card className="py-48 text-center space-y-12 bg-white/50 backdrop-blur-sm">
            <ShoppingBag className="w-20 h-20 text-ganache-rich/5 mx-auto mb-12" />
            <p className="text-5xl font-headline-lg italic text-ganache-rich/10">The archive is empty</p>
            <Link to="/store" className="inline-block bg-ganache-rich text-silk-base px-16 py-8 rounded-full text-[10px] uppercase tracking-[0.6em] font-black hover:bg-copper-accent transition-all duration-700 shadow-2xl">
              Begin Exploration
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            <AnimatePresence>
              {orders.map((order, idx) => {
                const status = getStatusConfig(order.status);
                const StatusIcon = status.icon;
                
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-700 group border-none bg-white/80 backdrop-blur-sm">
                      <div className="p-12 lg:p-16 space-y-12">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 pb-12 border-b border-ganache-rich/5">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 flex-1 w-full">
                            <div className="space-y-3">
                              <p className="text-[9px] uppercase tracking-[0.4em] font-black text-ganache-rich/20">Identity</p>
                              <p className="text-[11px] font-black tracking-[0.3em] uppercase text-ganache-rich">#{order.id?.slice(-8)}</p>
                            </div>
                            <div className="space-y-3">
                              <p className="text-[9px] uppercase tracking-[0.4em] font-black text-ganache-rich/20">Date</p>
                              <p className="text-sm font-body-md italic text-ganache-rich/60">
                                {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                            <div className="space-y-3">
                              <p className="text-[9px] uppercase tracking-[0.4em] font-black text-ganache-rich/20">Status</p>
                              <div className="flex flex-col gap-2">
                                <div className={`flex items-center gap-3 px-5 py-2.5 rounded-full w-fit ${status.color}`}>
                                  <StatusIcon className="w-3.5 h-3.5" />
                                  <span className="text-[9px] uppercase tracking-widest font-black">{status.label}</span>
                                </div>
                                {order.status === 'CANCELED' && order.cancel_reason && (
                                  <p className="text-[10px] text-rose-500 font-body-md italic ml-1 max-w-[200px]">Reason: {order.cancel_reason}</p>
                                )}
                              </div>
                            </div>
                            <div className="space-y-3">
                              <p className="text-[9px] uppercase tracking-[0.4em] font-black text-ganache-rich/20">Total</p>
                              <p className="text-3xl font-headline-md italic text-copper-accent tracking-tighter">AED {order.total_amount.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex gap-8 items-center group/item">
                              <div className="w-24 h-24 bg-silk-base/30 rounded-3xl p-4 overflow-hidden flex-shrink-0 group-hover/item:scale-105 transition-transform duration-500 shadow-inner">
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                              </div>
                              <div className="space-y-2">
                                <h4 className="text-[11px] uppercase tracking-[0.2em] font-black text-ganache-rich leading-tight line-clamp-2">{item.name}</h4>
                                <p className="text-[10px] text-ganache-rich/30 italic font-body-md">
                                  <span className="font-black text-copper-accent/40 mr-2">{item.quantity}×</span>
                                  AED {item.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
