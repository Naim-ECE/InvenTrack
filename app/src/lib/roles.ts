import type { UserRole } from '@/types';

const roleHomePaths: Record<UserRole, string> = {
  customer: '/shop',
  vendor: '/vendor/dashboard',
  inventory_manager: '/inventory/dashboard',
  admin: '/admin/dashboard',
};

export const normalizeUserRole = (role?: string | null): UserRole => {
  if (role === 'manager') {
    return 'inventory_manager';
  }

  if (role === 'vendor' || role === 'inventory_manager' || role === 'admin' || role === 'customer') {
    return role;
  }

  return 'customer';
};

export const getRoleHomePath = (role?: string | null) => roleHomePaths[normalizeUserRole(role)];
