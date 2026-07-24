export type UserRole = 'customer' | 'vendor' | 'inventory_manager' | 'admin';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: Partial<Address>;
  firebaseUid?: string;
  authProvider?: 'local' | 'google';
  token?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  image: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  vendor: string;
  vendorId: string;
  sku: string;
  stock: number;
  lowStockThreshold?: number;
  status: 'active' | 'pending' | 'draft' | 'rejected';
  variants?: ProductVariant[];
  specifications?: Record<string, string>;
  shipping?: {
    weight: number;
    dimensions: string;
  };
}

export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Address {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  manager: string;
  totalSkus: number;
  stockValue: number;
  capacityUsed: number;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  onTimeDelivery: number;
  avgLeadTime: number;
  totalOrders: number;
  categories: string[];
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  supplierId: string;
  items: POItem[];
  total: number;
  status: 'draft' | 'sent' | 'partial' | 'received' | 'cancelled';
  expectedDate: string;
  createdAt: string;
}

export interface POItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface LowStockAlert {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  currentStock: number;
  threshold: number;
  suggestedReorder: number;
  supplier: string;
  warehouse: string;
}

export interface Notification {
  id: string;
  type: 'order' | 'stock' | 'approval' | 'system' | 'success';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
  slug: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}
