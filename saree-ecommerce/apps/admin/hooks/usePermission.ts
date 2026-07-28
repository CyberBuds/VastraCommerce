import { useAuthStore } from '@/store/authStore';
import { UserPermission, UserRole } from '@/types/auth';

export function usePermission(requiredPermission: UserPermission | string): {
  hasPermission: boolean;
  checkPermission: (permission?: UserPermission | string) => boolean;
  hasAnyPermission: (permissions: (UserPermission | string)[]) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isSuperAdmin: () => boolean;
  userRole: UserRole | undefined;
  userPermissions: UserPermission[];
};
export function usePermission(): {
  hasPermission: (permission?: UserPermission | string) => boolean;
  checkPermission: (permission?: UserPermission | string) => boolean;
  hasAnyPermission: (permissions: (UserPermission | string)[]) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isSuperAdmin: () => boolean;
  userRole: UserRole | undefined;
  userPermissions: UserPermission[];
};
export function usePermission(requiredPermission?: UserPermission | string) {
  const { user, isAuthenticated } = useAuthStore();

  const checkPermission = (permission?: UserPermission | string): boolean => {
    if (!permission) return true; // No permission required
    if (!isAuthenticated || !user) return false;
    
    // SUPER_ADMIN has master access bypass
    if (user.role === 'SUPER_ADMIN') return true;

    if (user.permissions.includes(permission as UserPermission)) return true;

    if (typeof permission === 'string' && (permission.startsWith('Payment.') || permission.startsWith('Finance.'))) {
      return user.permissions.includes('view:payments') || user.permissions.includes('manage:payments') || user.permissions.includes('view:reports') || user.permissions.includes('manage:reports');
    }

    return false;
  };

  const hasAnyPermission = (permissions: (UserPermission | string)[]): boolean => {
    if (permissions.length === 0) return true;
    if (!isAuthenticated || !user) return false;
    if (user.role === 'SUPER_ADMIN') return true;

    return permissions.some((perm) => checkPermission(perm));
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

  const hasPermissionVal = requiredPermission !== undefined
    ? checkPermission(requiredPermission)
    : checkPermission;

  return {
    hasPermission: hasPermissionVal,
    checkPermission,
    hasAnyPermission,
    hasRole,
    isSuperAdmin,
    userRole: user?.role,
    userPermissions: user?.permissions || [],
  };
}
