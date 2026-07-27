import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  orderService, 
  invoiceService, 
  shipmentService, 
  returnService, 
  trackingService 
} from '@/services/orderService';
import { Order, Invoice, Shipment, ReturnRequest, OrderStatus, ShippingMethod } from '@/types/order';
import { toast } from 'sonner';

// ==========================================
// 1. ORDERS QUERY HOOKS
// ==========================================

export function useOrders(params?: { search?: string; status?: string }) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: async () => {
      const response = await orderService.getAll(params);
      return response.data || [];
    },
  });
}

export function useOrder(id?: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await orderService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

// ==========================================
// 2. INVOICES QUERY HOOKS
// ==========================================

export function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const response = await invoiceService.getAll();
      return response.data || [];
    },
  });
}

export function useInvoice(id?: string) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await invoiceService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

// ==========================================
// 3. SHIPMENTS QUERY HOOKS
// ==========================================

export function useShipments() {
  return useQuery({
    queryKey: ['shipments'],
    queryFn: async () => {
      const response = await shipmentService.getAll();
      return response.data || [];
    },
  });
}

export function useShipment(id?: string) {
  return useQuery({
    queryKey: ['shipment', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await shipmentService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

// ==========================================
// 4. RETURNS QUERY HOOKS
// ==========================================

export function useReturns() {
  return useQuery({
    queryKey: ['returns'],
    queryFn: async () => {
      const response = await returnService.getAll();
      return response.data || [];
    },
  });
}

export function useReturn(id?: string) {
  return useQuery({
    queryKey: ['return', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await returnService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

// ==========================================
// 5. TRACKING QUERY HOOKS
// ==========================================

export function useTracking(trackingNumber?: string) {
  return useQuery({
    queryKey: ['tracking', trackingNumber],
    queryFn: async () => {
      if (!trackingNumber) return null;
      const response = await trackingService.getByTrackingNumber(trackingNumber);
      return response.data;
    },
    enabled: !!trackingNumber,
  });
}

export function useAllTracking() {
  return useQuery({
    queryKey: ['all-tracking'],
    queryFn: async () => {
      const response = await trackingService.getAll();
      return response.data || [];
    },
  });
}

// ==========================================
// 6. ORDER OPERATIONS MUTATIONS
// ==========================================

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Order>) => orderService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Enterprise Order registered successfully.');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to register order.');
    }
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Order> }) => orderService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
      toast.success('Order details updated successfully.');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update order details.');
    }
  });
}

export function useHoldOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => orderService.hold(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
      toast.warning('Order placed on administrative hold.');
    }
  });
}

export function useReleaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderService.release(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      toast.success('Administrative hold released successfully.');
    }
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => orderService.cancel(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Order cancelled and funds reversed where applicable.');
    }
  });
}

// ==========================================
// 7. PICKING & PACKING MUTATIONS
// ==========================================

export function useStartPicking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => orderService.startPicking(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      toast.success('Picking sheet generated. Pipeline initiated.');
    }
  });
}

export function useUpdateItemPicking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, itemId, status }: { orderId: string; itemId: string; status: 'PICKED' | 'SHORTAGE' | 'PENDING' }) =>
      orderService.updateItemPicking(orderId, itemId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
    }
  });
}

export function useCompletePicking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => orderService.completePicking(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      toast.success('Picking audited. Handed to packing station.');
    }
  });
}

export function useUpdateItemPacking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, itemId, status }: { orderId: string; itemId: string; status: 'PACKED' | 'DAMAGED' | 'PENDING' }) =>
      orderService.updateItemPacking(orderId, itemId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
    }
  });
}

export function useCompletePacking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => orderService.completePacking(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryKey: ['order', orderId];
      toast.success('Consignment sealed and marked ready for shipping.');
    }
  });
}

// ==========================================
// 8. SHIPPING & INVOICE MUTATIONS
// ==========================================

export function useCreateShipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: { carrier: string; trackingNumber: string; shippingMethod: ShippingMethod; items: { sku: string; qty: number }[] } }) =>
      shipmentService.createForOrder(orderId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['all-tracking'] });
      toast.success('Shipment carrier manifest generated successfully.');
    }
  });
}

export function useUpdateShipmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, details }: { id: string; status: string; details?: string }) =>
      shipmentService.updateShipmentStatus(id, status, details),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['all-tracking'] });
      toast.success(`Shipment routing updated to ${variables.status}.`);
    }
  });
}

export function usePayInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invoiceId: string) => invoiceService.pay(invoiceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Invoice marked as Paid. Financial ledger updated.');
    }
  });
}

export function useVoidInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invoiceId: string) => invoiceService.void(invoiceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.warning('Invoice voided.');
    }
  });
}

// ==========================================
// 9. RETURN REQUESTS MUTATIONS
// ==========================================

export function useCreateReturn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ReturnRequest>) => returnService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Return ledger request logged.');
    }
  });
}

export function useProcessReturn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: string; itemStatuses?: Record<string, string>; customRefundAmount?: number } }) =>
      returnService.processReturn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Return ledger request updated successfully.');
    }
  });
}
