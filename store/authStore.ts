import { create } from 'zustand';
import { AuthState, User, AuthTokens, UserRole, UserPermission } from '@/types/auth';
import { loginApi } from '@/services/authService';

interface AuthActions {
  login: (email: string, arg2?: string | UserRole, arg3?: UserRole | boolean, arg4?: boolean) => Promise<User>;
  logout: () => void;
  refreshToken: () => Promise<AuthTokens>;
  updateUser: (user: Partial<User>) => void;
  setAuthenticating: (isAuthenticating: boolean) => void;
  checkSession: () => void;
}

const DEFAULT_PERMISSIONS: Record<UserRole, UserPermission[]> = {
  SUPER_ADMIN: [
    'view:dashboard',
    'manage:system',
    'view:catalog',
    'manage:catalog',
    'view:inventory',
    'manage:inventory',
    'view:customers',
    'manage:customers',
    'view:orders',
    'manage:orders',
    'view:payments',
    'manage:payments',
    'view:marketing',
    'manage:marketing',
    'view:cms',
    'manage:cms',
    'view:reports',
    'manage:reports',
    'view:settings',
    'manage:settings',
    'view:administration',
    'manage:administration',
  ],
  ADMIN: [
    'view:dashboard',
    'view:catalog',
    'manage:catalog',
    'view:inventory',
    'manage:inventory',
    'view:customers',
    'manage:customers',
    'view:orders',
    'manage:orders',
    'view:payments',
    'manage:payments',
    'view:marketing',
    'view:cms',
    'view:reports',
    'view:settings',
    'manage:settings',
    'view:administration',
  ],
  MANAGER: [
    'view:dashboard',
    'view:catalog',
    'manage:catalog',
    'view:inventory',
    'manage:inventory',
    'view:customers',
    'view:orders',
    'manage:orders',
    'view:payments',
    'view:reports',
    'view:settings',
  ],
  OPERATOR: [
    'view:dashboard',
    'view:catalog',
    'view:inventory',
    'view:customers',
    'view:orders',
    'view:payments',
    'view:reports',
  ],
};

