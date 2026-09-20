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
  list: async () => (await api.get<ApiResponse<{ items: MasterRecord[] }>>(path)).data,
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

interface AttributeValueRecord {
  id: number;
  value: string;
  code?: string;
  extra?: string;
}

type AttributeValueListResponse = ApiResponse<AttributeValueRecord[] | { items: AttributeValueRecord[] }>;

export const attributeValueService = {
  list: async (attributeId: string) =>
    (await api.get<AttributeValueListResponse>(`/master/attributes/${attributeId}/values`)).data,
  update: async (attributeId: string, valueId: string, payload: AttributeValuePayload) =>
    (await api.put<ApiResponse<{ id: number }>>(`/master/attributes/${attributeId}/values/${valueId}`, payload)).data,
  create: async (attributeId: string, payload: AttributeValuePayload) =>
    (await api.post<ApiResponse<{ id: number }>>(`/master/attributes/${attributeId}/values`, payload)).data,
  delete: async (attributeId: string, valueId: string) =>
    (await api.delete<ApiResponse<null>>(`/master/attributes/${attributeId}/values/${valueId}`)).data,
};

export async function loadAttributesWithValues() {
  const response = await attributeService.list();
  const attributes = await Promise.all(response.data.items.map(async (item) => {
    const valuesResponse = await attributeValueService.list(String(item.id));
    const rawValues = Array.isArray(valuesResponse.data) ? valuesResponse.data : valuesResponse.data?.items || [];
    return {
      id: String(item.id),
      groupId: item.groupId ? String(item.groupId) : '',
      name: item.name,
      type: (item as MasterRecord & { type?: 'text' | 'color' | 'image' }).type || 'text',
      values: rawValues.map((value) => ({
        id: String(value.id),
        value: value.value,
        label: value.value,
        extra: value.extra,
      })),
      createdAt: item.createdAt,
    };
  }));
  return attributes;
}
