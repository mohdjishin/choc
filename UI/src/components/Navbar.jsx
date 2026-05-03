import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { itemCount, setIsDrawerOpen } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 backdrop-blur-md ${isScrolled ? 'bg-silk-base/95 py-4 shadow-[0_10px_40px_rgba(45,23,31,0.03)] border-b border-ganache-rich/5' : 'bg-silk-base/40 py-6 lg:py-8 border-b border-ganache-rich/0'}`}>
        <div className="flex justify-between items-center px-6 lg:px-12 max-w-[1440px] mx-auto relative">
          {/* Left: Desktop Links */}
          <div className="w-1/3 flex justify-start items-center">
            <button 
              className="lg:hidden text-ganache-rich p-2 -ml-2 focus:outline-none touch-manipulation"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <span className="material-symbols-outlined text-3xl font-light">menu</span>
            </button>
            
            <div className="hidden lg:flex items-center gap-10">
              <Link className="group relative font-label-sm text-[11px] uppercase tracking-[0.4em] text-ganache-rich/70 hover:text-ganache-rich transition-all duration-700" to="/store">
                Boutique
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-copper-accent transition-all duration-700 group-hover:w-full"></span>
              </Link>
              {user && user.role === 'customer' && (
                 <Link className="group relative font-label-sm text-[11px] uppercase tracking-[0.4em] text-ganache-rich/70 hover:text-ganache-rich transition-all duration-700" to="/orders">
                  Orders
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-copper-accent transition-all duration-700 group-hover:w-full"></span>
                </Link>
              )}
              {user && (user.role === 'admin' || user.role === 'super_admin') && (
                 <Link className="group relative font-label-sm text-[11px] uppercase tracking-[0.4em] text-ganache-rich/70 hover:text-ganache-rich transition-all duration-700" to="/dashboard">
                  Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-copper-accent transition-all duration-700 group-hover:w-full"></span>
                </Link>
              )}
            </div>
          </div>

          {/* Center: Brand Title (Absolutely Centered) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex justify-center items-center pointer-events-auto">
            <Link to="/" className="text-3xl lg:text-5xl font-bold tracking-[-0.03em] text-ganache-rich whitespace-nowrap group cursor-pointer text-center no-underline font-headline-lg italic">
              Jabal Al Ayham
              <div className="h-[1px] w-0 group-hover:w-full bg-copper-accent transition-all duration-1000 mx-auto mt-[-2px]"></div>
            </Link>
          </div>

          {/* Right: Icons / Auth */}
          <div className="w-1/3 flex justify-end items-center gap-2 lg:gap-6">
            <button className="w-10 h-10 flex items-center justify-center text-ganache-rich hover:text-copper-accent transition-all duration-500 hidden sm:flex">
              <span className="material-symbols-outlined text-[24px] font-light">search</span>
            </button>
            
            {(!user || user.role === 'customer') && (
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="relative w-10 h-10 flex items-center justify-center text-ganache-rich hover:text-copper-accent transition-all duration-500" 
                title="Boutique Bag"
              >
                <span className="material-symbols-outlined text-[24px] font-light">shopping_bag</span>
                {itemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-[#C19A6B] text-white text-[11px] font-black flex items-center justify-center rounded-full shadow-2xl z-10 border border-white/20"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-2 lg:gap-6">
                <Link to="/dashboard" className="w-10 h-10 flex items-center justify-center text-ganache-rich hover:text-copper-accent transition-all duration-500" title="Profile">
                  <span className="material-symbols-outlined text-[24px] font-light">person</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-10 h-10 flex items-center justify-center text-ganache-rich hover:text-red-800 transition-all duration-500 group"
                  title="Logout"
                >
                   <span className="material-symbols-outlined text-[24px] font-light group-hover:scale-110 transition-transform">logout</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="group relative overflow-hidden bg-[#2D1B14] text-[#FDFBF7] px-6 lg:px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-xl shadow-[#2D1B14]/10 hover:shadow-[#C19A6B]/20"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#C19A6B] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-[9999]"
          >
            <div className="absolute inset-0 bg-ganache-rich/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-silk-base shadow-2xl p-10 flex flex-col"
            >
              <div className="flex justify-between items-center mb-16">
                <div className="text-xl font-bold tracking-tight text-ganache-rich">Jabal Al Ayham</div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-ganache-rich">
                  <span className="material-symbols-outlined text-4xl font-light">close</span>
                </button>
              </div>

              <div className="flex flex-col gap-8">
                <Link className="text-4xl font-headline-lg italic text-ganache-rich" to="/store" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
                <Link className="text-4xl font-headline-lg italic text-ganache-rich" to="/store" onClick={() => setMobileMenuOpen(false)}>Our Story</Link>
                {user ? (
                  <>
                    {user && user.role === 'customer' && (
                      <Link className="text-4xl font-headline-lg italic text-ganache-rich" to="/orders" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
                    )}
                    <Link className="text-4xl font-headline-lg italic text-ganache-rich" to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                    <button onClick={handleLogout} className="text-4xl font-headline-lg italic text-red-800 text-left">Logout</button>
                  </>
                ) : (
                  <Link className="text-4xl font-headline-lg italic text-copper-accent" to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
