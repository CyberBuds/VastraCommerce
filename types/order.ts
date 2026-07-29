import { Address } from './customer';

export type OrderStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'PROCESSING'
  | 'PICKING'
  | 'PACKING'
  | 'READY_FOR_SHIPPING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURNED'
  | 'REFUNDED'
  | 'HOLD';

export type PaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'REFUNDED';

export type PaymentMethod = 'CREDIT_CARD' | 'BANK_TRANSFER' | 'WALLET' | 'CASH_ON_DELIVERY';

export type ShippingMethod = 'EXPRESS' | 'STANDARD' | 'FREIGHT' | 'SAME_DAY';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  pickingStatus?: 'PENDING' | 'PICKED' | 'SHORTAGE';
  packingStatus?: 'PENDING' | 'PACKED' | 'DAMAGED';
}

export interface OrderTimelineEvent {
  id: string;
  status: OrderStatus | string;
  title: string;
  description: string;
  actor: string;
  timestamp: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  timeline: OrderTimelineEvent[];
  invoiceId?: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDeliveryDate?: string;
  holdReason?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subtotal: number;
  tax: number;
  totalAmount: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'VOID' | 'OVERDUE';
  dueDate: string;
  issuedDate: string;
  paidAt?: string;
  paymentMethod?: PaymentMethod;
}

export type ShipmentStatus = 'PREPARING' | 'READY_FOR_PICKUP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED_ATTEMPT';

export interface ShipmentItem {
  id: string;
  productName: string;
  sku: string;
  quantityOrdered: number;
  quantityShipped: number;
}

export interface Shipment {
  id: string;
  shipmentNumber: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  carrier: string;
  trackingNumber: string;
  status: ShipmentStatus;
  shippingMethod: ShippingMethod;
  items: ShipmentItem[];
  shippedAt?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  deliveryNotes?: string;
}

export type ReturnStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export interface ReturnItem {
  id: string;
  productName: string;
  sku: string;
  quantityOrdered: number;
  quantityReturned: number;
  price: number;
  status: 'PENDING_RECEIPT' | 'RECEIVED_GOOD' | 'RECEIVED_DAMAGED' | 'REJECTED';
}

export interface ReturnRequest {
  id: string;
  returnNumber: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: ReturnItem[];
  reason: string;
  notes?: string;
  status: ReturnStatus;
  refundAmount: number;
  refundToWallet: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingStep {
  id: string;
  title: string;
  description: string;
  location?: string;
  timestamp: string;
}

export interface TrackingDetail {
  id: string;
  trackingNumber: string;
  carrier: string;
  orderNumber: string;
  status: ShipmentStatus;
  estimatedDelivery?: string;
  origin: string;
  destination: string;
  steps: TrackingStep[];
}
