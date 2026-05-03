import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="w-full min-h-[80vh] bg-silk-base px-8 lg:px-24 py-20 space-y-24">
      {/* Hero Skeleton */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="col-span-6 space-y-12">
          <div className="h-4 w-48 shimmer rounded-full" />
          <div className="h-32 w-full shimmer rounded-[2rem]" />
          <div className="space-y-4">
            <div className="h-4 w-3/4 shimmer rounded-full" />
            <div className="h-4 w-1/2 shimmer rounded-full" />
          </div>
          <div className="h-16 w-64 shimmer rounded-full" />
        </div>
        <div className="col-span-6 h-[600px] shimmer rounded-[3rem]" />
      </div>

      {/* Grid Skeleton */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 pt-24">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-8">
            <div className="aspect-[4/5] shimmer rounded-sm" />
            <div className="space-y-4">
              <div className="h-2 w-20 shimmer rounded-full" />
              <div className="h-8 w-40 shimmer rounded-full" />
              <div className="h-6 w-24 shimmer rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
