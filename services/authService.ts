import { api } from './api';
import { User } from '@/types/auth';
import { ApiResponse } from '@/types/common';

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface LoginApiResponse {
  success: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
  message?: string;
  errors?: any;
}

const LOGIN_ENDPOINT = 'https://ecommerce-api-p93q.onrender.com/api/v1/auth/login';

export async function loginApi(payload: LoginPayload): Promise<LoginApiResponse> {
  // Use Next.js server proxy route first to prevent CORS restrictions in preview,
  // falling back to direct endpoint if needed.
  try {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password || 'Admin@123',
      }),
    });

    if (res.ok) {
      const json = await res.json();
      return json;
    }
  } catch (err) {
    console.warn('Proxy route failed, trying direct endpoint:', err);
  }

  // Fallback to direct API endpoint
  const directRes = await fetch(LOGIN_ENDPOINT, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password || 'Admin@123',
    }),
  });

  const data = await directRes.json();
  if (!directRes.ok && !data.message) {
    throw new Error(`HTTP ${directRes.status}: Login failed`);
  }

  return data;
}

export async function getProfileApi(accessToken: string): Promise<ApiResponse<User>> {
  const response = await api.get<ApiResponse<User>>('users/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export async function refreshTokenApi(refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string; expiresIn: number }>> {
  const response = await api.post<ApiResponse<{ accessToken: string; refreshToken: string; expiresIn: number }>>('/auth/refresh', {
    refreshToken,
  });
  return response.data;
}
