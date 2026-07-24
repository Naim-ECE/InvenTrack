export const USER_ROLES = ['customer', 'vendor', 'inventory_manager', 'admin'];

export const normalizeRole = (role, fallback = 'customer') => {
  const nextRole = typeof role === 'string' ? role.trim().toLowerCase() : '';

  if (!nextRole) {
    return fallback;
  }

  if (nextRole === 'manager') {
    return 'inventory_manager';
  }

  return USER_ROLES.includes(nextRole) ? nextRole : fallback;
};

export const normalizeUserDocument = (user) => {
  if (!user) return user;

  if (typeof user.toJSON === 'function') {
    const plainUser = user.toJSON();
    plainUser.role = normalizeRole(plainUser.role);
    return plainUser;
  }

  return {
    ...user,
    role: normalizeRole(user.role),
  };
};
