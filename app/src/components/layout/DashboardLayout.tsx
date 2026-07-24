import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import type { UserRole } from '@/types';

interface DashboardLayoutProps {
  role: UserRole;
}

const pageTitles: Record<string, string> = {
  '/vendor/dashboard': 'Vendor Dashboard',
  '/vendor/products': 'My Products',
  '/vendor/products/add': 'Add New Product',
  '/vendor/orders': 'Orders',
  '/vendor/inventory': 'Inventory',
  '/vendor/earnings': 'Earnings',
  '/vendor/analytics': 'Analytics',
  '/vendor/settings': 'Settings',
  '/inventory/dashboard': 'Inventory Dashboard',
  '/inventory/items': 'Inventory',
  '/inventory/warehouses': 'Warehouses',
  '/inventory/suppliers': 'Suppliers',
  '/inventory/purchase-orders': 'Purchase Orders',
  '/inventory/low-stock': 'Low Stock Alerts',
  '/inventory/reports': 'Reports',
  '/inventory/settings': 'Settings',
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/users': 'Users',
  '/admin/vendors': 'Vendors',
  '/admin/products': 'Products',
  '/admin/orders': 'Orders',
  '/admin/inventory': 'Inventory',
  '/admin/analytics': 'Analytics',
  '/admin/reports': 'Reports',
  '/admin/settings': 'Settings',
};

export default function DashboardLayout({ role }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <div className="min-h-screen bg-[#0B1220]">
      <Sidebar
        role={role}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'}`}>
        <TopBar title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
