import { useAuthStore } from '@/store/authStore';
import { UserPermission, UserRole } from '@/types/auth';

export function usePermission() {
  const { user, isAuthenticated } = useAuthStore();

  const hasPermission = (permission: UserPermission | undefined): boolean => {
    if (!permission) return true; // No permission required
    if (!isAuthenticated || !user) return false;
    
    // SUPER_ADMIN has master access bypass
    if (user.role === 'SUPER_ADMIN') return true;

    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: UserPermission[]): boolean => {
    if (permissions.length === 0) return true;
    if (!isAuthenticated || !user) return false;
    if (user.role === 'SUPER_ADMIN') return true;

    return permissions.some((perm) => user.permissions.includes(perm));
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!isAuthenticated || !user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  const isSuperAdmin = (): boolean => {
    return hasRole('SUPER_ADMIN');
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasRole,
    isSuperAdmin,
    userRole: user?.role,
    userPermissions: user?.permissions || [],
  };
}
