import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronLeft, ChevronRight, Shield, Clock, Droplets, Plus } from 'lucide-react';
import api from '../utils/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState(0);

  useEffect(() => {
    api.get('/products')
      .then(data => {
        const found = data.find(p => p.id === id);
        setProduct(found);
        setLoading(false);
        // Scroll to top after data is loaded and state is set
        setTimeout(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }, 0);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-silk-base flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-t-2 border-copper-accent rounded-full"></motion.div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-silk-base flex flex-col items-center justify-center space-y-8">
        <SectionHeading sub="Product Missing" main="Not Found" />
        <Link to="/" className="text-copper-accent uppercase tracking-widest text-[10px] font-black border-b border-copper-accent pb-2">Go Back Home</Link>
      </div>
    );
  }

  const allMedia = [...(product.images || []), ...(product.videos || [])];

  return (
    <div className="bg-silk-base min-h-screen pt-32 pb-48">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-24">
        
        {/* Navigation Breadcrumb */}
        <Link to="/" className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-black text-ganache-rich/30 hover:text-ganache-rich transition-all mb-16">
          <ChevronLeft className="w-3 h-3" /> Back to Home
        </Link>

        {/* Main Product Section: Gallery + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start mb-32">
          
          {/* Left: Media Gallery */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative aspect-[4/5] bg-ganache-rich/5 rounded-sm overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMedia}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full"
                >
                  {allMedia[activeMedia]?.endsWith('.mp4') || allMedia[activeMedia]?.includes('video') ? (
                    <video src={allMedia[activeMedia]} autoPlay loop muted className="w-full h-full object-cover" />
                  ) : (
                    <img src={allMedia[activeMedia] || 'https://via.placeholder.com/1200x1500'} className="w-full h-full object-cover" alt={product.name} />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Media Controls */}
              {allMedia.length > 1 && (
                <div className="absolute inset-x-8 bottom-8 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-700">
                  <button onClick={() => setActiveMedia((prev) => (prev > 0 ? prev - 1 : allMedia.length - 1))} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-ganache-rich transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex gap-2">
                    {allMedia.map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${activeMedia === i ? 'bg-white w-4' : 'bg-white/40'}`} />
                    ))}
                  </div>
                  <button onClick={() => setActiveMedia((prev) => (prev < allMedia.length - 1 ? prev + 1 : 0))} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-ganache-rich transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-4">
              {allMedia.map((url, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveMedia(i)}
                  className={`aspect-square rounded-sm overflow-hidden border-2 transition-all duration-500 ${activeMedia === i ? 'border-copper-accent' : 'border-transparent opacity-40 hover:opacity-100'}`}
                >
                  {url.endsWith('.mp4') || url.includes('video') ? (
                    <video src={url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={url} className="w-full h-full object-cover" alt="" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-16">
            <div className="space-y-6">
              <p className="text-[11px] uppercase tracking-[0.6em] font-bold text-copper-accent">{product.category}</p>
              <h1 className="text-7xl lg:text-8xl font-headline-lg italic text-ganache-rich tracking-tighter leading-none">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-6">
                <span className="text-4xl font-headline-md italic text-ganache-rich">AED {product.price?.toFixed(2)}</span>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-ganache-rich/20">Tax included</span>
              </div>
            </div>

            <div className="space-y-8">
              <p className="text-xl font-headline-sm italic text-ganache-rich/60 leading-relaxed">
                {product.description}
              </p>
              
              {/* Sensory Highlights */}
              <div className="grid grid-cols-2 gap-10 pt-10 border-t border-ganache-rich/5">
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-full bg-copper-accent/5 flex items-center justify-center text-copper-accent">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest font-black text-ganache-rich/30">Quality</p>
                    <p className="text-[11px] font-bold text-ganache-rich">Hand Made</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-full bg-copper-accent/5 flex items-center justify-center text-copper-accent">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest font-black text-ganache-rich/30">Fresh</p>
                    <p className="text-[11px] font-bold text-ganache-rich">New Batch</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Options */}
            <div className="space-y-12 pt-8">
              <div className="flex items-center gap-12">
                <div className="flex items-center border border-ganache-rich/10 rounded-full p-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full hover:bg-ganache-rich/5 transition-colors text-ganache-rich">－</button>
                  <span className="w-12 text-center font-bold text-ganache-rich">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full hover:bg-ganache-rich/5 transition-colors text-ganache-rich">＋</button>
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-ganache-rich/30">
                  {product.stock > 0 ? `${product.stock} pieces in stock` : 'Out of Stock'}
                </p>
              </div>

              <button className="w-full bg-ganache-rich text-silk-base py-10 rounded-sm font-label-sm text-[11px] uppercase tracking-[0.5em] font-black hover:bg-copper-accent transition-all duration-700 shadow-2xl flex items-center justify-center gap-6 group">
                <ShoppingBag className="w-4 h-4 group-hover:scale-125 transition-transform" />
                Add to Bag
              </button>
            </div>

            {/* Tonal Accordion Details */}
            <div className="border-t border-ganache-rich/10 pt-8 space-y-4">
              {product.details?.map((item, idx) => (
                <div key={idx} className="border-b border-ganache-rich/5 last:border-0">
                  <button 
                    onClick={() => setActiveAccordion(activeAccordion === idx ? null : idx)}
                    className="w-full flex justify-between items-center py-6 group hover:text-copper-accent transition-colors text-left"
                  >
                    <span className="text-[10px] uppercase tracking-[0.4em] font-black text-ganache-rich/60 group-hover:text-copper-accent transition-colors">
                      {item.title}
                    </span>
                    <motion.span 
                      animate={{ rotate: activeAccordion === idx ? 45 : 0 }}
                      className="text-ganache-rich/30 group-hover:text-copper-accent"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {activeAccordion === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-8 text-[11px] leading-relaxed text-ganache-rich/40 italic pr-12">
                          {item.content || 'More details coming soon.'}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Ritual Notes */}
            <div className="bg-ganache-rich/[0.02] p-10 rounded-sm space-y-6">
              <div className="flex items-center gap-4 text-copper-accent">
                <Droplets className="w-4 h-4" />
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Tasting Tips</p>
              </div>
              <p className="text-[11px] text-ganache-rich/40 leading-relaxed italic">
                Eat at room temperature. Let the chocolate melt in your mouth to taste all the flavors.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Origins & Craft Section */}
      {product.origins_craft && product.origins_craft.length > 0 && (
        <section className="py-24 bg-silk-base/30">
          <div className="max-w-[1440px] mx-auto px-6 md:px-24">
            <div className="space-y-24">
              {product.origins_craft.map((block, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div key={idx} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-center`}>
                    {/* Image Column - 60% Width */}
                    <div className="w-full md:w-[60%]">
                      <div className="relative overflow-hidden rounded-[3rem] group aspect-[16/10] md:aspect-[16/9]">
                        <img 
                          src={block.image} 
                          alt={block.title} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        />
                        {block.tag && (
                          <div className="absolute top-8 left-8">
                            <span className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full font-label-sm text-[11px] text-ganache-rich tracking-[0.3em] shadow-sm border border-ganache-rich/5 uppercase">{block.tag}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Text Column - 40% Width */}
                    <div className="w-full md:w-[40%] space-y-10 text-left">
                      <div className="w-16 h-16 rounded-3xl bg-ganache-rich/5 flex items-center justify-center mb-12">
                        <ShoppingBag className="w-6 h-6 text-ganache-rich/40" />
                      </div>
                      <div className="space-y-8">
                        <h3 className="font-headline-md text-3xl md:text-5xl text-ganache-rich italic tracking-tight leading-[1.1]">
                          {block.title}
                        </h3>
                        <p className="text-sm md:text-lg leading-relaxed text-ganache-rich/50 italic font-light max-w-sm">
                          {block.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const SectionHeading = ({ sub, main }) => (
  <div className="text-center space-y-4">
    <p className="text-[10px] uppercase tracking-[0.6em] font-bold text-copper-accent">{sub}</p>
    <h2 className="text-5xl font-headline-lg italic text-ganache-rich tracking-tighter">{main}</h2>
  </div>
);

export default ProductDetail;
