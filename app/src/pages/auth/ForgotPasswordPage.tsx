import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { Package, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    setSubmitted(true);
    toast.success('Reset link sent!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Package className="w-7 h-7 text-[#22C55E]" />
            <span className="text-xl font-bold font-[Poppins]"><span className="text-[#0F172A]">Inven</span><span className="text-[#22C55E]">Track</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-[#0F172A] font-[Poppins]">Reset Password</h1>
          <p className="text-sm text-[#64748B] mt-1">Enter your email and we'll send you a reset link</p>
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 outline-none transition-all"
              />
              <button type="submit" className="w-full py-2.5 bg-[#22C55E] text-white font-medium rounded-lg hover:bg-[#16A34A] transition-colors">
                Send Reset Link
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <CheckCircle className="w-12 h-12 text-[#22C55E] mx-auto mb-4" />
              <p className="text-[#0F172A] font-medium mb-2">Check your email</p>
              <p className="text-sm text-[#64748B] mb-4">We've sent password reset instructions to {email}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-sm text-[#64748B] mt-6">
          <Link to="/login" className="text-[#3B82F6] font-medium hover:underline">Back to Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
