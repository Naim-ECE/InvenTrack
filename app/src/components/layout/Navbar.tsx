import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, Heart, ShoppingCart, Menu, X, Package, User, LogOut, LayoutDashboard } from 'lucide-react';
import type { RootState } from '@/store';
import { useAuth } from '@/hooks/useAuth';
import { getRoleHomePath } from '@/lib/roles';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const navLinks = [
    { label: 'Shop', path: '/shop' },
    { label: 'Categories', path: '/shop' },
    { label: 'New Arrivals', path: '/shop' },
    { label: 'Deals', path: '/shop' },
  ];

  const getDashboardLink = () => {
    if (!user) return '/';
    return user.role === 'customer' ? '/profile' : getRoleHomePath(user.role);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#E2E8F0] z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Package className="w-6 h-6 text-[#22C55E]" />
          <span className="text-xl font-bold font-[Poppins]">
            <span className="text-[#0F172A]">Inven</span>
            <span className="text-[#22C55E]">Track</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.path} className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/shop')} className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors">
            <Search className="w-5 h-5 text-[#64748B]" />
          </button>

          <Link to="/wishlist" className="relative p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors">
            <Heart className="w-5 h-5 text-[#64748B]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#22C55E] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors">
            <ShoppingCart className="w-5 h-5 text-[#64748B]" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#22C55E] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center text-white text-sm font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#E2E8F0]">
                      <p className="text-sm font-medium text-[#0F172A]">{user?.name}</p>
                      <p className="text-xs text-[#64748B]">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]" onClick={() => setUserMenuOpen(false)}>
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link to="/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]" onClick={() => setUserMenuOpen(false)}>
                      <Package className="w-4 h-4" /> Orders
                    </Link>
                    {user?.role !== 'customer' && (
                      <Link to={getDashboardLink()} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]" onClick={() => setUserMenuOpen(false)}>
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                    )}
                    <button onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#EF4444] hover:bg-[#F8FAFC] w-full text-left">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login" className="hidden md:inline-flex items-center px-4 py-2 bg-[#22C55E] text-white text-sm font-medium rounded-lg hover:bg-[#16A34A] transition-colors">
              Sign In
            </Link>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 hover:bg-[#F1F5F9] rounded-lg">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#E2E8F0] px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.path} className="block py-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A]" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <Link to="/login" className="block py-2 text-sm font-medium text-[#22C55E]" onClick={() => setMenuOpen(false)}>Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
}
