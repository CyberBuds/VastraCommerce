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
