import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Store, Warehouse,
  FileText, AlertTriangle, PieChart, BarChart3, Settings, PlusCircle,
  DollarSign, ChevronLeft, ChevronRight, Menu,
} from 'lucide-react';
import type { UserRole } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Package, ShoppingCart, Users, Store, Warehouse,
  FileText, AlertTriangle, PieChart, BarChart3, Settings, PlusCircle, DollarSign,
};

const navConfigs: Record<UserRole, { label: string; path: string; icon: string }[]> = {
  vendor: [
    { label: 'Dashboard', path: '/vendor/dashboard', icon: 'LayoutDashboard' },
    { label: 'Products', path: '/vendor/products', icon: 'Package' },
    { label: 'Add Product', path: '/vendor/products/add', icon: 'PlusCircle' },
    { label: 'Orders', path: '/vendor/orders', icon: 'ShoppingCart' },
    { label: 'Inventory', path: '/vendor/inventory', icon: 'Warehouse' },
    { label: 'Earnings', path: '/vendor/earnings', icon: 'DollarSign' },
    { label: 'Analytics', path: '/vendor/analytics', icon: 'BarChart3' },
    { label: 'Settings', path: '/vendor/settings', icon: 'Settings' },
  ],
  inventory_manager: [
    { label: 'Dashboard', path: '/inventory/dashboard', icon: 'LayoutDashboard' },
    { label: 'Inventory', path: '/inventory/items', icon: 'Package' },
    { label: 'Warehouses', path: '/inventory/warehouses', icon: 'Warehouse' },
    { label: 'Suppliers', path: '/inventory/suppliers', icon: 'Users' },
    { label: 'Purchase Orders', path: '/inventory/purchase-orders', icon: 'FileText' },
    { label: 'Low Stock Alerts', path: '/inventory/low-stock', icon: 'AlertTriangle' },
    { label: 'Reports', path: '/inventory/reports', icon: 'PieChart' },
    { label: 'Settings', path: '/inventory/settings', icon: 'Settings' },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard' },
    { label: 'Users', path: '/admin/users', icon: 'Users' },
    { label: 'Vendors', path: '/admin/vendors', icon: 'Store' },
    { label: 'Products', path: '/admin/products', icon: 'Package' },
    { label: 'Orders', path: '/admin/orders', icon: 'ShoppingCart' },
    { label: 'Inventory', path: '/admin/inventory', icon: 'Warehouse' },
    { label: 'Analytics', path: '/admin/analytics', icon: 'BarChart3' },
    { label: 'Reports', path: '/admin/reports', icon: 'FileText' },
    { label: 'Settings', path: '/admin/settings', icon: 'Settings' },
  ],
  customer: [],
};

interface SidebarProps {
  role: UserRole;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ role, collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const items = navConfigs[role] || [];

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onMobileClose} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-[#111827] border-r border-[#1F2937] z-50 transition-all duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0
          ${collapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'}
          w-[260px]
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#1F2937]">
          <div className={`flex items-center gap-2 overflow-hidden ${collapsed ? 'lg:w-0 lg:opacity-0' : ''} transition-all duration-300`}>
            <Package className="w-6 h-6 text-[#22C55E] shrink-0" />
            <span className="text-lg font-bold font-[Poppins] whitespace-nowrap">
              <span className="text-[#F9FAFB]">Inven</span>
              <span className="text-[#22C55E]">Track</span>
            </span>
          </div>
          <button onClick={onToggle} className="hidden lg:flex p-1.5 rounded-lg hover:bg-[#1F2937] text-[#9CA3AF] transition-colors">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <button onClick={onMobileClose} className="lg:hidden p-1.5 rounded-lg hover:bg-[#1F2937] text-[#9CA3AF]">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto scrollbar-thin" style={{ height: 'calc(100vh - 64px)' }}>
          {items.map((item) => {
            const Icon = iconMap[item.icon] || Package;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-[rgba(34,197,94,0.08)] text-[#F9FAFB] border-l-[3px] border-[#22C55E]'
                    : 'text-[#9CA3AF] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#F9FAFB] border-l-[3px] border-transparent'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className={`text-sm font-medium whitespace-nowrap ${collapsed ? 'lg:hidden' : ''} transition-all duration-300`}>
                  {item.label}
                </span>
                {collapsed && (
                  <span className="absolute left-full ml-2 px-2 py-1 bg-[#1F2937] text-xs text-[#F9FAFB] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-[#2D3748]">
                    {item.label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
