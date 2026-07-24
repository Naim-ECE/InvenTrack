import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import type { UserRole } from '@/types';
import { getRoleHomePath, normalizeUserRole } from '@/lib/roles';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const activeRole = user ? normalizeUserRole(user.role) : 'customer';

  if (user && !allowedRoles.includes(activeRole)) {
    return <Navigate to={getRoleHomePath(activeRole)} replace />;
  }

  return <Outlet />;
}
