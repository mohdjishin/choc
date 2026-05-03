import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-silk-base">
      <div className="relative w-32 h-32">
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 border-2 border-copper-accent/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Animated Arc */}
        <motion.div
          className="absolute inset-0 border-t-2 border-copper-accent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Center Logo/Icon Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0.3, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="w-12 h-12 bg-ganache-rich/10 rounded-full flex items-center justify-center"
          >
            <div className="w-6 h-6 bg-copper-accent rounded-sm rotate-45" />
          </motion.div>
        </div>
      </div>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 font-label-sm text-[10px] uppercase tracking-[0.5em] text-ganache-rich/40 font-bold"
      >
        Maison Al Ayham
      </motion.p>
    </div>
  );
};

export default Loading;
