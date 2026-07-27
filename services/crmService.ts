import { BaseFeatureApi, api } from '@/services/api';
import { Customer, CustomerGroup, CustomerSegment, SupportTicket, WalletTransaction } from '@/types/customer';
import { ApiResponse } from '@/types/common';

class CustomerService extends BaseFeatureApi<Customer> {
  constructor() {
    super('/api/crm/customers');
  }

  // Support for nested adjustments directly through axios
  async adjustWallet(customerId: string, data: { type: 'CREDIT' | 'DEBIT'; amount: number; purpose: WalletTransaction['purpose']; notes?: string; approvedBy?: string }) {
    const response = await api.put<ApiResponse<any>>(`/api/crm/customers/${customerId}/wallet`, data);
    return response.data;
  }

  async adjustPoints(customerId: string, data: { type: 'EARNED' | 'REDEEMED' | 'EXPIRED'; points: number; reason: string; referenceId?: string }) {
    const response = await api.put<ApiResponse<any>>(`/api/crm/customers/${customerId}/points`, data);
    return response.data;
  }

  async addNote(customerId: string, data: { content: string; type: 'PRIVATE' | 'PUBLIC'; author: string }) {
    const response = await api.post<ApiResponse<any>>(`/api/crm/customers/${customerId}/notes`, data);
    return response.data;
  }

  async deleteNote(customerId: string, noteId: string) {
    const response = await api.delete<ApiResponse<any>>(`/api/crm/customers/${customerId}/notes/${noteId}`);
    return response.data;
  }

  async togglePinNote(customerId: string, noteId: string) {
    const response = await api.put<ApiResponse<any>>(`/api/crm/customers/${customerId}/notes/${noteId}/pin`);
    return response.data;
  }

  // Tickets
  async addTicket(customerId: string, data: { title: string; department: SupportTicket['department']; priority: SupportTicket['priority']; category: string; initialMessage: string; attachments?: string[] }) {
    const response = await api.post<ApiResponse<SupportTicket>>(`/api/crm/customers/${customerId}/tickets`, data);
    return response.data;
  }

  async addTicketMessage(ticketId: string, data: { sender: 'CUSTOMER' | 'STAFF' | 'SYSTEM'; senderName: string; content: string; attachments?: string[] }) {
    const response = await api.post<ApiResponse<any>>(`/api/crm/tickets/${ticketId}/messages`, data);
    return response.data;
  }

  async updateTicketStatus(ticketId: string, status: SupportTicket['status']) {
    const response = await api.put<ApiResponse<any>>(`/api/crm/tickets/${ticketId}/status`, { status });
    return response.data;
  }

  async assignTicket(ticketId: string, data: { staffId: string; staffName: string }) {
    const response = await api.put<ApiResponse<any>>(`/api/crm/tickets/${ticketId}/assign`, data);
    return response.data;
  }

  // Bulk actions
  async bulkUpdateStatus(ids: string[], status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED') {
    const response = await api.post<ApiResponse<any>>('/api/crm/customers/bulk-status', { ids, status });
    return response.data;
  }

  async bulkDelete(ids: string[]) {
    const response = await api.post<ApiResponse<any>>('/api/crm/customers/bulk-delete', { ids });
    return response.data;
  }

  async bulkAssignGroup(ids: string[], data: { groupId: string; groupName: string }) {
    const response = await api.post<ApiResponse<any>>('/api/crm/customers/bulk-assign-group', { ids, ...data });
    return response.data;
  }
}

class CustomerGroupService extends BaseFeatureApi<CustomerGroup> {
  constructor() {
    super('/api/crm/groups');
  }
}

class CustomerSegmentService extends BaseFeatureApi<CustomerSegment> {
  constructor() {
    super('/api/crm/segments');
  }
}

export const customerService = new CustomerService();
export const customerGroupService = new CustomerGroupService();
export const customerSegmentService = new CustomerSegmentService();
