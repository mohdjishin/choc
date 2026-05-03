import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ShoppingBag, Search, Filter, X, ChevronRight } from 'lucide-react';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Truffles', 'Pralines', 'Ganache', 'Boutique Boxes', 'Seasonal'];

  useEffect(() => {
    setIsLoading(true);
    axios.get('http://localhost:8081/products')
      .then(res => {
        setProducts(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-silk-base pt-48 pb-32 px-6 lg:px-24">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col space-y-8 mb-24">
          <p className="text-[10px] uppercase tracking-[0.6em] font-bold text-copper-accent">Maison Catalog</p>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
            <h1 className="text-7xl lg:text-9xl font-headline-lg italic text-ganache-rich tracking-tighter leading-none">
              The Boutique
            </h1>
            <div className="w-full lg:w-96 relative group">
              <input 
                type="text" 
                placeholder="Search the archive..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-ganache-rich/10 py-4 pr-12 text-sm text-ganache-rich placeholder:text-ganache-rich/20 outline-none focus:border-copper-accent transition-all"
              />
              <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-ganache-rich/20 group-focus-within:text-copper-accent transition-all" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-8 mb-24 border-b border-ganache-rich/5 pb-12">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[10px] uppercase tracking-[0.4em] font-black transition-all duration-500 relative pb-2 ${activeCategory === cat ? 'text-copper-accent' : 'text-ganache-rich/30 hover:text-ganache-rich'}`}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-[1px] bg-copper-accent" />
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-16">
          <AnimatePresence mode='popLayout'>
            {isLoading ? (
              [1, 2, 3, 4, 5, 6, 7, 8].map(i => <SkeletonCard key={i} />)
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product, i) => (
                <Link to={`/product/${product.id}`} key={product.id}>
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[4/5] rounded-sm overflow-hidden mb-8 bg-silk-base/50 group-hover:shadow-[0_40px_100px_rgba(45,27,20,0.08)] transition-all duration-1000">
                      <img 
                        src={product.images?.[0] || 'https://via.placeholder.com/600x800'} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-ganache-rich/10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); /* Logic for Quick Add will go here */ }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 bg-white text-ganache-rich px-8 py-4 rounded-full text-[9px] uppercase tracking-widest font-black flex items-center gap-3 shadow-2xl z-10"
                      >
                        <ShoppingBag className="w-3 h-3" /> Quick Add
                      </button>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-copper-accent/60">{product.category}</p>
                      <h3 className="text-2xl font-headline-md italic text-ganache-rich group-hover:text-copper-accent transition-colors duration-500">{product.name}</h3>
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-xl font-headline-sm text-ganache-rich opacity-40 italic">AED {product.price?.toFixed(2)}</p>
                        <div className="w-8 h-[1px] bg-ganache-rich/10 group-hover:w-12 group-hover:bg-copper-accent transition-all duration-700"></div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-40 text-center space-y-6">
                <p className="text-4xl font-headline-lg italic text-ganache-rich/10">No creations found in this archive</p>
                <button onClick={() => {setActiveCategory('All'); setSearchQuery('');}} className="text-[10px] uppercase tracking-[0.4em] font-black text-copper-accent hover:opacity-60 transition-opacity">Clear Filters</button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="space-y-8 animate-pulse">
    <div className="aspect-[4/5] bg-ganache-rich/[0.03] rounded-sm" />
    <div className="space-y-4">
      <div className="h-2 w-24 bg-ganache-rich/[0.03] rounded-full" />
      <div className="h-6 w-48 bg-ganache-rich/[0.03] rounded-full" />
      <div className="h-4 w-12 bg-ganache-rich/[0.03] rounded-full" />
    </div>
  </div>
);

export default Store;
