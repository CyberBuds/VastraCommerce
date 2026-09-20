import { BaseFeatureApi, api } from '@/services/api';
import { Customer, CustomerGroup, CustomerSegment, SupportTicket, WalletTransaction } from '@/types/customer';
import { ApiResponse } from '@/types/common';

class CustomerService extends BaseFeatureApi<Customer> {
  constructor() {
    super('/customers');
  }

  async getAll(params?: { search?: string; groupId?: string; status?: string }) {
    const response = await api.get<ApiResponse<{ items: any[] }>>('/customers', {
      params: { ...params, customerGroupId: params?.groupId || undefined }
    });
    const payload = response.data;
    return {
      ...payload,
      data: (payload.data?.items || []).map((customer) => ({
        id: String(customer.id),
        customerCode: customer.customerCode,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.mobile || '',
        gender: customer.gender,
        status: customer.status === 'SUSPENDED' ? 'BLOCKED' : customer.status,
        emailVerified: Boolean(customer.isEmailVerified),
        phoneVerified: Boolean(customer.isMobileVerified),
        source: 'WEB',
        referralCode: customer.referralCode,
        groupId: customer.customerGroupId ? String(customer.customerGroupId) : '',
        groupName: customer.customerGroup?.name || 'Unassigned',
        tags: [],
        createdAt: customer.createdAt,
        lastLoginAt: customer.lastLogin || undefined,
        addresses: [],
        walletBalance: Number(customer.walletBalance || 0),
        walletTransactions: [],
        rewardPoints: Number(customer.loyaltyPoints || 0),
        rewardPointsHistory: [],
        wishlist: [],
        reviews: [],
        tickets: [],
        notes: [],
        activityLogs: []
      })) as Customer[]
    };
  }

  async getById(id: string | number) {
    const response = await api.get<ApiResponse<any>>(`/customers/${id}`);
    const customer = response.data.data;
    return {
      ...response.data,
      data: {
        id: String(customer.id), customerCode: customer.customerCode,
        firstName: customer.firstName, lastName: customer.lastName, email: customer.email,
        phone: customer.mobile || '', gender: customer.gender,
        status: customer.status === 'SUSPENDED' ? 'BLOCKED' : customer.status,
        emailVerified: Boolean(customer.isEmailVerified), phoneVerified: Boolean(customer.isMobileVerified),
        source: 'WEB', referralCode: customer.referralCode, groupId: customer.customerGroupId ? String(customer.customerGroupId) : '',
        groupName: customer.customerGroup?.name || 'Unassigned', tags: [], createdAt: customer.createdAt,
        lastLoginAt: customer.lastLogin || undefined,
        addresses: (customer.addresses || []).map((address: any) => ({
          id: String(address.id), type: address.addressType, isDefault: Boolean(address.isDefaultShipping || address.isDefaultBilling),
          name: `${customer.firstName} ${customer.lastName}`.trim(), phone: customer.mobile || '',
          addressLine1: address.addressLine1, addressLine2: address.addressLine2 || undefined,
          city: address.city, state: address.state, postalCode: address.pincode, country: address.country
        })),
        walletBalance: Number(customer.walletBalance || 0), walletTransactions: [],
        rewardPoints: Number(customer.loyaltyPoints || 0), rewardPointsHistory: [],
        wishlist: [], reviews: [], tickets: [], notes: [], activityLogs: []
      } as Customer
    };
  }

  // Support for nested adjustments directly through axios
  async adjustWallet(customerId: string, data: { type: 'CREDIT' | 'DEBIT'; amount: number; purpose: WalletTransaction['purpose']; notes?: string; approvedBy?: string }) {
    const response = await api.post<ApiResponse<any>>(`/customers/${customerId}/wallet-transactions`, data);
    return response.data;
  }

  async adjustPoints(customerId: string, data: { type: 'EARNED' | 'REDEEMED' | 'EXPIRED'; points: number; reason: string; referenceId?: string }) {
    const response = await api.post<ApiResponse<any>>(`/customers/${customerId}/loyalty-transactions`, data);
    return response.data;
  }

  async addNote(customerId: string, data: { content: string; type: 'PRIVATE' | 'PUBLIC'; author: string }) {
    const response = await api.post<ApiResponse<any>>(`/customers/${customerId}/notes`, data);
    return response.data;
  }

  async deleteNote(customerId: string, noteId: string) {
    const response = await api.delete<ApiResponse<any>>(`/customers/${customerId}/notes/${noteId}`);
    return response.data;
  }

  async togglePinNote(customerId: string, noteId: string) {
    const response = await api.put<ApiResponse<any>>(`/customers/${customerId}/notes/${noteId}`);
    return response.data;
  }

  // Tickets
  async addTicket(customerId: string, data: { title: string; department: SupportTicket['department']; priority: SupportTicket['priority']; category: string; initialMessage: string; attachments?: string[] }) {
    const response = await api.post<ApiResponse<SupportTicket>>(`/customers/${customerId}/support-tickets`, data);
    return response.data;
  }

  async addTicketMessage(ticketId: string, data: { sender: 'CUSTOMER' | 'STAFF' | 'SYSTEM'; senderName: string; content: string; attachments?: string[] }) {
    const response = await api.post<ApiResponse<any>>(`/customers/tickets/${ticketId}/messages`, data);
    return response.data;
  }

  async updateTicketStatus(ticketId: string, status: SupportTicket['status']) {
    const response = await api.put<ApiResponse<any>>(`/customers/tickets/${ticketId}/status`, { status });
    return response.data;
  }

  async assignTicket(ticketId: string, data: { staffId: string; staffName: string }) {
    const response = await api.put<ApiResponse<any>>(`/customers/tickets/${ticketId}/assign`, data);
    return response.data;
  }

  // Bulk actions
  async bulkUpdateStatus(ids: string[], status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED') {
    const response = await api.post<ApiResponse<any>>('/customers/bulk-status', { ids, status });
    return response.data;
  }

  async bulkDelete(ids: string[]) {
    const response = await api.post<ApiResponse<any>>('/customers/bulk-delete', { ids });
    return response.data;
  }

  async bulkAssignGroup(ids: string[], data: { groupId: string; groupName: string }) {
    const response = await api.post<ApiResponse<any>>('/customers/bulk-assign-group', { ids, ...data });
    return response.data;
  }
}

class CustomerGroupService extends BaseFeatureApi<CustomerGroup> {
  constructor() {
    super('/customers/groups');
  }
}

class CustomerSegmentService extends BaseFeatureApi<CustomerSegment> {
  constructor() {
    super('/customers/segments');
  }
}

export const customerService = new CustomerService();
export const customerGroupService = new CustomerGroupService();
export const customerSegmentService = new CustomerSegmentService();
