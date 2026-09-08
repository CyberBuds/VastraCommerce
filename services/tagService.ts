import { api } from '@/services/api';
import { ApiResponse } from '@/types/common';

export interface TagPayload {
  name: string;
  code: string;
  slug: string;
  status: 'ACTIVE' | 'INACTIVE';
  isActive: boolean;
}

export interface TagRecord extends TagPayload {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export const tagService = {
  list: async (): Promise<ApiResponse<{ items: TagRecord[] }>> => {
    const response = await api.get<ApiResponse<{ items: TagRecord[] }>>('/master/product-tags');
    return response.data;
  },
  create: async (payload: TagPayload): Promise<ApiResponse<TagRecord>> => {
    const response = await api.post<ApiResponse<TagRecord>>('/master/product-tags', payload);
    return response.data;
  },
  update: async (id: string, payload: Partial<TagPayload>): Promise<ApiResponse<TagRecord>> => {
    const response = await api.put<ApiResponse<TagRecord>>(`/master/product-tags/${id}`, payload);
    return response.data;
  },
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/master/product-tags/${id}`);
    return response.data;
  },
};
