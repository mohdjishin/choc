import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Hero = ({ scrollY }) => {
  const { user } = useAuth()
  
  // Parallax calculations
  const calculateTransform = (speedX, speedY, speedRot, speedZ, baseZ = 0) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return 'none'
    }
    const x = scrollY * speedX
    const y = scrollY * speedY
    const rot = scrollY * speedRot
    const z = baseZ + (scrollY * (speedZ * 0.01))
    return `translate3d(${x}px, ${y}px, ${z}px) rotate(${rot}deg)`
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 lg:pt-40 pb-32 lg:pb-section-gap overflow-hidden bg-silk-base perspective-2000">
      {/* GOD Level Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply scale-110 animate-slow-zoom"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-pouring-creamy-milk-into-a-bowl-4340-large.mp4" type="video/mp4" />
        </video>
        {/* Soft Gastronomic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-silk-base via-transparent to-silk-base opacity-60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/40 via-silk-base/60 to-silk-base opacity-80"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-margin-page w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-gutter relative z-10 items-center min-h-[60vh] lg:min-h-[80vh]">
        <div className="col-span-1 lg:col-span-6 space-y-8 lg:space-y-12 z-30 text-center lg:text-left animate-slide-up">
          <div className="inline-block px-5 py-2 rounded-full bg-copper-accent/10 border border-copper-accent/20 mb-4">
            <span className="font-label-sm text-[10px] lg:text-[11px] uppercase tracking-[0.5em] text-copper-accent font-bold">Premium Chocolate Store</span>
          </div>
          <h1 className="font-display-xl text-5xl sm:text-7xl lg:text-[85px] text-ganache-rich leading-[1.05] lg:leading-[0.9] tracking-tighter">
            {user ? (
              <span className="block">
                Welcome, <br className="hidden sm:block" />
                <span className="text-copper-accent italic font-light">{user.email.split('@')[0]}</span>
              </span>
            ) : (
              <span className="block">
                Handmade <br/>
                <span className="text-copper-accent italic font-light">for You.</span>
              </span>
            )}
          </h1>
          <div className="space-y-4">
            <p className="text-xl lg:text-2xl font-headline-sm italic text-ganache-rich/60 leading-relaxed max-w-xl">
              "Each piece is a mix of high-quality dates and dark chocolate, made with love by our family."
            </p>
            <p className="font-body-lg text-body-md lg:text-xl text-ganache-rich/40 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium italic">
              Enjoy our handmade chocolate made from fine dark cocoa and fresh dates. Perfect for sharing with family and friends.
            </p>
          </div>
          <div className="pt-6 lg:pt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8">
            <Link to="/" className="w-full sm:w-auto bg-[#2D1B14] text-white px-14 py-6 font-label-sm text-[11px] uppercase tracking-[0.3em] hover:bg-copper-accent transition-all duration-700 shadow-[0_30px_60px_rgba(45,43,31,0.2)] hover:shadow-[0_40px_80px_rgba(45,43,31,0.3)] flex items-center justify-center gap-4 group rounded-sm font-bold no-underline">
              See All Products
              <span className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform duration-500">east</span>
            </Link>
          </div>
        </div>

        {/* Cinematic Collage with Soft Shadows - Hidden on mobile for cleaner UX */}
        <div className="hidden lg:flex col-span-1 lg:col-span-6 relative h-[800px] w-full items-center justify-center mt-12 lg:mt-0" style={{ transformStyle: 'preserve-3d' }}>
          {/* Main Floating Image (Brand Card) */}
          <div 
            className="absolute w-[70%] right-[0%] top-[5%] z-20 rounded-sm overflow-hidden shadow-[0_40px_100px_rgba(45,43,31,0.15)] border border-white/40 transition-all duration-1000"
            style={{ 
              transform: calculateTransform(0, 0.12, -0.015, 60, 80)
            }}
          >
            <img 
              alt="Jabal Al Ayham Brand Card" 
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-1000" 
              src="/assets/brand-card.png"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10"></div>
          </div>

          {/* Secondary Floating Image (Chocolate Truffles) */}
          <div 
            className="absolute w-[60%] left-[-5%] top-[35%] z-30 rounded-sm overflow-hidden shadow-[0_50px_120px_rgba(45,43,31,0.2)] border border-white/40 transition-all duration-1000"
            style={{ 
              transform: calculateTransform(0, -0.08, 0.02, 120, 200)
            }}
          >
            <img 
              alt="Artisanal Luxury Chocolate Truffles" 
              className="w-full h-auto object-cover hover:scale-110 transition-transform duration-1000" 
              src="/assets/premium-chocolate.png"
            />
          </div>

          {/* Gastronomic Flairs */}
          <div 
            className="absolute top-[15%] left-[25%] w-64 h-64 bg-copper-accent/10 rounded-full blur-[100px]"
            style={{ transform: `translateY(${scrollY * -0.15}px)` }}
          ></div>
          <div 
            className="absolute bottom-[25%] right-[15%] w-80 h-80 bg-copper-accent/5 rounded-full blur-[120px]"
            style={{ transform: `translateY(${scrollY * 0.08}px)` }}
          ></div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-60 z-30 group cursor-pointer">
        <span className="font-label-sm text-[10px] uppercase tracking-[0.5em] text-ganache-rich/70">Experience</span>
        <div className="w-[1px] h-24 bg-gradient-to-b from-copper-accent to-transparent"></div>
      </div>
    </section>
  )
}

export default Hero
