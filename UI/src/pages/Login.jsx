import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);
    if (result.success) {
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] relative overflow-hidden font-body-md px-4">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] scale-150"></div>
      
      <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-[radial-gradient(circle,rgba(193,154,107,0.15)_0%,transparent_70%)] rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[80%] h-[80%] bg-[radial-gradient(circle,rgba(45,27,20,0.08)_0%,transparent_70%)] rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[520px] z-10"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.2 }}
            className="mb-8"
          >
            <div className="w-20 h-20 bg-gradient-to-tr from-[#2D1B14] to-[#4A2D22] rounded-full mx-auto flex items-center justify-center shadow-2xl relative group">
              <div className="absolute inset-0 rounded-full border border-[#C19A6B]/30 animate-ping opacity-20"></div>
              <span className="text-[#C19A6B] text-3xl italic font-serif">A</span>
            </div>
            <h2 className="text-[14px] uppercase tracking-[1em] text-[#C19A6B] font-bold mt-8">Jabal Al Ayham</h2>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C19A6B]/40 to-transparent mx-auto mt-6"></div>
          </motion.div>
          <h1 className="text-6xl font-headline-lg italic text-[#2D1B14] tracking-tight mb-4">The Collection</h1>
          <p className="text-[#2D1B14]/40 text-sm italic font-medium">Access your private inventory of fine confectionery</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[4rem] p-12 md:p-16 shadow-[0_60px_120px_-30px_rgba(45,27,20,0.15)] border border-white relative overflow-hidden">
          {/* Decorative Corner */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#C19A6B]/10 to-transparent rounded-full blur-2xl"></div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-900/70 p-6 rounded-[2rem] mb-10 text-xs text-center border border-red-100 font-bold uppercase tracking-widest"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-4">
              <label className="text-[11px] uppercase tracking-[0.3em] text-[#2D1B14]/40 font-black ml-6">Email Address</label>
              <div className="relative group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FDFBF7]/50 border border-ganache-rich/5 py-6 px-10 rounded-full text-[#2D1B14] placeholder:text-[#2D1B14]/20 focus:ring-4 focus:ring-[#C19A6B]/10 focus:border-[#C19A6B]/20 outline-none transition-all duration-700 text-sm font-medium shadow-inner"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-6">
                <label className="text-[11px] uppercase tracking-[0.3em] text-[#2D1B14]/40 font-black">Password</label>
                <a href="#" className="text-[9px] uppercase tracking-widest text-[#C19A6B] font-bold hover:text-[#2D1B14] transition-colors">Forgot?</a>
              </div>
              <div className="relative group">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FDFBF7]/50 border border-ganache-rich/5 py-6 px-10 rounded-full text-[#2D1B14] placeholder:text-[#2D1B14]/20 focus:ring-4 focus:ring-[#C19A6B]/10 focus:border-[#C19A6B]/20 outline-none transition-all duration-700 text-sm font-medium shadow-inner"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="pt-6">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 30px 60px -12px rgba(45,27,20,0.3)' }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#2D1B14] via-[#4A2D22] to-[#2D1B14] bg-[length:200%_auto] hover:bg-right text-[#FDFBF7] font-bold py-6 px-8 rounded-full transition-all duration-1000 uppercase tracking-[0.4em] text-[12px] flex items-center justify-center space-x-3 disabled:opacity-70 shadow-2xl shadow-[#2D1B14]/20 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Sign In</span>}
              </motion.button>
            </div>
          </form>

          <div className="mt-12 text-center">
            <p className="text-xs text-[#2D1B14]/30 font-medium tracking-wide">
              New to the Maison?{' '}
              <Link to="/register" className="text-[#C19A6B] hover:text-[#2D1B14] font-bold transition-all underline underline-offset-8 decoration-[#C19A6B]/30 hover:decoration-[#C19A6B]">
                Create an Account
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 opacity-20">
            <div className="w-12 h-[1px] bg-[#2D1B14]"></div>
            <p className="text-[10px] uppercase tracking-[1.2em] text-[#2D1B14] font-bold translate-x-[0.6em]">EST. 1984</p>
            <div className="w-12 h-[1px] bg-[#2D1B14]"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
