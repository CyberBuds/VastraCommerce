import { BaseFeatureApi, api } from '@/services/api';
import { Order, Invoice, Shipment, ReturnRequest, TrackingDetail } from '@/types/order';
import { ApiResponse } from '@/types/common';

const resolvePaymentMethod = (order: any): string => {
  const rawMethod = order?.paymentMethod ?? order?.payments?.[0]?.paymentMethod ?? order?.payments?.slice()?.sort((a: any, b: any) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())[0]?.paymentMethod;
  if (!rawMethod) return 'CASH_ON_DELIVERY';

  const normalized = String(rawMethod).trim().toUpperCase();
  if (normalized === 'COD' || normalized === 'CASH_ON_DELIVERY') return 'CASH_ON_DELIVERY';
  return String(rawMethod);
};

const mapInvoice = (invoice: any): Invoice => ({
  id: String(invoice.id),
  invoiceNumber: invoice.invoiceNumber,
  orderId: String(invoice.orderId),
  orderNumber: invoice.order?.orderNumber || '',
  customerId: String(invoice.order?.customerId || ''),
  customerName: [invoice.order?.customer?.firstName, invoice.order?.customer?.lastName].filter(Boolean).join(' ') || 'Customer',
  customerEmail: invoice.order?.customer?.email || '',
  subtotal: Number(invoice.order?.subtotal ?? invoice.netAmount ?? 0),
  tax: Number(invoice.gstAmount || 0),
  totalAmount: Number(invoice.netAmount || 0),
  items: (invoice.order?.items || []).map((item: any) => ({
    id: String(item.id),
    productName: item.productName || item.product?.productName || 'Product',
    sku: item.sku || item.variant?.sku || item.product?.sku || '',
    quantity: Number(item.quantity || 0),
    unitPrice: Number(item.unitPrice || 0),
    total: Number(item.netAmount || 0)
  })),
  status: invoice.invoiceStatus === 'ISSUED' ? 'SENT'
    : invoice.invoiceStatus === 'CANCELLED' ? 'VOID'
    : invoice.invoiceStatus,
  issuedDate: invoice.invoiceDate || invoice.createdAt,
  dueDate: invoice.dueDate || invoice.invoiceDate || invoice.createdAt,
  paidAt: invoice.invoiceStatus === 'PAID' ? invoice.updatedAt : undefined
});

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
        items: (order.items || []).map((item: any) => ({
          id: String(item.id),
          productId: String(item.productId),
          productName: item.productName || item.product?.productName || 'Product',
          sku: item.sku || item.variant?.sku || item.product?.sku || '',
          price: Number(item.unitPrice || 0),
          quantity: Number(item.quantity || 0),
          total: Number(item.netAmount || 0),
          pickingStatus: 'PENDING',
          packingStatus: 'PENDING'
        })),
        subtotal: Number(order.subtotal || 0),
        tax: Number(order.taxAmount || 0),
        shippingCost: Number(order.shippingCharge || 0),
        discount: Number(order.discountAmount || 0) + Number(order.couponDiscount || 0),
        totalAmount: Number(order.grandTotal || 0),
        invoiceId: order.invoice?.id ? String(order.invoice.id) : undefined,
        status: order.orderStatus === 'CONFIRMED' ? 'APPROVED'
          : order.orderStatus === 'PACKED' ? 'PACKING'
          : order.orderStatus === 'READY_TO_SHIP' ? 'READY_FOR_SHIPPING'
          : order.orderStatus,
        paymentStatus: order.paymentStatus === 'CAPTURED' ? 'PAID' : order.paymentStatus === 'REFUNDED' ? 'REFUNDED' : 'UNPAID',
        paymentMethod: resolvePaymentMethod(order),
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
        timeline: (order.timeline || []).map((event: any) => ({
          id: String(event.id),
          status: event.eventType || order.orderStatus,
          title: event.eventType?.replaceAll('_', ' ') || 'Order update',
          description: event.description || '',
          actor: 'System',
          timestamp: event.createdAt || order.createdAt
        }))
      })) as Order[]
    };
  }

  async getInvoiceForOrder(orderId: string): Promise<ApiResponse<Invoice>> {
    const response = await api.get<ApiResponse<Invoice>>(`/orders/${orderId}/invoice`);
    return response.data;
  }

  async updateStatus(orderId: string, status: string, remark?: string): Promise<ApiResponse<Order>> {
    const response = await api.patch<ApiResponse<Order>>(`/orders/${orderId}/status`, { status, remark });
    return response.data;
  }

  async hold(orderId: string, reason: string): Promise<ApiResponse<Order>> {
    const response = await api.put<ApiResponse<Order>>(`/orders/${orderId}/hold`, { reason });
    return response.data;
  }

  async release(orderId: string): Promise<ApiResponse<Order>> {
    const response = await api.put<ApiResponse<Order>>(`/orders/${orderId}/release`);
    return response.data;
  }

  async addTimeline(orderId: string, data: { status: string; title: string; description: string; actor: string }): Promise<ApiResponse<Order>> {
    const response = await api.post<ApiResponse<Order>>(`/orders/${orderId}/timeline`, data);
    return response.data;
  }

  async cancel(orderId: string, reason: string): Promise<ApiResponse<Order>> {
    const response = await api.put<ApiResponse<Order>>(`/orders/${orderId}/cancel`, { reason });
    return response.data;
  }

  // Picking & Packing actions
  async startPicking(orderId: string): Promise<ApiResponse<Order>> {
    const response = await api.put<ApiResponse<Order>>(`/orders/${orderId}/picking/start`);
    return response.data;
  }

  async updateItemPicking(orderId: string, itemId: string, status: 'PICKED' | 'SHORTAGE' | 'PENDING'): Promise<ApiResponse<Order>> {
    const response = await api.put<ApiResponse<Order>>(`/orders/${orderId}/picking/items/${itemId}`, { status });
    return response.data;
  }

  async completePicking(orderId: string): Promise<ApiResponse<Order>> {
    const response = await api.put<ApiResponse<Order>>(`/orders/${orderId}/picking/complete`);
    return response.data;
  }

  async updateItemPacking(orderId: string, itemId: string, status: 'PACKED' | 'DAMAGED' | 'PENDING'): Promise<ApiResponse<Order>> {
    const response = await api.put<ApiResponse<Order>>(`/orders/${orderId}/packing/items/${itemId}`, { status });
    return response.data;
  }

  async completePacking(orderId: string): Promise<ApiResponse<Order>> {
    const response = await api.put<ApiResponse<Order>>(`/orders/${orderId}/packing/complete`);
    return response.data;
  }
}

