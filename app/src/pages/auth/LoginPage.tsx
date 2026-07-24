import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Package, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { getRoleHomePath } from '@/lib/roles';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, googleLogin, isLoading, error } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      const user = await login(email, password);
      toast.success('Welcome back!');
      navigate(getRoleHomePath(user.role));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await googleLogin();
      toast.success('Welcome back!');
      navigate(getRoleHomePath(user.role));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Google sign-in failed');
    }
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
            <span className="text-2xl font-bold font-[Poppins]"><span className="text-[#0F172A]">Inven</span><span className="text-[#22C55E]">Track</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-[#0F172A] font-[Poppins]">Welcome Back</h1>
          <p className="text-sm text-[#64748B] mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 outline-none transition-all pr-10"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-[#64748B]">
              <input type="checkbox" className="rounded border-[#E2E8F0] text-[#22C55E] focus:ring-[#22C55E]" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-sm text-[#3B82F6] hover:underline">Forgot password?</Link>
          </div>

          {error && <p className="text-sm text-[#EF4444]">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#22C55E] text-white font-medium rounded-lg hover:bg-[#16A34A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#E2E8F0]" />
          <span className="text-xs text-[#94A3B8]">or</span>
          <div className="h-px flex-1 bg-[#E2E8F0]" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-2.5 bg-white border border-[#E2E8F0] text-[#0F172A] font-medium rounded-lg hover:bg-[#F8FAFC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign in with Google
        </button>

        <p className="text-center text-sm text-[#64748B] mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#3B82F6] font-medium hover:underline">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
}
