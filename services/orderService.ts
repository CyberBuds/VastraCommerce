import { BaseFeatureApi, api } from '@/services/api';
import { Order, Invoice, Shipment, ReturnRequest, TrackingDetail } from '@/types/order';
import { ApiResponse } from '@/types/common';

class OrderService extends BaseFeatureApi<Order> {
  constructor() {
    super('/orders');
  }

  async getAll(params?: { search?: string; status?: string }) {
    const response = await api.get<ApiResponse<{ items: any[] }>>('/orders', {
      params: { ...params, orderStatus: params?.status || undefined }
    });
    const payload = response.data;
    return {
      ...payload,
      data: (payload.data?.items || []).map((order) => ({
        id: String(order.id),
        orderNumber: order.orderNumber,
        customerId: String(order.customerId || ''),
        customerName: [order.customer?.firstName, order.customer?.lastName].filter(Boolean).join(' ') || 'Customer',
        customerEmail: order.customer?.email || '',
        customerPhone: order.customer?.mobile || '',
        items: [],
        subtotal: Number(order.subtotal || 0),
        tax: Number(order.taxAmount || 0),
        shippingCost: Number(order.shippingCharge || 0),
        discount: Number(order.discountAmount || 0) + Number(order.couponDiscount || 0),
        totalAmount: Number(order.grandTotal || 0),
        status: order.orderStatus,
        paymentStatus: order.paymentStatus === 'CAPTURED' ? 'PAID' : order.paymentStatus === 'REFUNDED' ? 'REFUNDED' : 'UNPAID',
        paymentMethod: order.paymentMethod === 'COD' ? 'CASH_ON_DELIVERY' : order.paymentMethod,
        shippingMethod: order.shippingMethod?.name || 'STANDARD',
        shippingAddress: order.shippingAddress ? {
          id: String(order.shippingAddress.id), type: order.shippingAddress.addressType,
          isDefault: Boolean(order.shippingAddress.isDefaultShipping), name: '', phone: order.customer?.mobile || '',
          addressLine1: order.shippingAddress.addressLine1, addressLine2: order.shippingAddress.addressLine2 || undefined,
          city: order.shippingAddress.city, state: order.shippingAddress.state,
          postalCode: order.shippingAddress.pincode, country: order.shippingAddress.country
        } : null,
        billingAddress: order.billingAddress ? {
          id: String(order.billingAddress.id), type: order.billingAddress.addressType,
          isDefault: Boolean(order.billingAddress.isDefaultBilling), name: '', phone: order.customer?.mobile || '',
          addressLine1: order.billingAddress.addressLine1, addressLine2: order.billingAddress.addressLine2 || undefined,
          city: order.billingAddress.city, state: order.billingAddress.state,
          postalCode: order.billingAddress.pincode, country: order.billingAddress.country
        } : null,
        notes: order.remarks || undefined,
        createdAt: order.orderDate || order.createdAt,
        updatedAt: order.updatedAt,
        timeline: []
      })) as Order[]
    };
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
