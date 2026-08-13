import * as React from 'react';
import { useAuthStore } from '@/store/authStore';
import { User, UserPermission, UserRole } from '@/types/auth';

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

  // Memoize the flattened permissions list to avoid re-computation on every render
  const userPermissions = React.useMemo<UserPermission[]>(() => {
  if (!user?.permissions) {
    return [];
  }

  return user.permissions;
}, [user?.permissions]);

  const checkPermission = (permission?: UserPermission | string): boolean => {
    if (!permission) return true; // No permission required
    if (!isAuthenticated || !user) return false;

    // SUPER_ADMIN has master access
    if (user.role?.name === 'Super Admin') return true;

    return userPermissions.includes(permission as UserPermission);
  };

  const hasAnyPermission = (permissions: (UserPermission | string)[]): boolean => {
    if (permissions.length === 0) return true;
    if (!isAuthenticated || !user) return false;
    if (user.role?.name === 'Super Admin') return true;

    return permissions.some((perm) => checkPermission(perm));
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!isAuthenticated || !user) return false;
    const userRoleName = user.role?.name;
    if (!userRoleName) return false;

    if (Array.isArray(role)) {
      return role.includes(userRoleName as UserRole);
    }
    return userRoleName === role;
  };

  const isSuperAdmin = (): boolean => {
    return hasRole('Super Admin');
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
    userRole: user?.role?.name as UserRole | undefined,
    userPermissions,
  };
}
