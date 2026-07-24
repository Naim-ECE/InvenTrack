import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import MarketplaceLayout from './components/layout/MarketplaceLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';

import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ShopPage from './pages/customer/ShopPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrdersPage from './pages/customer/OrdersPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';
import WishlistPage from './pages/customer/WishlistPage';
import ProfilePage from './pages/customer/ProfilePage';

import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorProducts from './pages/vendor/VendorProducts';
import VendorProductForm from './pages/vendor/VendorProductForm';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorInventory from './pages/vendor/VendorInventory';
import VendorEarnings from './pages/vendor/VendorEarnings';
import VendorAnalytics from './pages/vendor/VendorAnalytics';
import VendorSettings from './pages/vendor/VendorSettings';

import InventoryDashboard from './pages/inventory/InventoryDashboard';
import InventoryList from './pages/inventory/InventoryList';
import Warehouses from './pages/inventory/Warehouses';
import Suppliers from './pages/inventory/Suppliers';
import PurchaseRecords from './pages/inventory/PurchaseRecords';
import LowStockAlerts from './pages/inventory/LowStockAlerts';
import InventoryReports from './pages/inventory/InventoryReports';
import InventorySettings from './pages/inventory/InventorySettings';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVendors from './pages/admin/AdminVendors';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminInventory from './pages/admin/AdminInventory';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

import ToastContainer from './components/ui/ToastContainer';

export default function App() {
  const theme = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    document.body.classList.toggle('dark', theme === 'dark');
    document.body.style.colorScheme = theme;
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route element={<MarketplaceLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route element={<ProtectedRoute allowedRoles={['customer', 'vendor', 'inventory_manager', 'admin']} />}>
          <Route element={<MarketplaceLayout />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id/track" element={<OrderTrackingPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
          <Route element={<DashboardLayout role="vendor" />}>
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/products" element={<VendorProducts />} />
            <Route path="/vendor/products/add" element={<VendorProductForm />} />
            <Route path="/vendor/products/edit/:id" element={<VendorProductForm />} />
            <Route path="/vendor/orders" element={<VendorOrders />} />
            <Route path="/vendor/inventory" element={<VendorInventory />} />
            <Route path="/vendor/earnings" element={<VendorEarnings />} />
            <Route path="/vendor/analytics" element={<VendorAnalytics />} />
            <Route path="/vendor/settings" element={<VendorSettings />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['inventory_manager']} />}>
          <Route element={<DashboardLayout role="inventory_manager" />}>
            <Route path="/inventory/dashboard" element={<InventoryDashboard />} />
            <Route path="/inventory/items" element={<InventoryList />} />
            <Route path="/inventory/warehouses" element={<Warehouses />} />
            <Route path="/inventory/suppliers" element={<Suppliers />} />
            <Route path="/inventory/purchase-orders" element={<PurchaseRecords />} />
            <Route path="/inventory/low-stock" element={<LowStockAlerts />} />
            <Route path="/inventory/reports" element={<InventoryReports />} />
            <Route path="/inventory/settings" element={<InventorySettings />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<DashboardLayout role="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/vendors" element={<AdminVendors />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/inventory" element={<AdminInventory />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  );
}
