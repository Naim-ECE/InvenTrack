import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0B1220] text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-[#22C55E]" />
              <span className="text-lg font-bold font-[Poppins]">
                <span className="text-white">Inven</span>
                <span className="text-[#22C55E]">Track</span>
              </span>
            </Link>
            <p className="text-sm text-[#9CA3AF] mb-6">Your complete commerce ecosystem. Shop smarter, manage inventory faster, and grow your business.</p>
            <div className="flex gap-4">
              {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                <a key={social} href={`#${social}`} className="w-8 h-8 rounded-full bg-[#1F2937] flex items-center justify-center hover:bg-[#22C55E] transition-colors">
                  <span className="text-xs text-[#9CA3AF] hover:text-white capitalize">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Shop', 'Categories', 'New Arrivals', 'Best Sellers', 'Deals'].map((link) => (
                <li key={link}>
                  <Link to="/shop" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Customer Service</h4>
            <ul className="space-y-2">
              {['Shipping Info', 'Returns Policy', 'FAQ', 'Contact Us', 'Track Order'].map((link) => (
                <li key={link}>
                  <Link to="/" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Careers', 'Blog', 'Privacy Policy', 'Terms of Service'].map((link) => (
                <li key={link}>
                  <Link to="/" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-[#1F2937]">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#6B7280]">&copy; 2024 InvenTrack. All rights reserved.</p>
          <p className="text-sm text-[#6B7280]">Powered by InvenTrack Pro</p>
        </div>
      </div>
    </footer>
  );
}
