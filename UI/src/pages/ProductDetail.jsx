import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LazyImage from '../components/LazyImage';
import { ShoppingBag, ChevronLeft, ChevronRight, Shield, Clock, Droplets, Plus, ArrowLeft, ArrowRight, Loader2, Heart } from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [navigation, setNavigation] = useState({ prev_id: null, next_id: null });
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/detail?id=${id}`)
      .then(res => {
        setProduct(res.product);
        setNavigation(res.navigation);
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen pt-32 pb-48">
        <div className="max-w-[1800px] mx-auto px-8 lg:px-24">
          <div className="h-4 w-32 shimmer rounded-full mb-16" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
            <div className="lg:col-span-7 space-y-8">
              <div className="aspect-[4/5] shimmer" />
              <div className="flex gap-4">
                {[...Array(4)].map((_, i) => <div key={i} className="w-24 h-32 shimmer" />)}
              </div>
            </div>
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <div className="h-3 w-24 shimmer rounded-full" />
                <div className="h-16 w-full shimmer rounded-full" />
                <div className="h-8 w-32 shimmer rounded-full" />
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => <div key={i} className="h-4 w-full shimmer rounded-full" />)}
              </div>
              <div className="pt-10 space-y-6">
                <div className="h-14 w-full shimmer rounded-full" />
                <div className="h-14 w-full shimmer rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-8">
        <h2 className="text-4xl font-headline-lg italic text-ganache-rich opacity-20 text-center">Creation Not Found</h2>
        <Link to="/store" className="text-copper-accent uppercase tracking-widest text-[10px] font-black border-b border-copper-accent pb-2">Return to Boutique</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Sign in to build your boutique archive");
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Sign in to proceed with secure checkout");
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    addToCart(product, quantity);
    toast.success(`Initializing secure checkout...`);
  };

  const allMedia = [...(product.images || []), ...(product.videos || [])];

  return (
    <div className="bg-white min-h-screen pt-32 pb-48 selection:bg-copper-accent selection:text-white">
      <div className="max-w-[1800px] mx-auto px-8 lg:px-24">
        
        {/* Navigation Breadcrumb */}
        <div className="flex justify-between items-center mb-16">
          <Link to="/store" className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-black text-ganache-rich/30 hover:text-ganache-rich transition-all">
            <ArrowLeft className="w-4 h-4" /> The Boutique
          </Link>
          
          <div className="flex items-center gap-8">
            <button 
              onClick={() => toggleWishlist(product)}
              className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-black transition-all ${isInWishlist(product.id) ? 'text-red-800' : 'text-ganache-rich/20 hover:text-ganache-rich'}`}
            >
              <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-800' : ''}`} />
              <span className="hidden sm:inline">{isInWishlist(product.id) ? 'Saved to Favorites' : 'Add to Wishlist'}</span>
            </button>
            <div className="w-[1px] h-4 bg-ganache-rich/10" />
            {navigation.prev_id && (
              <Link to={`/product/${navigation.prev_id}`} className="text-ganache-rich/40 hover:text-ganache-rich transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
            )}
            <div className="w-[1px] h-4 bg-ganache-rich/10" />
            {navigation.next_id && (
              <Link to={`/product/${navigation.next_id}`} className="text-ganache-rich/40 hover:text-ganache-rich transition-colors">
                <ChevronRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start mb-48">
          
          {/* Media Gallery */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative aspect-[4/5] bg-[#FDFBF7] overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMedia}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="w-full h-full"
                >
                  {allMedia[activeMedia]?.includes('video') || allMedia[activeMedia]?.endsWith('.mp4') ? (
                    <video src={allMedia[activeMedia]} autoPlay loop muted className="w-full h-full object-cover" />
                  ) : (
                    <LazyImage src={allMedia[activeMedia]} className="w-full h-full object-cover" alt={product.name} />
                  )}
                </motion.div>
              </AnimatePresence>

              {allMedia.length > 1 && (
                <div className="absolute inset-x-8 bottom-8 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-700">
                  <button onClick={() => setActiveMedia((prev) => (prev > 0 ? prev - 1 : allMedia.length - 1))} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-ganache-rich flex items-center justify-center hover:bg-white transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setActiveMedia((prev) => (prev < allMedia.length - 1 ? prev + 1 : 0))} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-ganache-rich flex items-center justify-center hover:bg-white transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
              {allMedia.map((media, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveMedia(i)}
                  className={`w-24 h-32 flex-shrink-0 overflow-hidden transition-all duration-700 ${activeMedia === i ? 'ring-2 ring-copper-accent' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-100'}`}
                >
                  <img src={media} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 space-y-16">
            <div className="space-y-6">
              <p className="text-[11px] uppercase tracking-[0.8em] font-black text-copper-accent">{product.category}</p>
              <h1 className="text-7xl lg:text-8xl font-headline-lg italic text-ganache-rich tracking-tighter leading-none">{product.name}</h1>
              <p className="text-4xl font-headline-sm italic text-ganache-rich/30 pt-4">AED {product.price?.toFixed(2)}</p>
            </div>

            <p className="text-lg font-body-md text-ganache-rich/60 leading-relaxed italic">
              {product.description || "A masterpiece of artisanal confectionery, crafted with the finest ingredients and centuries-old Swiss techniques."}
            </p>

            <div className="space-y-10 pt-10 border-t border-ganache-rich/5">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
                <div className="flex items-center justify-between border border-[#2D1B14]/10 rounded-full px-6 py-4 bg-[#FFFFFF]/50 backdrop-blur-sm shadow-inner">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-[#2D1B14]/40 hover:text-[#2D1B14] transition-colors font-bold text-xl">-</button>
                  <span className="w-12 text-center text-sm font-black tracking-widest">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-[#2D1B14]/40 hover:text-[#2D1B14] transition-colors font-bold text-xl">+</button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#2D1B14] text-[#FDFBF7] py-6 px-12 rounded-full text-[11px] uppercase tracking-[0.5em] font-black shadow-[0_20px_50px_rgba(45,27,20,0.2)] hover:bg-[#C19A6B] hover:shadow-[0_20px_50px_rgba(193,154,107,0.3)] transition-all duration-700 flex items-center justify-center gap-4 group active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" /> Add to Boutique Bag
                </button>
              </div>

              <button 
                onClick={handleBuyNow}
                className="w-full bg-transparent border border-[#2D1B14] text-[#2D1B14] py-6 rounded-full text-[11px] uppercase tracking-[0.5em] font-black hover:bg-[#2D1B14] hover:text-white transition-all duration-700 flex items-center justify-center gap-4 group active:scale-95 shadow-sm"
              >
                Buy Now
              </button>
            </div>

            {/* Accordions */}
            <div className="space-y-4 pt-10 border-t border-ganache-rich/5">
              {(product.details || []).map((detail, i) => (
                <div key={i} className="border-b border-ganache-rich/[0.03] last:border-none">
                  <button 
                    onClick={() => setActiveAccordion(activeAccordion === i ? -1 : i)}
                    className="w-full py-6 flex justify-between items-center group text-left"
                  >
                    <span className="text-[10px] uppercase tracking-[0.4em] font-black text-ganache-rich/40 group-hover:text-ganache-rich transition-colors">{detail.title}</span>
                    <Plus className={`w-4 h-4 text-ganache-rich/20 transition-transform duration-700 ${activeAccordion === i ? 'rotate-45' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeAccordion === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-8 text-sm font-body-md text-ganache-rich/50 italic leading-relaxed whitespace-pre-wrap">{detail.content}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ORIGIN & CRAFT SECTION */}
        {product.origins_craft && product.origins_craft.length > 0 && (
          <div className="space-y-48 mb-60">
            {product.origins_craft.map((block, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-24 items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={`space-y-12 ${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
                  <div className="space-y-6">
                    <p className="text-[11px] uppercase tracking-[0.8em] font-black text-copper-accent">{block.tag || 'The Craft'}</p>
                    <h2 className="text-6xl lg:text-7xl font-headline-lg italic text-ganache-rich leading-tight">{block.title}</h2>
                  </div>
                  <p className="text-xl font-body-md text-ganache-rich/50 italic leading-relaxed max-w-xl">
                    {block.content}
                  </p>
                </div>
                <div className={`relative aspect-square lg:aspect-[4/3] overflow-hidden ${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
                  <LazyImage src={block.image} alt={block.title} className="w-full h-full object-cover transition-transform duration-[4000ms] hover:scale-105" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* NEXT PRODUCT TEASER */}
        {navigation.next_id && (
           <div className="mt-60 border-t border-ganache-rich/5 pt-32 text-center space-y-12">
              <p className="text-[11px] uppercase tracking-[0.8em] font-black text-copper-accent">Next Masterpiece</p>
              <Link to={`/product/${navigation.next_id}`} className="group inline-block">
                <h3 className="text-7xl lg:text-9xl font-headline-lg italic text-ganache-rich tracking-tighter opacity-10 group-hover:opacity-100 group-hover:text-copper-accent transition-all duration-1000">Discover Next</h3>
                <motion.div 
                  animate={{ x: [0, 20, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mt-12 flex justify-center"
                >
                  <ArrowRight className="w-12 h-12 text-copper-accent/40" />
                </motion.div>
              </Link>
           </div>
        )}
      </div>

      {/* MOBILE STICKY PURCHASE BAR */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-xl border-t border-ganache-rich/5 p-6 z-[100] flex items-center gap-6 animate-slide-up">
        <div className="flex-1">
          <p className="text-[9px] uppercase tracking-widest font-black text-ganache-rich/40">Total</p>
          <p className="text-lg font-headline-sm italic text-ganache-rich">AED {(product.price * quantity).toFixed(2)}</p>
        </div>
        <button 
          onClick={handleAddToCart}
          className="bg-[#2D1B14] text-white px-8 py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-black shadow-xl"
        >
          Add to Bag
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
