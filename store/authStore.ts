import { create } from 'zustand';
import { AuthState, User, AuthTokens, UserRole, UserPermission } from '@/types/auth';
import { loginApi, getProfileApi, refreshTokenApi } from '@/services/authService';

interface AuthActions {
  login: (email: string, arg2?: string | UserRole, arg3?: UserRole | boolean, arg4?: boolean) => Promise<User>;
  logout: () => void;
  refreshToken: () => Promise<AuthTokens>;
  updateUser: (user: Partial<User>) => void;
  setAuthenticating: (isAuthenticating: boolean) => void;
  checkSession: () => void;
}

function normalizeUser(rawUser: User & { role?: User['role'] & { permissions?: Array<{ permission?: { resource?: string; action?: string }; resource?: string; action?: string }> } }): User {
  const roleName = rawUser.role?.name;
  const normalizedRole = roleName === 'Super Admin'
    ? 'SUPER_ADMIN'
    : roleName === 'Admin'
      ? 'ADMIN'
      : roleName === 'Manager'
        ? 'MANAGER'
        : roleName === 'Operator'
          ? 'OPERATOR'
          : roleName;

  const permissions = rawUser.role?.permissions?.flatMap((entry) => {
    const permission = entry.permission || entry;
    if (!permission.resource || !permission.action) return [];
    const resource = permission.resource.toLowerCase();
    const action = permission.action.toUpperCase();
    return [action === 'VIEW' ? `view:${resource}` : `manage:${resource}`] as UserPermission[];
  }) || rawUser.permissions || [];

  return {
    ...rawUser,
    role: rawUser.role ? { ...rawUser.role, name: normalizedRole as UserRole } : rawUser.role,
    permissions: [...new Set(permissions)],
  };
}

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
      const loginResponse = await loginApi({ email, password });

      if (!loginResponse.success || !loginResponse.data) {
        throw new Error(loginResponse.message || 'Login failed');
      }

      const { accessToken, refreshToken } = loginResponse.data;

      const tokens: AuthTokens = {
        accessToken,
        refreshToken,
        expiresIn: loginResponse.data.expiresIn,
      };

      const userResponse = await getProfileApi(accessToken);
      const user = normalizeUser(userResponse.data);

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

    const response = await refreshTokenApi(currentTokens.refreshToken);

    if (!response.success || !response.data) {
      get().logout(); // Logout if refresh fails
      throw new Error(response.message || 'Session expired. Please log in again.');
    }

    const newTokens: AuthTokens = {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
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
        const user = normalizeUser(JSON.parse(storedUser));
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
