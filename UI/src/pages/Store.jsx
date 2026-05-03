import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  X, 
  ChevronRight, 
  Loader2, 
  ChevronDown, 
  Check,
  ArrowUpRight,
  ChevronLeft
} from 'lucide-react';
import api from '../utils/api';
import LazyImage from '../components/LazyImage';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSort, setActiveSort] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [metadata, setMetadata] = useState({ total_pages: 1, total_products: 0 });
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const categories = ['All', 'Truffles', 'Pralines', 'Ganache', 'Boutique Boxes', 'Seasonal', 'Limited Editions', 'Heritage'];

  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
  ];

  const fetchProducts = useCallback(async (pageNum, category, sort) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/products?page=${pageNum}&limit=12&category=${category}&sort=${sort}`);
      const { products: newProducts, metadata: meta } = response;
      setProducts(newProducts);
      setMetadata(meta);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(page, activeCategory, activeSort);
  }, [page, activeCategory, activeSort, fetchProducts]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= metadata.total_pages) {
      setPage(newPage);
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen text-ganache-rich selection:bg-copper-accent selection:text-white pt-32 pb-48 relative">
      <div className="max-w-[1800px] mx-auto px-8 lg:px-20 relative z-10 space-y-24">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 overflow-hidden">
          <div className="space-y-6 w-full md:w-auto">
            <motion.p 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="text-[9px] sm:text-[10px] uppercase tracking-[0.5em] sm:tracking-[0.6em] font-bold text-copper-accent"
            >
              The Collection
            </motion.p>
            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-headline-lg italic text-ganache-rich tracking-tighter leading-none break-words">
              Boutique
            </h1>
          </div>
          
          <div className="flex items-center gap-12">
             {/* Search */}
             <div className="flex items-center gap-4">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.input 
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 250, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      type="text" 
                      placeholder="Search curation..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-b border-ganache-rich/10 py-2 text-sm outline-none focus:border-copper-accent transition-all font-body-md italic"
                    />
                  )}
                </AnimatePresence>
                <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-ganache-rich/40 hover:text-ganache-rich transition-colors">
                  {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                </button>
             </div>

             {/* Sort */}
             <div className="relative">
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="text-[10px] uppercase tracking-[0.4em] font-black text-ganache-rich/40 hover:text-ganache-rich flex items-center gap-3 transition-colors"
                >
                  {sortOptions.find(o => o.value === activeSort).label}
                  <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {isSortOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)}></div>
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-6 w-56 bg-white shadow-2xl rounded-2xl border border-ganache-rich/5 py-4 z-50 overflow-hidden"
                      >
                        {sortOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => { 
                              setActiveSort(option.value); 
                              setPage(1); 
                              setIsSortOpen(false); 
                            }}
                            className="w-full px-8 py-3 text-left hover:bg-silk-base text-[10px] uppercase tracking-widest font-bold text-ganache-rich/40 hover:text-ganache-rich transition-colors"
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
             </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="relative">
          <div className="flex gap-12 overflow-x-auto pb-6 no-scrollbar scroll-smooth relative">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setPage(1);
                }}
                className={`text-[11px] uppercase tracking-[0.4em] font-black whitespace-nowrap transition-all duration-500 relative pb-2 ${activeCategory === cat ? 'text-copper-accent' : 'text-ganache-rich/20 hover:text-ganache-rich'}`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-[1px] bg-copper-accent" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Product Exhibition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-24 lg:gap-x-12 lg:gap-y-32">
          <AnimatePresence mode='popLayout'>
            {isLoading ? (
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => <SkeletonCard key={i} />)
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product, i) => (
                <Link to={`/product/${product.id}`} key={product.id} className="group">
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: i % 4 * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-10"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-white/50 rounded-2xl shadow-[0_20px_60px_-20px_rgba(45,27,20,0.05)] transition-all duration-1000 group-hover:shadow-[0_40px_100px_rgba(45,27,20,0.08)] group-hover:-translate-y-2">
                      <LazyImage 
                        src={product.images?.[0] || 'https://via.placeholder.com/600x800'} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                      />
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center">
                          <span className="text-[10px] uppercase tracking-[0.5em] font-black text-ganache-rich/40">Sold Out</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-ganache-rich/0 group-hover:bg-ganache-rich/5 transition-all duration-1000" />
                      <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl">
                          <ArrowUpRight className="w-5 h-5 text-ganache-rich" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4 px-2">
                      <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-copper-accent/60">{product.category}</p>
                      <h3 className="text-2xl font-headline-md italic text-ganache-rich group-hover:text-copper-accent transition-colors duration-700 leading-tight">{product.name}</h3>
                      <p className="text-xl font-headline-sm text-ganache-rich/30 italic">AED {product.price?.toFixed(2)}</p>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-60 text-center space-y-8">
                <ShoppingBag className="w-20 h-20 text-ganache-rich/5 mx-auto mb-12" />
                <p className="text-5xl font-headline-lg italic text-ganache-rich/10 tracking-tight">Curation not found</p>
                <button onClick={() => {setActiveCategory('All'); setPage(1); setSearchQuery('');}} className="text-[10px] uppercase tracking-[0.6em] font-black text-copper-accent hover:opacity-60 transition-opacity border-b border-copper-accent/20 pb-2">Reset Filter</button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Editorial Pagination */}
        {!isLoading && metadata.total_pages > 1 && (
          <div className="mt-60 pt-32 border-t border-ganache-rich/5 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex items-center gap-6 order-2 md:order-1">
              <button 
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`group flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-black transition-all ${page === 1 ? 'opacity-10 cursor-not-allowed' : 'text-ganache-rich hover:text-copper-accent'}`}
              >
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> 
                <span className="hidden sm:inline">Previous</span>
              </button>
            </div>
            
            <div className="flex items-center gap-4 order-1 md:order-2">
              {[...Array(metadata.total_pages)].map((_, i) => {
                const isActive = page === i + 1;
                return (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`relative w-14 h-14 flex items-center justify-center transition-all duration-700 group`}
                  >
                    <AnimatePresence>
                      {isActive && (
                        <motion.div 
                          layoutId="active-page-circle"
                          className="absolute inset-0 bg-ganache-rich rounded-full shadow-2xl shadow-ganache-rich/20"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                        />
                      )}
                    </AnimatePresence>
                    <span className={`relative z-10 text-[11px] font-black tracking-widest transition-colors duration-500 ${isActive ? 'text-silk-base' : 'text-ganache-rich/30 group-hover:text-ganache-rich'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {!isActive && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-copper-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-6 order-3">
              <button 
                onClick={() => handlePageChange(page + 1)}
                disabled={page === metadata.total_pages}
                className={`group flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-black transition-all ${page === metadata.total_pages ? 'opacity-10 cursor-not-allowed' : 'text-ganache-rich hover:text-copper-accent'}`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

const SkeletonCard = () => (
  <div className="space-y-8">
    <div className="aspect-[3/4] shimmer" />
    <div className="space-y-4">
      <div className="h-2 w-24 shimmer rounded-full" />
      <div className="h-8 w-48 shimmer rounded-full" />
      <div className="h-4 w-12 shimmer rounded-full" />
    </div>
  </div>
);

export default Store;