class InvoiceService extends BaseFeatureApi<Invoice> {
  constructor() {
    super('/invoices');
  }

  async getAll(): Promise<ApiResponse<Invoice[]>> {
    const response = await api.get<ApiResponse<{ items: any[] }>>('/invoices', {
      params: { pageSize: 100, sortBy: 'invoiceDate', sortOrder: 'desc' }
    });
    return {
      ...response.data,
      data: (response.data.data?.items || []).map(mapInvoice)
    };
  }

  async getById(id: string | number): Promise<ApiResponse<Invoice>> {
    const response = await api.get<ApiResponse<any>>(`/invoices/${id}`);
    return { ...response.data, data: mapInvoice(response.data.data) };
  }

  async pay(invoiceId: string): Promise<ApiResponse<Invoice>> {
    const response = await api.put<ApiResponse<Invoice>>(`/invoices/${invoiceId}/pay`);
    return { ...response.data, data: mapInvoice(response.data.data) };
  }

  async void(invoiceId: string): Promise<ApiResponse<Invoice>> {
    const response = await api.put<ApiResponse<Invoice>>(`/invoices/${invoiceId}/void`);
    return { ...response.data, data: mapInvoice(response.data.data) };
  }
}

class ShipmentService extends BaseFeatureApi<Shipment> {
  constructor() {
    super('/shipments');
  }

  async createForOrder(orderId: string, data: { carrier: string; trackingNumber: string; shippingMethod: string; items: { sku: string; qty: number }[] }): Promise<ApiResponse<Shipment>> {
    const response = await api.post<ApiResponse<Shipment>>(`/shipments/order/${orderId}`, data);
    return response.data;
  }

  async updateShipmentStatus(shipmentId: string, status: string, details?: string): Promise<ApiResponse<Shipment>> {
    const response = await api.put<ApiResponse<Shipment>>(`/shipments/${shipmentId}/status`, { status, details });
    return response.data;
  }
}

class ReturnService extends BaseFeatureApi<ReturnRequest> {
  constructor() {
    super('/returns');
  }

  async processReturn(returnId: string, data: { status: string; itemStatuses?: Record<string, string>; customRefundAmount?: number }): Promise<ApiResponse<ReturnRequest>> {
    const response = await api.put<ApiResponse<ReturnRequest>>(`/returns/${returnId}/process`, data);
    return response.data;
  }
}

class TrackingService {
  async getByTrackingNumber(trackingNumber: string): Promise<ApiResponse<TrackingDetail>> {
    const response = await api.get<ApiResponse<TrackingDetail>>(`/tracking/${trackingNumber}`);
    return response.data;
  }

  async getAll(): Promise<ApiResponse<TrackingDetail[]>> {
    const response = await api.get<ApiResponse<TrackingDetail[]>>('/tracking');
    return response.data;
  }
}

export const orderService = new OrderService();
export const invoiceService = new InvoiceService();
export const shipmentService = new ShipmentService();
export const returnService = new ReturnService();
export const trackingService = new TrackingService();
