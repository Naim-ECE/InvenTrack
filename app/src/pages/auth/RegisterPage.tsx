import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Package, Eye, EyeOff } from 'lucide-react';
import type { UserRole } from '@/types';
import { motion } from 'framer-motion';
import { getRoleHomePath } from '@/lib/roles';

const roles: { value: UserRole; label: string }[] = [
  { value: 'customer', label: 'Customer' },
  { value: 'vendor', label: 'Vendor' },
  { value: 'inventory_manager', label: 'Inventory Manager' },
  { value: 'admin', label: 'Admin' },
];

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { register, googleLogin, isLoading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!agreed) {
      toast.error('Please agree to the terms');
      return;
    }
    try {
      const user = await register(name, email, password, role);
      toast.success('Account created successfully!');
      navigate(getRoleHomePath(user.role));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const handleGoogleRegister = async () => {
    if (!agreed) {
      toast.error('Please agree to the terms');
      return;
    }
    try {
      const user = await googleLogin(role);
      toast.success('Account created successfully!');
      navigate(getRoleHomePath(user.role));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Google sign-up failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] flex items-center justify-center px-4 py-8">
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
          <h1 className="text-2xl font-bold text-[#0F172A] font-[Poppins]">Create Account</h1>
          <p className="text-sm text-[#64748B] mt-1">Join the InvenTrack ecosystem</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6">
          {roles.map((r) => (
            <button key={r.value} onClick={() => setRole(r.value)} className={`py-2 px-3 text-xs font-medium rounded-lg transition-all ${role === r.value ? 'bg-[#22C55E] text-white' : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'}`}>
              {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 outline-none transition-all" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 outline-none transition-all" />

          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 outline-none transition-all pr-10" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
          </div>

          {password.length > 0 && (
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors ${i <= passwordStrength ? passwordStrength <= 1 ? 'bg-[#EF4444]' : passwordStrength <= 2 ? 'bg-[#F59E0B]' : 'bg-[#22C55E]' : 'bg-[#E2E8F0]'}`} />
              ))}
            </div>
          )}

          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 outline-none transition-all" />

          <label className="flex items-center gap-2 text-sm text-[#64748B]">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="rounded border-[#E2E8F0] text-[#22C55E] focus:ring-[#22C55E]" />
            I agree to the Terms of Service and Privacy Policy
          </label>

          <button type="submit" disabled={isLoading} className="w-full py-2.5 bg-[#22C55E] text-white font-medium rounded-lg hover:bg-[#16A34A] transition-colors disabled:opacity-50">
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#E2E8F0]" />
          <span className="text-xs text-[#94A3B8]">or</span>
          <div className="h-px flex-1 bg-[#E2E8F0]" />
        </div>

        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={isLoading}
          className="w-full py-2.5 bg-white border border-[#E2E8F0] text-[#0F172A] font-medium rounded-lg hover:bg-[#F8FAFC] transition-colors disabled:opacity-50"
        >
          Sign up with Google
        </button>

        <p className="text-center text-sm text-[#64748B] mt-6">Already have an account? <Link to="/login" className="text-[#3B82F6] font-medium hover:underline">Sign In</Link></p>
      </motion.div>
    </div>
  );
}
