import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import api from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import LazyImage from '../components/LazyImage';
import toast from 'react-hot-toast';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    
    api.get('/products?selected=true')
      .then(res => {
        // The API now returns { products, metadata }
        const products = res.products || [];
        setFeaturedProducts(products.slice(0, 4));
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-silk-base overflow-x-hidden pt-0">
      <Hero scrollY={scrollY} />

      {/* Featured Collection */}
      <section className="py-32 lg:py-48 px-6 lg:px-24">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="space-y-6">
              <p className="text-[10px] uppercase tracking-[0.6em] font-bold text-copper-accent">Selected Works</p>
              <h2 className="text-6xl lg:text-8xl font-headline-lg italic text-ganache-rich tracking-tighter leading-none">
                The Heritage <br/> Collection
              </h2>
            </div>
            <Link to="/store" className="group flex items-center gap-6 text-[11px] uppercase tracking-[0.4em] font-black text-ganache-rich hover:text-copper-accent transition-all duration-700">
              View All Creations
              <div className="w-12 h-[1px] bg-ganache-rich group-hover:w-20 group-hover:bg-copper-accent transition-all duration-700"></div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={`skeleton-${i}`} className="space-y-8">
                  <div className="aspect-[4/5] shimmer rounded-sm" />
                  <div className="space-y-4">
                    <div className="h-2 w-20 shimmer rounded-full" />
                    <div className="h-8 w-40 shimmer rounded-full" />
                    <div className="h-6 w-24 shimmer rounded-full" />
                  </div>
                </div>
              ))
            ) : featuredProducts.map((product, i) => (
              <Link 
                to={`/product/${product.id}`}
                key={product.id}
                className="group cursor-pointer block"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                >
                  <div className="relative aspect-[4/5] rounded-sm overflow-hidden mb-8 bg-silk-base/50 group-hover:shadow-[0_40px_100px_rgba(45,27,20,0.1)] transition-all duration-1000">
                    <LazyImage 
                      src={product.images?.[0] || 'https://via.placeholder.com/600x800'} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-ganache-rich/10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                    {(!user || user.role === 'customer') && (
                      <button 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          if (!user) {
                            toast.error("Sign in to build your boutique archive");
                            navigate('/login', { state: { from: '/' } });
                            return;
                          }
                          addToCart(product, 1);
                          toast.success(`${product.name} added to archive`);
                        }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 bg-white text-ganache-rich px-8 py-4 rounded-full text-[9px] uppercase tracking-widest font-black flex items-center gap-3 shadow-2xl z-10"
                      >
                        <ShoppingBag className="w-3 h-3" /> Quick Add
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-copper-accent/60">{product.category}</p>
                    <h3 className="text-2xl font-headline-md italic text-ganache-rich group-hover:text-copper-accent transition-colors duration-500">{product.name}</h3>
                    <p className="text-xl font-headline-sm text-ganache-rich opacity-40 italic">AED {product.price?.toFixed(2)}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-48 bg-ganache-rich text-silk-base relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="relative aspect-square rounded-sm overflow-hidden">
             <video 
              autoPlay loop muted playsInline 
              className="w-full h-full object-cover opacity-80"
              src="https://assets.mixkit.co/videos/preview/mixkit-liquid-chocolate-pouring-into-a-bowl-4341-large.mp4"
            />
          </div>
          <div className="space-y-12">
            <SectionHeading sub="The Craft" main="Born from Heritage, Refined by Time" light />
            <p className="text-xl lg:text-2xl font-headline-sm italic text-silk-base/60 leading-relaxed max-w-xl">
              "Every piece is a symphony of rare dates and Swiss-engineered cocoa, hand-painted with the legacy of Jabal Al Ayham."
            </p>
            <div className="pt-8 grid grid-cols-2 gap-12 border-t border-silk-base/10">
              <div>
                <p className="text-4xl font-headline-lg text-copper-accent mb-2">100%</p>
                <p className="text-[9px] uppercase tracking-[0.4em] font-black text-silk-base/40">Organic Origin</p>
              </div>
              <div>
                <p className="text-4xl font-headline-lg text-copper-accent mb-2">24h</p>
                <p className="text-[9px] uppercase tracking-[0.4em] font-black text-silk-base/40">Artisan Curation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

const SectionHeading = ({ sub, main, light = false }) => (
  <div className="space-y-6">
    <p className={`text-[10px] uppercase tracking-[0.6em] font-bold ${light ? 'text-copper-accent' : 'text-copper-accent'}`}>{sub}</p>
    <h2 className={`text-6xl lg:text-8xl font-headline-lg italic tracking-tighter leading-[0.9] ${light ? 'text-silk-base drop-shadow-2xl' : 'text-ganache-rich'}`}>
      {main}
    </h2>
  </div>
);

export default Home;
