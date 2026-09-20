export type UiOrderStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'PROCESSING'
  | 'PICKING'
  | 'PACKING'
  | 'READY_FOR_SHIPPING'
  | 'PACKED'
  | 'READY_TO_SHIP'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURNED'
  | 'REFUNDED'
  | 'HOLD';

export type BackendOrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'READY_TO_SHIP'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'REFUNDED'
  | 'FAILED';

const STATUS_MAP: Record<string, BackendOrderStatus> = {
  PENDING: 'PENDING',
  APPROVED: 'CONFIRMED',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  PICKING: 'PROCESSING',
  PACKING: 'PACKED',
  PACKED: 'PACKED',
  READY_FOR_SHIPPING: 'READY_TO_SHIP',
  READY_TO_SHIP: 'READY_TO_SHIP',
  SHIPPED: 'SHIPPED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURN_REQUESTED: 'RETURNED',
  RETURNED: 'RETURNED',
  REFUNDED: 'REFUNDED',
  HOLD: 'PROCESSING',
  FAILED: 'FAILED',
};

export function mapUiOrderStatusToBackend(status: string): BackendOrderStatus {
  const normalizedStatus = status?.trim().toUpperCase();
  return STATUS_MAP[normalizedStatus] ?? (normalizedStatus as BackendOrderStatus) ?? 'PENDING';
}
