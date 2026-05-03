import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-[#FDFBF7] px-6 lg:px-24 py-32 relative z-20 overflow-hidden border-t border-ganache-rich/5">
      {/* Soft Background Ambiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-copper-accent/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center space-y-16 relative z-10">
        
        {/* Brand Core */}
        <div className="space-y-6">
          <h2 className="text-4xl lg:text-5xl font-headline-lg italic text-ganache-rich tracking-tighter">
            Jabal Al Ayham
          </h2>
          <div className="w-12 h-[1px] bg-copper-accent mx-auto opacity-40"></div>
          <p className="font-headline-sm italic text-ganache-rich/40 text-sm max-w-lg leading-relaxed">
            "A legacy of Swiss perfection, curated for the modern connoisseur."
          </p>
        </div>

        {/* Minimal Navigation */}
        <nav className="flex flex-wrap justify-center gap-x-16 gap-y-6">
          {['Collections', 'The Atelier', 'Boutique', 'Heritage'].map((item) => (
            <a 
              key={item} 
              href="#" 
              className="text-[10px] uppercase tracking-[0.5em] font-black text-ganache-rich/40 hover:text-copper-accent transition-all duration-700"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Social Curations */}
        <div className="flex gap-10 pt-4">
          {['camera', 'share', 'language'].map((icon) => (
            <a 
              key={icon} 
              href="#" 
              className="w-10 h-10 rounded-full border border-ganache-rich/5 flex items-center justify-center hover:bg-ganache-rich hover:text-silk-base transition-all duration-700 group"
            >
              <span className="material-symbols-outlined text-lg font-light opacity-40 group-hover:opacity-100 transition-opacity">{icon}</span>
            </a>
          ))}
        </div>

        {/* Legal Strip */}
        <div className="w-full pt-24 border-t border-ganache-rich/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[9px] uppercase tracking-[0.3em] font-black text-ganache-rich/20">
            &copy; {new Date().getFullYear()} Jabal Al Ayham. Regional Boutique.
          </div>
          <div className="flex gap-8 text-[9px] uppercase tracking-[0.3em] font-black text-ganache-rich/20">
            <a href="#" className="hover:text-copper-accent transition-all">Privacy Archive</a>
            <a href="#" className="hover:text-copper-accent transition-all">Terms of Curating</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
