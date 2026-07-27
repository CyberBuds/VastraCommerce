import { BaseFeatureApi, api } from '@/services/api';
import { Order, Invoice, Shipment, ReturnRequest, TrackingDetail } from '@/types/order';
import { ApiResponse } from '@/types/common';

class OrderService extends BaseFeatureApi<Order> {
  constructor() {
    super('/api/orders');
  }

  async hold(orderId: string, reason: string): Promise<ApiResponse<Order>> {
    const response = await api.put<ApiResponse<Order>>(`/api/orders/${orderId}/hold`, { reason });
    return response.data;
  }

  async release(orderId: string): Promise<ApiResponse<Order>> {
    const response = await api.put<ApiResponse<Order>>(`/api/orders/${orderId}/release`);
    return response.data;
  }

  async addTimeline(orderId: string, data: { status: string; title: string; description: string; actor: string }): Promise<ApiResponse<Order>> {
    const response = await api.post<ApiResponse<Order>>(`/api/orders/${orderId}/timeline`, data);
    return response.data;
  }

  async cancel(orderId: string, reason: string): Promise<ApiResponse<Order>> {
    const response = await api.put<ApiResponse<Order>>(`/api/orders/${orderId}/cancel`, { reason });
    return response.data;
  }

  // Picking & Packing actions
  async startPicking(orderId: string): Promise<ApiResponse<Order>> {
    const response = await api.put<ApiResponse<Order>>(`/api/orders/${orderId}/picking/start`);
    return response.data;
  }

  async updateItemPicking(orderId: string, itemId: string, status: 'PICKED' | 'SHORTAGE' | 'PENDING'): Promise<ApiResponse<Order>> {
    const response = await api.put<ApiResponse<Order>>(`/api/orders/${orderId}/picking/items/${itemId}`, { status });
    return response.data;
  }

  async completePicking(orderId: string): Promise<ApiResponse<Order>> {
    const response = await api.put<ApiResponse<Order>>(`/api/orders/${orderId}/picking/complete`);
    return response.data;
  }

  async updateItemPacking(orderId: string, itemId: string, status: 'PACKED' | 'DAMAGED' | 'PENDING'): Promise<ApiResponse<Order>> {
    const response = await api.put<ApiResponse<Order>>(`/api/orders/${orderId}/packing/items/${itemId}`, { status });
    return response.data;
  }

  async completePacking(orderId: string): Promise<ApiResponse<Order>> {
    const response = await api.put<ApiResponse<Order>>(`/api/orders/${orderId}/packing/complete`);
    return response.data;
  }
}

class InvoiceService extends BaseFeatureApi<Invoice> {
  constructor() {
    super('/api/invoices');
  }

  async pay(invoiceId: string): Promise<ApiResponse<Invoice>> {
    const response = await api.put<ApiResponse<Invoice>>(`/api/invoices/${invoiceId}/pay`);
    return response.data;
  }

  async void(invoiceId: string): Promise<ApiResponse<Invoice>> {
    const response = await api.put<ApiResponse<Invoice>>(`/api/invoices/${invoiceId}/void`);
    return response.data;
  }
}

class ShipmentService extends BaseFeatureApi<Shipment> {
  constructor() {
    super('/api/shipments');
  }

  async createForOrder(orderId: string, data: { carrier: string; trackingNumber: string; shippingMethod: string; items: { sku: string; qty: number }[] }): Promise<ApiResponse<Shipment>> {
    const response = await api.post<ApiResponse<Shipment>>(`/api/shipments/order/${orderId}`, data);
    return response.data;
  }

  async updateShipmentStatus(shipmentId: string, status: string, details?: string): Promise<ApiResponse<Shipment>> {
    const response = await api.put<ApiResponse<Shipment>>(`/api/shipments/${shipmentId}/status`, { status, details });
    return response.data;
  }
}

class ReturnService extends BaseFeatureApi<ReturnRequest> {
  constructor() {
    super('/api/returns');
  }

  async processReturn(returnId: string, data: { status: string; itemStatuses?: Record<string, string>; customRefundAmount?: number }): Promise<ApiResponse<ReturnRequest>> {
    const response = await api.put<ApiResponse<ReturnRequest>>(`/api/returns/${returnId}/process`, data);
    return response.data;
  }
}

class TrackingService {
  async getByTrackingNumber(trackingNumber: string): Promise<ApiResponse<TrackingDetail>> {
    const response = await api.get<ApiResponse<TrackingDetail>>(`/api/tracking/${trackingNumber}`);
    return response.data;
  }

  async getAll(): Promise<ApiResponse<TrackingDetail[]>> {
    const response = await api.get<ApiResponse<TrackingDetail[]>>('/api/tracking');
    return response.data;
  }
}

export const orderService = new OrderService();
export const invoiceService = new InvoiceService();
export const shipmentService = new ShipmentService();
export const returnService = new ReturnService();
export const trackingService = new TrackingService();