const MOCK_USERS: Record<string, Omit<User, 'permissions'>> = {
  'ykgupta042@gmail.com': {
    id: 'u-1',
    email: 'ykgupta042@gmail.com',
    firstName: 'Yash',
    lastName: 'Gupta',
    avatarUrl: 'https://picsum.photos/seed/yash/200',
    role: 'SUPER_ADMIN',
    createdAt: '2026-01-01T00:00:00Z',
    lastLoginAt: '2026-07-20T06:00:00Z',
  },
  'admin@enterprise.com': {
    id: 'u-2',
    email: 'admin@enterprise.com',
    firstName: 'Sarah',
    lastName: 'Connor',
    avatarUrl: 'https://picsum.photos/seed/sarah/200',
    role: 'ADMIN',
    createdAt: '2026-01-02T00:00:00Z',
    lastLoginAt: '2026-07-20T05:00:00Z',
  },
  'manager@enterprise.com': {
    id: 'u-3',
    email: 'manager@enterprise.com',
    firstName: 'Michael',
    lastName: 'Scott',
    avatarUrl: 'https://picsum.photos/seed/michael/200',
    role: 'MANAGER',
    createdAt: '2026-02-15T00:00:00Z',
    lastLoginAt: '2026-07-20T04:30:00Z',
  },
  'operator@enterprise.com': {
    id: 'u-4',
    email: 'operator@enterprise.com',
    firstName: 'Dwight',
    lastName: 'Schrute',
    avatarUrl: 'https://picsum.photos/seed/dwight/200',
    role: 'OPERATOR',
    createdAt: '2026-03-10T00:00:00Z',
    lastLoginAt: '2026-07-20T04:00:00Z',
  },
};

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  rememberMe: false,
  isAuthenticating: true,

  setAuthenticating: (isAuthenticating) => set({ isAuthenticating }),

  login: async (email: string, arg2?: string | UserRole, arg3?: UserRole | boolean, arg4?: boolean) => {
    set({ isAuthenticating: true });

    let password = 'Admin@123';
    let role: UserRole = 'SUPER_ADMIN';
    let rememberMe = true;

    if (typeof arg2 === 'string') {
      if (['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'OPERATOR'].includes(arg2)) {
        role = arg2 as UserRole;
        if (typeof arg3 === 'boolean') rememberMe = arg3;
      } else {
        password = arg2;
        if (typeof arg3 === 'string' && ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'OPERATOR'].includes(arg3)) {
          role = arg3 as UserRole;
        }
        if (typeof arg4 === 'boolean') rememberMe = arg4;
      }
    } else if (typeof arg2 === 'boolean') {
      rememberMe = arg2;
    }

    try {
      // Call external API: POST https://ecommerce-api-p93q.onrender.com/api/v1/auth/login
      const res = await loginApi({ email, password });

      let accessToken = '';
      let refreshToken = '';

      if (res.success && res.data) {
        accessToken = res.data.accessToken;
        refreshToken = res.data.refreshToken;
      } else if (res.message && !res.success) {
        throw new Error(res.message || 'Login failed');
      }

      // Fallback tokens if required
      if (!accessToken) {
        accessToken = `mock-access-jwt-${btoa(JSON.stringify({ email, exp: Date.now() + 15 * 60 * 1000 }))}`;
        refreshToken = `mock-refresh-jwt-${btoa(JSON.stringify({ email, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }))}`;
      }

      // Try parsing token JWT payload if present
      let sub = 'u-1';
      try {
        if (accessToken.includes('.')) {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          if (payload.sub) sub = `u-${payload.sub}`;
        }
      } catch (e) {
        // ignore JWT parse errors
      }

      const lowercaseEmail = email.toLowerCase();
      let templateUser = MOCK_USERS[lowercaseEmail];

      if (!templateUser) {
        const firstPart = lowercaseEmail.split('@')[0];
        templateUser = {
          id: sub || `u-${Math.random().toString(36).substr(2, 9)}`,
          email: lowercaseEmail,
          firstName: firstPart.charAt(0).toUpperCase() + firstPart.slice(1),
          lastName: 'Enterprise User',
          avatarUrl: `https://picsum.photos/seed/${firstPart}/200`,
          role,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
      } else {
        templateUser = { ...templateUser, role };
      }

      const permissions = DEFAULT_PERMISSIONS[role];
      const user: User = { ...templateUser, permissions };

      const tokens: AuthTokens = {
        accessToken,
        refreshToken,
        expiresIn: 3600,
      };

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('ent_auth_user', JSON.stringify(user));
      storage.setItem('ent_auth_tokens', JSON.stringify(tokens));
      storage.setItem('ent_remember_me', JSON.stringify(rememberMe));

      set({
        user,
        tokens,
        isAuthenticated: true,
        rememberMe,
        isAuthenticating: false,
      });

      return user;
    } catch (error: any) {
      set({ isAuthenticating: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('ent_auth_user');
    localStorage.removeItem('ent_auth_tokens');
    localStorage.removeItem('ent_remember_me');
    sessionStorage.removeItem('ent_auth_user');
    sessionStorage.removeItem('ent_auth_tokens');

    set({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isAuthenticating: false,
    });
  },

  refreshToken: async () => {
    const currentTokens = get().tokens;
    if (!currentTokens) {
      throw new Error('No refresh token available');
    }

    // Delay simulation
    await new Promise((resolve) => setTimeout(resolve, 300));

    const user = get().user!;
    const newTokens: AuthTokens = {
      accessToken: `mock-access-jwt-${btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 15 * 60 * 1000 }))}`,
      refreshToken: currentTokens.refreshToken, // keep same refresh
      expiresIn: 900,
    };

    const storage = get().rememberMe ? localStorage : sessionStorage;
    storage.setItem('ent_auth_tokens', JSON.stringify(newTokens));

    set({ tokens: newTokens });
    return newTokens;
  },

  updateUser: (updatedFields) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const user = { ...currentUser, ...updatedFields };
    const storage = get().rememberMe ? localStorage : sessionStorage;
    storage.setItem('ent_auth_user', JSON.stringify(user));

    set({ user });
  },

  checkSession: () => {
    let rememberMe = false;
    let storedUser: string | null = null;
    let storedTokens: string | null = null;

    // Check remember me setting first
    const remValue = localStorage.getItem('ent_remember_me');
    if (remValue) {
      rememberMe = JSON.parse(remValue);
    }

    const storage = rememberMe ? localStorage : sessionStorage;
    storedUser = storage.getItem('ent_auth_user');
    storedTokens = storage.getItem('ent_auth_tokens');

    // If rememberMe wasn't true but we have session storage data, restore it
    if (!storedUser || !storedTokens) {
      storedUser = sessionStorage.getItem('ent_auth_user');
      storedTokens = sessionStorage.getItem('ent_auth_tokens');
    }

    if (storedUser && storedTokens) {
      try {
        const user = JSON.parse(storedUser);
        const tokens = JSON.parse(storedTokens);
        set({
          user,
          tokens,
          isAuthenticated: true,
          rememberMe,
          isAuthenticating: false,
        });
        return;
      } catch (e) {
        console.error('Failed to parse active user session');
      }
    }

    set({ isAuthenticating: false });
  },
}));
