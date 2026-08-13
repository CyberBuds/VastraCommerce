import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/authStore';
import { ApiResponse } from '@/types/common';

// Create a real Axios Instance
export const api: AxiosInstance = axios.create({
  // Use the environment variable for the API base URL
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Send the access token with the first request as well.  Previously the token
// was only added after an error response, so protected create endpoints always
// started by returning 401.
api.interceptors.request.use((request) => {
  const token = useAuthStore.getState().tokens?.accessToken;
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

// Mock database structures persisted in LocalStorage to behave like a 100% real server
const LOCAL_DB_KEYS = {
  products: 'ent_mock_db_products',
  categories: 'ent_mock_db_categories',
  users: 'ent_mock_db_users',
};

// Seed mock products
const DEFAULT_PRODUCTS = Array.from({ length: 45 }).map((_, i) => ({
  id: `prod-${i + 1}`,
  name: [
    'AeroFlow Turbine X1',
    'Quantum Spark Plug',
    'Industrial Hydraulic Fluid',
    'Carbon Fiber Strut',
    'GigaCharge battery pack',
    'Precision Laser Meter',
    'Heavy Duty Steel Rebar',
    'Solar Cell Monocrystalline',
  ][i % 8] + ` (Batch #${1000 + i})`,
  sku: `SKU-AERO-${10000 + i}`,
  category: ['Turbines', 'Auto Components', 'Fluids', 'Structural', 'Electrical', 'Instruments'][i % 6],
  price: parseFloat((150 + i * 49.99).toFixed(2)),
  stock: Math.floor(Math.random() * 250) + 10,
  status: Math.random() > 0.15 ? 'ACTIVE' : 'OUT_OF_STOCK',
  createdAt: new Date(Date.now() - i * 8 * 3600 * 1000).toISOString(),
}));

// Seed categories
const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Turbines', code: 'TURB', count: 12, status: 'ACTIVE' },
  { id: 'cat-2', name: 'Auto Components', code: 'AUTO', count: 8, status: 'ACTIVE' },
  { id: 'cat-3', name: 'Fluids', code: 'FLUI', count: 15, status: 'ACTIVE' },
  { id: 'cat-4', name: 'Structural', code: 'STRU', count: 20, status: 'ACTIVE' },
  { id: 'cat-5', name: 'Electrical', code: 'ELEC', count: 32, status: 'ACTIVE' },
  { id: 'cat-6', name: 'Instruments', code: 'INST', count: 6, status: 'ACTIVE' },
];

// Seed users for user administration
const DEFAULT_USERS = [
  { id: 'u-1', email: 'ykgupta042@gmail.com', firstName: 'Yash', lastName: 'Gupta', role: 'SUPER_ADMIN', status: 'ACTIVE' },
  { id: 'u-2', email: 'admin@enterprise.com', firstName: 'Sarah', lastName: 'Connor', role: 'ADMIN', status: 'ACTIVE' },
  { id: 'u-3', email: 'manager@enterprise.com', firstName: 'Michael', lastName: 'Scott', role: 'MANAGER', status: 'ACTIVE' },
  { id: 'u-4', email: 'operator@enterprise.com', firstName: 'Dwight', lastName: 'Schrute', role: 'OPERATOR', status: 'INACTIVE' },
];

function getLocalDb<T>(key: string, defaultData: T[]): T[] {
  if (typeof window === 'undefined') return defaultData;
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(item);
}

function setLocalDb<T>(key: string, data: T[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Interceptor 3: Auth Error and Token Refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Inject Authorization Header on each request
    if (!originalRequest.headers.Authorization) {
        const tokens = useAuthStore.getState().tokens;
        if (tokens?.accessToken) {
            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
    }

    // Retry Logic for temporary network failures (only if not an authorization error)
    if (error.code === 'ECONNABORTED' && !originalRequest._retry) {
      originalRequest._retry = true;
      return api(originalRequest);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const tokens = await useAuthStore.getState().refreshToken();
        processQueue(null, tokens.accessToken);
        originalRequest.headers.Authorization = 'Bearer ' + tokens.accessToken;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Enterprise Feature API Base Class
export class BaseFeatureApi<T> {
  protected basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  async getAll(params?: any): Promise<ApiResponse<T[]>> {
    const response = await api.get<ApiResponse<T[]>>(this.basePath, { params });
    return response.data;
  }

  async getPaginated(params?: any): Promise<ApiResponse<{ data: T[]; total: number; page: number; limit: number; totalPages: number }>> {
    const response = await api.get(this.basePath, { params });
    return response.data;
  }

  async getById(id: string | number): Promise<ApiResponse<T>> {
    const response = await api.get<ApiResponse<T>>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    const response = await api.post<ApiResponse<T>>(this.basePath, data);
    return response.data;
  }

  async update(id: string | number, data: Partial<T>): Promise<ApiResponse<T>> {
    const response = await api.put<ApiResponse<T>>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async delete(id: string | number): Promise<ApiResponse<{ id: string | number }>> {
    const response = await api.delete<ApiResponse<{ id: string | number }>>(`${this.basePath}/${id}`);
    return response.data;
  }
}
