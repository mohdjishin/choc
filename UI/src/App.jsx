import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast';
import Loading from './components/Loading';

const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Store = React.lazy(() => import('./pages/Store'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Orders = React.lazy(() => import('./pages/Orders'));

import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';

import PageWrapper from './components/PageWrapper';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="bg-silk-base text-ganache-rich antialiased overflow-x-hidden selection:bg-copper-accent selection:text-white min-h-screen relative">
      {/* Global Background Texture */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
      
      <div className="relative z-10">
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#2D1B14',
            color: '#FDFBF7',
            borderRadius: '2rem',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontWeight: 'bold',
            padding: '1rem 2rem',
            border: '1px solid rgba(193,154,107,0.2)',
          },
        }}
      />
      {!isAuthPage && <Navbar />}
      <CartDrawer />
      <React.Suspense fallback={<Loading />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/store" element={<PageWrapper><Store /></PageWrapper>} />
            <Route path="/product/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
            <Route 
              path="/dashboard" 
              element={
                <PageWrapper>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </PageWrapper>
              } 
            />
            <Route 
              path="/orders" 
              element={
                <PageWrapper>
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                </PageWrapper>
              } 
            />
            <Route path="/unauthorized" element={
              <PageWrapper>
                <div className="flex flex-col items-center justify-center h-[70vh] text-[#2D1B14] px-4 text-center">
                  <h1 className="text-4xl font-serif italic text-ganache-rich">Unauthorized Access</h1>
                  <p className="mt-4 font-sans uppercase tracking-widest text-[10px] text-ganache-rich/60 leading-loose">You do not have the clearance levels required to access the Boutique Archives.</p>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="mt-12 bg-ganache-rich text-silk-base px-10 py-4 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-copper-accent transition-all shadow-2xl"
                  >
                    Return to Maison
                  </button>
                </div>
              </PageWrapper>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </React.Suspense>
      {!isAuthPage && <Footer />}
      </div>
    </div>
  )
}

import { WishlistProvider } from './context/WishlistContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App
