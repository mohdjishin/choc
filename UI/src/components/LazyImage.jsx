import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LazyImage = ({ src, alt, className, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setError(true);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton / Placeholder */}
      <AnimatePresence>
        {!isLoaded && !error && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-ganache-rich/[0.03] overflow-hidden"
          >
            {/* Shimmer Effect */}
            <motion.div
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual Image */}
      <motion.img
        src={src}
        alt={alt}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded ? 1 : 1.05
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
        {...props}
      />

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-ganache-rich/5">
          <span className="text-[10px] uppercase tracking-widest text-ganache-rich/20">Archive unavailable</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
