import api from '@/lib/api';
import { LOW_STOCK_THRESHOLD, getStockStatus } from '@/lib/stock';
import type { Category, Product } from '@/types';

type ProductImage = string | { url?: string; publicId?: string };

export type LiveProduct = {
  _id: string;
  id?: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  category?: string | { _id?: string; name?: string; slug?: string; image?: string };
  image?: string;
  images?: ProductImage[];
  rating?: number;
  reviewCount?: number;
  vendor?: string | { _id?: string; storeName?: string; logo?: string };
  vendorId?: string;
  sku: string;
  stock: number;
  lowStockThreshold?: number;
  status: Product['status'];
  variants?: Product['variants'];
  specifications?: Record<string, string>;
  shipping?: Product['shipping'];
};

export type ProductPayload = {
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  category: string;
  sku: string;
  stock: number;
  lowStockThreshold?: number;
  status?: Product['status'];
  images?: string[];
  specifications?: Record<string, string>;
};

const normalizeImages = (images: ProductImage[] | undefined) => (images || [])
  .map((image) => (typeof image === 'string' ? image : image?.url || ''))
  .filter(Boolean);

export const mapLiveProduct = (product: LiveProduct): Product => {
  const images = normalizeImages(product.images);
  const vendor = typeof product.vendor === 'string' ? product.vendor : product.vendor?.storeName || 'Vendor';
  const category = typeof product.category === 'string' ? product.category : product.category?.name || 'Category';
  const stock = Number(product.stock || 0);

  return {
    id: product.id || product._id,
    name: product.name,
    description: product.description,
    shortDescription: product.shortDescription,
    price: product.price,
    originalPrice: product.originalPrice,
    category,
    image: product.image || images[0] || '',
    images,
    rating: product.rating ?? 0,
    reviewCount: product.reviewCount ?? 0,
    vendor,
    vendorId: product.vendorId || '',
    sku: product.sku,
    stock,
    lowStockThreshold: product.lowStockThreshold ?? LOW_STOCK_THRESHOLD,
    status: product.status,
    variants: product.variants,
    specifications: product.specifications,
    shipping: product.shipping,
  };
};

export const productApi = {
  getProducts: async (params?: Record<string, string | number | boolean | undefined>) => {
    const { data } = await api.get<{ products: LiveProduct[]; total: number; page: number; pages: number }>('/api/products', { params });
    return { ...data, products: data.products.map(mapLiveProduct) };
  },
  getProductById: async (id: string) => {
    const { data } = await api.get<{ product: LiveProduct }>(`/api/products/${id}`);
    return mapLiveProduct(data.product);
  },
  getCategories: async () => {
    const { data } = await api.get<{ categories: Category[] }>('/api/products/categories');
    return data.categories;
  },
  createProduct: async (payload: ProductPayload) => {
    const { data } = await api.post<{ product: LiveProduct }>('/api/products', payload);
    return mapLiveProduct(data.product);
  },
  updateProduct: async (id: string, payload: ProductPayload) => {
    const { data } = await api.put<{ product: LiveProduct }>(`/api/products/${id}`, payload);
    return mapLiveProduct(data.product);
  },
  uploadProductImage: async (file: File, folder = 'products') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const { data } = await api.post<{ url: string; publicId: string }>('/api/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data;
  },
  getStockStatus,
};