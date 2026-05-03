import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="bg-silk-base text-ganache-rich antialiased overflow-x-hidden selection:bg-copper-accent selection:text-white min-h-screen">
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/unauthorized" element={
          <div className="flex flex-col items-center justify-center h-[70vh] text-[#2D1B14]">
            <h1 className="text-4xl font-serif italic text-ganache-rich">Unauthorized Access</h1>
            <p className="mt-4 font-sans uppercase tracking-widest text-xs text-ganache-rich/60">You do not have permission to view this page.</p>
            <button 
              onClick={() => window.history.back()}
              className="mt-8 border border-[#C19A6B] px-8 py-3 text-[#C19A6B] hover:bg-[#C19A6B] hover:text-white transition-all uppercase tracking-widest text-xs font-bold"
            >
              Go Back
            </button>
          </div>
        } />
      </Routes>
      {!isAuthPage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App
