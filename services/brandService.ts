import { api } from '@/services/api';
import { ApiResponse } from '@/types/common';

export interface CreateBrandPayload {
  name: string;
  code: string;
  slug: string;
  description?: string;
  image?: string;
  status: 'ACTIVE' | 'INACTIVE';
  isActive: boolean;
}

export interface BrandRecord extends CreateBrandPayload {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export const brandService = {
  list: async (): Promise<ApiResponse<{ items: BrandRecord[] }>> => {
    const response = await api.get<ApiResponse<{ items: BrandRecord[] }>>('/master/brands');
    return response.data;
  },
  create: async (payload: CreateBrandPayload): Promise<ApiResponse<BrandRecord>> => {
    const response = await api.post<ApiResponse<BrandRecord>>('/master/brands', payload);
    return response.data;
  },
  update: async (id: string, payload: Partial<CreateBrandPayload>): Promise<ApiResponse<BrandRecord>> => {
    const response = await api.put<ApiResponse<BrandRecord>>(`/master/brands/${id}`, payload);
    return response.data;
  },
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/master/brands/${id}`);
    return response.data;
  },
};
