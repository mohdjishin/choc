import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Loader2 } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await register(email, password, role);
    if (result.success) {
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } else {
      setError(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] relative overflow-hidden font-body-md px-4">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] scale-150"></div>
      
      <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-[radial-gradient(circle,rgba(193,154,107,0.15)_0%,transparent_70%)] rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-[radial-gradient(circle,rgba(45,27,20,0.08)_0%,transparent_70%)] rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[540px] z-10"
      >
        <div className="text-center mb-10">
           <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.2 }}
            className="mb-8"
          >
            <div className="w-16 h-16 bg-gradient-to-tr from-[#2D1B14] to-[#4A2D22] rounded-full mx-auto flex items-center justify-center shadow-2xl relative">
              <span className="text-[#C19A6B] text-2xl italic font-serif">J</span>
            </div>
            <h2 className="text-[13px] uppercase tracking-[0.9em] text-[#C19A6B] font-bold mt-8">Jabal Al Ayham</h2>
          </motion.div>
          <h1 className="text-5xl font-headline-lg italic text-[#2D1B14] tracking-tight mb-2">Create Account</h1>
          <p className="text-[#2D1B14]/40 text-sm italic font-medium">Join the Maison de Confectionery</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[3.5rem] p-10 md:p-14 shadow-[0_60px_120px_-30px_rgba(45,27,20,0.15)] border border-white relative overflow-hidden">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-900/70 p-5 rounded-[2rem] mb-8 text-xs text-center border border-red-100 font-bold uppercase tracking-widest"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.3em] text-[#2D1B14]/40 font-black ml-6">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FDFBF7]/50 border border-ganache-rich/5 py-5 px-8 rounded-full text-[#2D1B14] placeholder:text-[#2D1B14]/20 focus:ring-4 focus:ring-[#C19A6B]/10 outline-none transition-all duration-700 text-sm shadow-inner font-medium"
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.3em] text-[#2D1B14]/40 font-black ml-6">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FDFBF7]/50 border border-ganache-rich/5 py-5 px-8 rounded-full text-[#2D1B14] placeholder:text-[#2D1B14]/20 focus:ring-4 focus:ring-[#C19A6B]/10 outline-none transition-all duration-700 text-sm shadow-inner font-medium"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-4 pt-2 text-center">
              <label className="text-[11px] uppercase tracking-[0.3em] text-[#2D1B14]/40 font-black">Account Role</label>
              <div className="flex justify-center gap-2">
                {['customer', 'admin', 'super_admin'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`px-4 py-2 rounded-full transition-all text-[9px] uppercase tracking-[0.1em] font-black ${
                      role === r 
                        ? 'bg-[#2D1B14] text-[#FDFBF7] shadow-lg' 
                        : 'bg-[#FDFBF7]/50 text-[#2D1B14]/30 hover:text-[#2D1B14]'
                    }`}
                  >
                    {r.replace('_', ' ')}
                  </button>
                ))}
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
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Register</span>}
              </motion.button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-xs text-[#2D1B14]/30 font-medium">
              Already a member?{' '}
              <Link to="/login" className="text-[#C19A6B] hover:text-[#2D1B14] font-bold transition-all underline underline-offset-8 decoration-[#C19A6B]/30">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
