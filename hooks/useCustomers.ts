import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService, customerGroupService, customerSegmentService } from '@/services/crmService';
import { Customer, CustomerGroup, CustomerSegment, SupportTicket, WalletTransaction } from '@/types/customer';
import { toast } from 'sonner';

// ==========================================
// 1. CUSTOMERS QUERY HOOKS
// ==========================================

export function useCustomers(params?: { search?: string; groupId?: string; status?: string }) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: async () => {
      const response = await customerService.getAll(params);
      return response.data || [];
    },
  });
}

export function useCustomer(id?: string) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await customerService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

// ==========================================
// 2. GROUPS & SEGMENTS QUERY HOOKS
// ==========================================

export function useCustomerGroups() {
  return useQuery({
    queryKey: ['customer-groups'],
    queryFn: async () => {
      const response = await customerGroupService.getAll();
      return response.data || [];
    },
  });
}

export function useCustomerSegments() {
  return useQuery({
    queryKey: ['customer-segments'],
    queryFn: async () => {
      const response = await customerSegmentService.getAll();
      return response.data || [];
    },
  });
}

// ==========================================
// 3. MUTATIONS (CREATE/UPDATE/DELETE)
// ==========================================

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Customer>) => customerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer-segments'] });
      toast.success('Customer profile created successfully.');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create customer profile.');
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) => customerService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['customer-segments'] });
      toast.success('Customer profile updated successfully.');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update customer profile.');
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer-segments'] });
      toast.success('Customer account deleted successfully.');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete customer account.');
    },
  });
}

// ==========================================
// 4. FINANCIAL & LOYALTY ADJUSTMENTS
// ==========================================

export function useWalletAdjustment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: { type: 'CREDIT' | 'DEBIT'; amount: number; purpose: WalletTransaction['purpose']; notes?: string; approvedBy?: string } }) =>
      customerService.adjustWallet(customerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
      queryClient.invalidateQueries({ queryKey: ['customer-segments'] });
      toast.success(`Wallet balance successfully ${variables.data.type === 'CREDIT' ? 'credited' : 'debited'}.`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to complete wallet adjustment.');
    },
  });
}

export function usePointsAdjustment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: { type: 'EARNED' | 'REDEEMED' | 'EXPIRED'; points: number; reason: string; referenceId?: string } }) =>
      customerService.adjustPoints(customerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
      queryClient.invalidateQueries({ queryKey: ['customer-segments'] });
      toast.success(`Loyalty points successfully ${variables.data.type === 'EARNED' ? 'added' : 'deducted'}.`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to adjust reward points.');
    },
  });
}

// ==========================================
// 5. CRM INTERACTIONS (NOTES & SUPPORT)
// ==========================================

export function useAddCustomerNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: { content: string; type: 'PRIVATE' | 'PUBLIC'; author: string } }) =>
      customerService.addNote(customerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
      toast.success('Internal CRM note logged.');
    },
  });
}

export function useDeleteCustomerNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, noteId }: { customerId: string; noteId: string }) =>
      customerService.deleteNote(customerId, noteId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
      toast.success('CRM note removed.');
    },
  });
}

export function useTogglePinCustomerNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, noteId }: { customerId: string; noteId: string }) =>
      customerService.togglePinNote(customerId, noteId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
    },
  });
}

// Support Tickets
export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: { title: string; department: SupportTicket['department']; priority: SupportTicket['priority']; category: string; initialMessage: string; attachments?: string[] } }) =>
      customerService.addTicket(customerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
      toast.success('Support ticket opened successfully.');
    },
  });
}

export function useAddTicketMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, ticketId, data }: { customerId: string; ticketId: string; data: { sender: 'CUSTOMER' | 'STAFF' | 'SYSTEM'; senderName: string; content: string; attachments?: string[] } }) =>
      customerService.addTicketMessage(ticketId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
      toast.success('Response logged.');
    },
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, ticketId, status }: { customerId: string; ticketId: string; status: SupportTicket['status'] }) =>
      customerService.updateTicketStatus(ticketId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
      toast.success('Ticket status changed.');
    },
  });
}

export function useAssignTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, ticketId, data }: { customerId: string; ticketId: string; data: { staffId: string; staffName: string } }) =>
      customerService.assignTicket(ticketId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
      toast.success('Support agent assigned.');
    },
  });
}

// ==========================================
// 6. BULK MANAGEMENT HOOKS
// ==========================================

export function useBulkDeleteCustomers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => customerService.bulkDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer-segments'] });
      toast.success('Bulk accounts purged.');
    },
  });
}

export function useBulkUpdateCustomerStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' }) =>
      customerService.bulkUpdateStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Bulk statuses updated.');
    },
  });
}

export function useBulkAssignCustomerGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, groupId, groupName }: { ids: string[]; groupId: string; groupName: string }) =>
      customerService.bulkAssignGroup(ids, { groupId, groupName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer-segments'] });
      toast.success('Bulk customer tiers reassigned.');
    },
  });
}

// ==========================================
// 7. GROUPS & SEGMENTS MUTATIONS
// ==========================================

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<CustomerGroup, 'id' | 'createdAt'>) => customerGroupService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-groups'] });
      toast.success('Loyalty / Pricing tier tier added.');
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomerGroup> }) => customerGroupService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-groups'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Loyalty / Pricing tier revised.');
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customerGroupService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-groups'] });
      toast.success('Customer group removed.');
    },
  });
}

// Segments
export function useCreateSegment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<CustomerSegment, 'id' | 'createdAt' | 'memberCount'>) => customerSegmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-segments'] });
      toast.success('Dynamic demographic segment generated.');
    },
  });
}

export function useUpdateSegment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomerSegment> }) => customerSegmentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-segments'] });
      toast.success('Segment query filters revised.');
    },
  });
}

export function useDeleteSegment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customerSegmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-segments'] });
      toast.success('Customer segment purged.');
    },
  });
}
