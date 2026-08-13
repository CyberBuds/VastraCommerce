import { api } from '@/services/api';
import { ApiResponse } from '@/types/common';

export type MasterStatus = 'ACTIVE' | 'INACTIVE';

export interface MasterPayload {
  name: string;
  code: string;
  slug: string;
  description?: string;
  status: MasterStatus;
  isActive: boolean;
  groupId?: number;
}

export interface MasterRecord extends MasterPayload {
  id: number;
  createdAt: string;
  updatedAt: string;
}

const createMasterService = (path: string) => ({
  create: async (payload: MasterPayload) => (await api.post<ApiResponse<MasterRecord>>(path, payload)).data,
  update: async (id: string, payload: Partial<MasterPayload>) => (await api.put<ApiResponse<MasterRecord>>(`${path}/${id}`, payload)).data,
  delete: async (id: string) => (await api.delete<ApiResponse<null>>(`${path}/${id}`)).data,
});

export const collectionService = createMasterService('/master/collections');
export const productTypeService = createMasterService('/master/product-types');
export const attributeGroupService = createMasterService('/master/attribute-groups');
export const attributeService = createMasterService('/master/attributes');

export interface AttributeValuePayload {
  value: string;
  code?: string;
  slug?: string;
  extra?: string;
  status?: MasterStatus;
  isActive?: boolean;
}

export const attributeValueService = {
  create: async (attributeId: string, payload: AttributeValuePayload) =>
    (await api.post<ApiResponse<{ id: number }>>(`/master/attributes/${attributeId}/values`, payload)).data,
  delete: async (attributeId: string, valueId: string) =>
    (await api.delete<ApiResponse<null>>(`/master/attributes/${attributeId}/values/${valueId}`)).data,
};
