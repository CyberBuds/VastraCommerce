export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'OPERATOR';

export interface UserRoleObject {
  id?: string;
  name: UserRole;
  description?: string;
}

export type UserPermission =
  // Dashboard & System
  | 'view:dashboard'
  | 'manage:system'
  // Catalog (View and Manage)
  | 'view:catalog'
  | 'manage:catalog'
  // Inventory (View and Manage)
  | 'view:inventory'
  | 'manage:inventory'
  // Customers (View and Manage)
  | 'view:customers'
  | 'manage:customers'
  // Orders (View and Manage)
  | 'view:orders'
  | 'manage:orders'
  // Payments (View and Manage)
  | 'view:payments'
  | 'manage:payments'
  // Marketing (View and Manage)
  | 'view:marketing'
  | 'manage:marketing'
  // CMS (View and Manage)
  | 'view:cms'
  | 'manage:cms'
  // Reports (View and Manage)
  | 'view:reports'
  | 'manage:reports'
  // Settings (View and Manage)
  | 'view:settings'
  | 'manage:settings'
  // Administration (View and Manage)
  | 'view:administration'
  | 'manage:administration';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: UserRoleObject;
  permissions: UserPermission[];
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  isAuthenticating: boolean;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}
