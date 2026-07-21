import { create } from 'zustand';
import { 
  Order, 
  OrderItem, 
  OrderStatus, 
  PaymentStatus, 
  PaymentMethod, 
  ShippingMethod, 
  OrderTimelineEvent,
  Invoice,
  Shipment,
  ShipmentStatus,
  ReturnRequest,
  ReturnItem,
  ReturnStatus,
  TrackingDetail,
  TrackingStep
} from '@/types/order';
import { Address } from '@/types/customer';

// Helper for localStorage syncing
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to sync Order state to storage:', e);
  }
}

// ==========================================
// SEED DATA FOR ORDERS & MODULES
// ==========================================

const MOCK_ADDRESS_1: Address = {
  id: 'addr-seed-1',
  type: 'SHIPPING',
  isDefault: true,
  name: 'Yash Gupta Head Office',
  phone: '+91 98765 43210',
  addressLine1: '402, Signature Corporate Towers',
  addressLine2: 'Bandstand Road, Bandra West',
  city: 'Mumbai',
  state: 'Maharashtra',
  postalCode: '400050',
  country: 'India'
};

const MOCK_ADDRESS_2: Address = {
  id: 'addr-seed-2',
  type: 'SHIPPING',
  isDefault: true,
  name: 'Main Depot Bengaluru',
  phone: '+91 76543 21098',
  addressLine1: 'Warehouse 4-C, Electronic City Block B',
  city: 'Bengaluru',
  state: 'Karnataka',
  postalCode: '560100',
  country: 'India'
};

const MOCK_ADDRESS_3: Address = {
  id: 'addr-seed-3',
  type: 'SHIPPING',
  isDefault: true,
  name: 'Aarav Sharma Residence',
  phone: '+91 87654 32109',
  addressLine1: 'Flat 503, Shanti Niketan',
  addressLine2: 'Jubilee Hills Road 10',
  city: 'Hyderabad',
  state: 'Telangana',
  postalCode: '500033',
  country: 'India'
};

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'AERO-ORD-2026-001',
    customerId: 'cust-1',
    customerName: 'Yash Gupta',
    customerEmail: 'ykgupta042@gmail.com',
    customerPhone: '+91 98765 43210',
    items: [
      { id: 'item-1', productId: 'prod-1', productName: 'AeroFlow Turbine X1 (Batch #1000)', sku: 'SKU-AERO-10000', price: 1499.99, quantity: 2, total: 2999.98, pickingStatus: 'PENDING', packingStatus: 'PENDING' },
      { id: 'item-2', productId: 'prod-2', productName: 'Quantum Spark Plug (Batch #1001)', sku: 'SKU-AERO-10001', price: 199.98, quantity: 10, total: 1999.80, pickingStatus: 'PENDING', packingStatus: 'PENDING' }
    ],
    subtotal: 4999.78,
    tax: 899.96,
    shippingCost: 250.00,
    discount: 499.98, // VIP 10%
    totalAmount: 5649.76,
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    paymentMethod: 'WALLET',
    shippingMethod: 'EXPRESS',
    shippingAddress: MOCK_ADDRESS_1,
    billingAddress: MOCK_ADDRESS_1,
    notes: 'Please double box turbine assemblies.',
    createdAt: '2026-07-15T10:30:00Z',
    updatedAt: '2026-07-17T15:00:00Z',
    invoiceId: 'inv-1001',
    trackingNumber: 'BD-849203948',
    carrier: 'Blue Dart',
    estimatedDeliveryDate: '2026-07-18',
    timeline: [
      { id: 'ev-1', status: 'PENDING', title: 'Order Registered', description: 'Order successfully logged via client gateway portal.', actor: 'Client Portal', timestamp: '2026-07-15T10:30:00Z' },
      { id: 'ev-2', status: 'APPROVED', title: 'Payment Confirmed', description: '₹5,649.76 deducted from customer wallet.', actor: 'Wallet System', timestamp: '2026-07-15T10:31:00Z' },
      { id: 'ev-3', status: 'PROCESSING', title: 'Assigned to Warehouse', description: 'Assigned to Mumbai-Central fulfillment depot.', actor: 'Fulfillment Engine', timestamp: '2026-07-15T11:45:00Z' },
      { id: 'ev-4', status: 'SHIPPED', title: 'Consignment Dispatched', description: 'Handled to Blue Dart under tracking number BD-849203948.', actor: 'Logistics Supervisor', timestamp: '2026-07-16T14:30:00Z' },
      { id: 'ev-5', status: 'DELIVERED', title: 'Delivered', description: 'Handed to receiver. Signature verified.', actor: 'Blue Dart Courier', timestamp: '2026-07-17T15:00:00Z' }
    ]
  },
  {
    id: 'ord-1002',
    orderNumber: 'AERO-ORD-2026-002',
    customerId: 'cust-3',
    customerName: 'Priya Nair',
    customerEmail: 'priya.nair@corporate.in',
    customerPhone: '+91 76543 21098',
    items: [
      { id: 'item-3', productId: 'prod-1', productName: 'AeroFlow Turbine X1 (Batch #1000)', sku: 'SKU-AERO-10000', price: 1499.99, quantity: 20, total: 29999.80, pickingStatus: 'PENDING', packingStatus: 'PENDING' },
      { id: 'item-4', productId: 'prod-4', productName: 'Carbon Fiber Strut (Batch #1003)', sku: 'SKU-AERO-10003', price: 299.99, quantity: 40, total: 11999.60, pickingStatus: 'PENDING', packingStatus: 'PENDING' }
    ],
    subtotal: 41999.40,
    tax: 7559.89,
    shippingCost: 1500.00,
    discount: 5039.93, // Corporate 12%
    totalAmount: 46019.36,
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    paymentMethod: 'BANK_TRANSFER',
    shippingMethod: 'FREIGHT',
    shippingAddress: MOCK_ADDRESS_2,
    billingAddress: MOCK_ADDRESS_2,
    notes: 'Require commercial certificate of compliance and tax declarations in the shipment packet.',
    createdAt: '2026-07-19T08:00:00Z',
    updatedAt: '2026-07-19T09:30:00Z',
    invoiceId: 'inv-1002',
    timeline: [
      { id: 'ev-6', status: 'PENDING', title: 'Order Draft Registered', description: 'B2B Procurement request submitted.', actor: 'Purchasing Portal', timestamp: '2026-07-19T08:00:00Z' },
      { id: 'ev-7', status: 'APPROVED', title: 'Corporate Credit Approved', description: 'Net-30 purchase ledger verification completed.', actor: 'Accounts Clerk', timestamp: '2026-07-19T09:00:00Z' },
      { id: 'ev-8', status: 'PROCESSING', title: 'Assigned to Picking Queue', description: 'Assigned to Picking Operator.', actor: 'Warehouse System', timestamp: '2026-07-19T09:30:00Z' }
    ]
  },
  {
    id: 'ord-1003',
    orderNumber: 'AERO-ORD-2026-003',
    customerId: 'cust-2',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@gmail.com',
    customerPhone: '+91 87654 32109',
    items: [
      { id: 'item-5', productId: 'prod-3', productName: 'Industrial Hydraulic Fluid (Batch #1002)', sku: 'SKU-AERO-10002', price: 249.99, quantity: 5, total: 1249.95, pickingStatus: 'PENDING', packingStatus: 'PENDING' }
    ],
    subtotal: 1249.95,
    tax: 224.99,
    shippingCost: 100.00,
    discount: 0.00,
    totalAmount: 1574.94,
    status: 'PENDING',
    paymentStatus: 'UNPAID',
    paymentMethod: 'CASH_ON_DELIVERY',
    shippingMethod: 'STANDARD',
    shippingAddress: MOCK_ADDRESS_3,
    billingAddress: MOCK_ADDRESS_3,
    createdAt: '2026-07-20T11:20:00Z',
    updatedAt: '2026-07-20T11:20:00Z',
    timeline: [
      { id: 'ev-9', status: 'PENDING', title: 'Order Submitted', description: 'Cash on delivery order awaiting approval check.', actor: 'System Gateway', timestamp: '2026-07-20T11:20:00Z' }
    ]
  },
  {
    id: 'ord-1004',
    orderNumber: 'AERO-ORD-2026-004',
    customerId: 'cust-1',
    customerName: 'Yash Gupta',
    customerEmail: 'ykgupta042@gmail.com',
    customerPhone: '+91 98765 43210',
    items: [
      { id: 'item-6', productId: 'prod-5', productName: 'GigaCharge battery pack (Batch #1004)', sku: 'SKU-AERO-10004', price: 1199.99, quantity: 1, total: 1199.99, pickingStatus: 'PENDING', packingStatus: 'PENDING' }
    ],
    subtotal: 1199.99,
    tax: 215.99,
    shippingCost: 150.00,
    discount: 119.99, // VIP 10%
    totalAmount: 1445.99,
    status: 'HOLD',
    paymentStatus: 'UNPAID',
    paymentMethod: 'CREDIT_CARD',
    shippingMethod: 'EXPRESS',
    shippingAddress: MOCK_ADDRESS_1,
    billingAddress: MOCK_ADDRESS_1,
    createdAt: '2026-07-20T14:10:00Z',
    updatedAt: '2026-07-20T14:15:00Z',
    holdReason: 'Awaiting online credit clearance confirmation.',
    timeline: [
      { id: 'ev-10', status: 'PENDING', title: 'Checkout Session Initialized', description: 'Payment gateway redirect.', actor: 'System Checkout', timestamp: '2026-07-20T14:10:00Z' },
      { id: 'ev-11', status: 'HOLD', title: 'Order Placed on Hold', description: 'Risk review hold triggered. Pending bank confirmation.', actor: 'Admin Desk', timestamp: '2026-07-20T14:15:00Z' }
    ]
  },
  {
    id: 'ord-1005',
    orderNumber: 'AERO-ORD-2026-005',
    customerId: 'cust-6',
    customerName: 'Anjali Sen',
    customerEmail: 'anjali.sen@retail.co.in',
    customerPhone: '+91 91234 56789',
    items: [
      { id: 'item-7', productId: 'prod-2', productName: 'Quantum Spark Plug (Batch #1001)', sku: 'SKU-AERO-10001', price: 199.98, quantity: 2, total: 399.96, pickingStatus: 'PENDING', packingStatus: 'PENDING' }
    ],
    subtotal: 399.96,
    tax: 71.99,
    shippingCost: 80.00,
    discount: 19.99, // Premium 5%
    totalAmount: 531.96,
    status: 'RETURN_REQUESTED',
    paymentStatus: 'PAID',
    paymentMethod: 'WALLET',
    shippingMethod: 'STANDARD',
    shippingAddress: MOCK_ADDRESS_1, // Salt Lake
    billingAddress: MOCK_ADDRESS_1,
    createdAt: '2026-07-16T12:00:00Z',
    updatedAt: '2026-07-19T10:00:00Z',
    invoiceId: 'inv-1005',
    timeline: [
      { id: 'ev-12', status: 'PENDING', title: 'Order Placed', description: 'Logged by customer.', actor: 'Web Portal', timestamp: '2026-07-16T12:00:00Z' },
      { id: 'ev-13', status: 'APPROVED', title: 'Payment Secured', description: '₹531.96 processed via wallet deduction.', actor: 'Wallet System', timestamp: '2026-07-16T12:01:00Z' },
      { id: 'ev-14', status: 'DELIVERED', title: 'Shipment Received', description: 'Consignment successfully handed over.', actor: 'Courier', timestamp: '2026-07-18T11:00:00Z' },
      { id: 'ev-15', status: 'RETURN_REQUESTED', title: 'Return Request Logged', description: 'Customer requested refund. Reason: Changed mind / incorrect specifications.', actor: 'Customer Dashboard', timestamp: '2026-07-19T10:00:00Z' }
    ]
  }
];

const DEFAULT_INVOICES: Invoice[] = [
  {
    id: 'inv-1001',
    invoiceNumber: 'AERO-INV-2026-001',
    orderId: 'ord-1001',
    orderNumber: 'AERO-ORD-2026-001',
    customerId: 'cust-1',
    customerName: 'Yash Gupta',
    customerEmail: 'ykgupta042@gmail.com',
    subtotal: 4999.78,
    tax: 899.96,
    totalAmount: 5649.76,
    status: 'PAID',
    dueDate: '2026-07-25',
    issuedDate: '2026-07-15',
    paidAt: '2026-07-15T10:31:00Z',
    paymentMethod: 'WALLET'
  },
  {
    id: 'inv-1002',
    invoiceNumber: 'AERO-INV-2026-002',
    orderId: 'ord-1002',
    orderNumber: 'AERO-ORD-2026-002',
    customerId: 'cust-3',
    customerName: 'Priya Nair',
    customerEmail: 'priya.nair@corporate.in',
    subtotal: 41999.40,
    tax: 7559.89,
    totalAmount: 46019.36,
    status: 'PAID',
    dueDate: '2026-08-19',
    issuedDate: '2026-07-19',
    paidAt: '2026-07-19T09:00:00Z',
    paymentMethod: 'BANK_TRANSFER'
  },
  {
    id: 'inv-1005',
    invoiceNumber: 'AERO-INV-2026-005',
    orderId: 'ord-1005',
    orderNumber: 'AERO-ORD-2026-005',
    customerId: 'cust-6',
    customerName: 'Anjali Sen',
    customerEmail: 'anjali.sen@retail.co.in',
    subtotal: 399.96,
    tax: 71.99,
    totalAmount: 531.96,
    status: 'PAID',
    dueDate: '2026-07-26',
    issuedDate: '2026-07-16',
    paidAt: '2026-07-16T12:01:00Z',
    paymentMethod: 'WALLET'
  }
];

const DEFAULT_SHIPMENTS: Shipment[] = [
  {
    id: 'ship-1001',
    shipmentNumber: 'AERO-SHP-2026-001',
    orderId: 'ord-1001',
    orderNumber: 'AERO-ORD-2026-001',
    customerId: 'cust-1',
    customerName: 'Yash Gupta',
    carrier: 'Blue Dart',
    trackingNumber: 'BD-849203948',
    status: 'DELIVERED',
    shippingMethod: 'EXPRESS',
    shippedAt: '2026-07-16T14:30:00Z',
    estimatedDelivery: '2026-07-18',
    actualDelivery: '2026-07-17T15:00:00Z',
    deliveryNotes: 'Left at security desk as requested.',
    items: [
      { id: 'sh-item-1', productName: 'AeroFlow Turbine X1 (Batch #1000)', sku: 'SKU-AERO-10000', quantityOrdered: 2, quantityShipped: 2 },
      { id: 'sh-item-2', productName: 'Quantum Spark Plug (Batch #1001)', sku: 'SKU-AERO-10001', quantityOrdered: 10, quantityShipped: 10 }
    ]
  }
];

const DEFAULT_RETURNS: ReturnRequest[] = [
  {
    id: 'ret-1001',
    returnNumber: 'AERO-RET-2026-001',
    orderId: 'ord-1005',
    orderNumber: 'AERO-ORD-2026-005',
    customerId: 'cust-6',
    customerName: 'Anjali Sen',
    reason: 'Incorrect thread fitting for our motor brackets.',
    notes: 'Item remains in pristine packaging. Unopened.',
    status: 'PENDING',
    refundAmount: 531.96,
    refundToWallet: true,
    createdAt: '2026-07-19T10:00:00Z',
    updatedAt: '2026-07-19T10:00:00Z',
    items: [
      { id: 'ret-item-1', productName: 'Quantum Spark Plug (Batch #1001)', sku: 'SKU-AERO-10001', quantityOrdered: 2, quantityReturned: 2, price: 199.98, status: 'PENDING_RECEIPT' }
    ]
  }
];

const DEFAULT_TRACKING: TrackingDetail[] = [
  {
    id: 'track-1001',
    trackingNumber: 'BD-849203948',
    carrier: 'Blue Dart',
    orderNumber: 'AERO-ORD-2026-001',
    status: 'DELIVERED',
    estimatedDelivery: '2026-07-18',
    origin: 'Mumbai fulfillment center',
    destination: 'Bandra Corporate office',
    steps: [
      { id: 'tr-st-1', title: 'Shipment Delivered', description: 'Consignment successfully delivered and signed.', location: 'Bandra, Mumbai', timestamp: '2026-07-17T15:00:00Z' },
      { id: 'tr-st-2', title: 'Out for Delivery', description: 'Package is with delivery agent.', location: 'Bandra Delivery Branch', timestamp: '2026-07-17T09:00:00Z' },
      { id: 'tr-st-3', title: 'Arrived at Local Depot', description: 'Processed through local sorting facility.', location: 'Mumbai Western Depot', timestamp: '2026-07-16T22:15:00Z' },
      { id: 'tr-st-4', title: 'In Transit', description: 'Dispatched from hub station.', location: 'Sahar Logistics Hub', timestamp: '2026-07-16T16:00:00Z' },
      { id: 'tr-st-5', title: 'Manifest Generated', description: 'Carrier collected shipment packages.', location: 'Mumbai Main Hub', timestamp: '2026-07-16T14:30:00Z' }
    ]
  }
];

// ==========================================
// STORE INTERFACE DEFINITIONS
// ==========================================

interface OrderState {
  orders: Order[];
  invoices: Invoice[];
  shipments: Shipment[];
  returns: ReturnRequest[];
  tracking: TrackingDetail[];
  isLoading: boolean;
}

interface OrderActions {
  // Order CRUD
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'timeline'>) => Order;
  updateOrder: (id: string, updated: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  holdOrder: (id: string, reason: string) => void;
  releaseOrder: (id: string) => void;
  addTimelineEvent: (id: string, event: Omit<OrderTimelineEvent, 'id' | 'timestamp'>) => void;

  // Picking & Packing Queue Actions
  startPicking: (orderId: string) => void;
  markItemPicked: (orderId: string, itemId: string, status: 'PICKED' | 'SHORTAGE' | 'PENDING') => void;
  completePicking: (orderId: string) => void;
  markItemPacked: (orderId: string, itemId: string, status: 'PACKED' | 'DAMAGED' | 'PENDING') => void;
  completePacking: (orderId: string) => void;

  // Shipment & Logistics Actions
  createShipment: (orderId: string, data: { carrier: string; trackingNumber: string; shippingMethod: ShippingMethod; items: { sku: string; qty: number }[] }) => Shipment;
  updateShipmentStatus: (shipmentId: string, status: ShipmentStatus, details?: string) => void;

  // Invoices Actions
  createInvoice: (orderId: string) => Invoice;
  payInvoice: (invoiceId: string) => void;
  voidInvoice: (invoiceId: string) => void;

  // Returns, Refunds & Cancellations
  requestReturn: (data: Omit<ReturnRequest, 'id' | 'returnNumber' | 'createdAt' | 'updatedAt'>) => ReturnRequest;
  processReturnStatus: (returnId: string, status: ReturnStatus, itemStatuses?: Record<string, ReturnItem['status']>, customRefundAmount?: number) => void;
  cancelOrder: (orderId: string, reason: string) => void;
}

export const useOrderStore = create<OrderState & OrderActions>((set, get) => ({
  orders: getFromStorage('ent_ord_orders', DEFAULT_ORDERS),
  invoices: getFromStorage('ent_ord_invoices', DEFAULT_INVOICES),
  shipments: getFromStorage('ent_ord_shipments', DEFAULT_SHIPMENTS),
  returns: getFromStorage('ent_ord_returns', DEFAULT_RETURNS),
  tracking: getFromStorage('ent_ord_tracking', DEFAULT_TRACKING),
  isLoading: false,

  // 1. ADD ORDER
  addOrder: (data) => {
    const orders = get().orders;
    const newOrdNum = `AERO-ORD-2026-${String(orders.length + 1).padStart(3, '0')}`;
    const newOrder: Order = {
      ...data,
      id: `ord-${Date.now()}`,
      orderNumber: newOrdNum,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          id: `ev-init-${Date.now()}`,
          status: 'PENDING',
          title: 'Order Submitted',
          description: `Order successfully submitted in portal under classification: ${data.shippingMethod} Shipping.`,
          actor: 'System Terminal',
          timestamp: new Date().toISOString()
        }
      ]
    };

    // Auto-approve or deduct wallet balance if WALLET payment method is used
    if (data.paymentMethod === 'WALLET') {
      try {
        const { useCustomerStore } = require('./customerStore');
        const customerState = useCustomerStore.getState();
        const customer = customerState.customers.find((c: any) => c.id === data.customerId);
        if (customer && customer.walletBalance >= data.totalAmount) {
          // Deduct from balance
          customerState.adjustWalletBalance(
            data.customerId,
            'DEBIT',
            data.totalAmount,
            'ORDER_PAYMENT',
            `Deduction for Order #${newOrdNum}`,
            'Checkout System'
          );
          
          // Earn loyalty points (B2B rule: ₹100 = 1 point)
          const pointsEarned = Math.floor(data.totalAmount / 100);
          if (pointsEarned > 0) {
            customerState.adjustRewardPoints(
              data.customerId,
              'EARNED',
              pointsEarned,
              `Loyalty multiplier reward on Order #${newOrdNum}`,
              newOrder.id
            );
          }

          newOrder.paymentStatus = 'PAID';
          newOrder.status = 'APPROVED';
          newOrder.timeline.push({
            id: `ev-pay-${Date.now()}`,
            status: 'APPROVED',
            title: 'Payment Secured',
            description: `₹${data.totalAmount.toLocaleString()} deducted securely from wallet. Order approved automatically.`,
            actor: 'System Wallet Manager',
            timestamp: new Date().toISOString()
          });
        } else {
          newOrder.paymentStatus = 'UNPAID';
          newOrder.status = 'PENDING';
          newOrder.timeline.push({
            id: `ev-pay-fail-${Date.now()}`,
            status: 'PENDING',
            title: 'Insolvent Funds Warning',
            description: `Attempted wallet payment of ₹${data.totalAmount.toLocaleString()} but wallet balance remains insufficient. Placed in pending ledger.`,
            actor: 'System Billing',
            timestamp: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error('Failed to link wallet deduction during checkout:', err);
      }
    }

    const updated = [newOrder, ...orders];
    set({ orders: updated });
    saveToStorage('ent_ord_orders', updated);

    // Auto-generate invoice if paid
    if (newOrder.paymentStatus === 'PAID') {
      get().createInvoice(newOrder.id);
    }

    return newOrder;
  },

  // 2. UPDATE ORDER
  updateOrder: (id, updatedFields) => {
    const updated = get().orders.map(o => {
      if (o.id === id) {
        const oCopy = { ...o, ...updatedFields, updatedAt: new Date().toISOString() };
        // Log status change timeline
        if (updatedFields.status && updatedFields.status !== o.status) {
          oCopy.timeline = [
            ...oCopy.timeline,
            {
              id: `ev-upd-${Date.now()}`,
              status: updatedFields.status,
              title: `Order Status: ${updatedFields.status}`,
              description: `Operations desk altered order state manually to ${updatedFields.status}.`,
              actor: 'Ops Console Operator',
              timestamp: new Date().toISOString()
            }
          ];
        }
        return oCopy;
      }
      return o;
    });
    set({ orders: updated });
    saveToStorage('ent_ord_orders', updated);
  },

  // 3. DELETE ORDER
  deleteOrder: (id) => {
    const updated = get().orders.filter(o => o.id !== id);
    set({ orders: updated });
    saveToStorage('ent_ord_orders', updated);
  },

  // 4. HOLD ORDER
  holdOrder: (id, reason) => {
    const updated = get().orders.map(o => {
      if (o.id === id) {
        return {
          ...o,
          status: 'HOLD' as const,
          holdReason: reason,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...o.timeline,
            {
              id: `ev-hold-${Date.now()}`,
              status: 'HOLD',
              title: 'Order Placed on Hold',
              description: `Administrative lock triggered. Reason: ${reason}`,
              actor: 'System Audit Risk Desk',
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return o;
    });
    set({ orders: updated });
    saveToStorage('ent_ord_orders', updated);
  },

  // 5. RELEASE ORDER
  releaseOrder: (id) => {
    const updated = get().orders.map(o => {
      if (o.id === id) {
        return {
          ...o,
          status: 'APPROVED' as const,
          holdReason: undefined,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...o.timeline,
            {
              id: `ev-rel-${Date.now()}`,
              status: 'APPROVED',
              title: 'Order Administrative Hold Released',
              description: `Safety checks cleared. Placed in fulfillment pipeline.`,
              actor: 'System Audit Officer',
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return o;
    });
    set({ orders: updated });
    saveToStorage('ent_ord_orders', updated);
  },

  // 6. ADD TIMELINE EVENT
  addTimelineEvent: (id, event) => {
    const updated = get().orders.map(o => {
      if (o.id === id) {
        return {
          ...o,
          timeline: [
            ...o.timeline,
            {
              ...event,
              id: `ev-cust-${Date.now()}`,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return o;
    });
    set({ orders: updated });
    saveToStorage('ent_ord_orders', updated);
  },

  // ==========================================
  // WAREHOUSE PICKING & PACKING
  // ==========================================

  startPicking: (orderId) => {
    const updated = get().orders.map(o => {
      if (o.id === orderId) {
        const initializedItems = o.items.map(it => ({
          ...it,
          pickingStatus: 'PENDING' as const
        }));
        return {
          ...o,
          items: initializedItems,
          status: 'PICKING' as const,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...o.timeline,
            {
              id: `ev-pick-start-${Date.now()}`,
              status: 'PICKING',
              title: 'Picking Pipeline Initiated',
              description: 'Picking sheet generated. Handled to bin extraction operators.',
              actor: 'Warehouse Supervisor',
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return o;
    });
    set({ orders: updated });
    saveToStorage('ent_ord_orders', updated);
  },

  markItemPicked: (orderId, itemId, status) => {
    const updated = get().orders.map(o => {
      if (o.id === orderId) {
        const updatedItems = o.items.map(it => {
          if (it.id === itemId) return { ...it, pickingStatus: status };
          return it;
        });
        return { ...o, items: updatedItems };
      }
      return o;
    });
    set({ orders: updated });
    saveToStorage('ent_ord_orders', updated);
  },

  completePicking: (orderId) => {
    const updated = get().orders.map(o => {
      if (o.id === orderId) {
        const itemShortages = o.items.filter(it => it.pickingStatus === 'SHORTAGE').length;
        const shortNote = itemShortages > 0 ? ` completed with ${itemShortages} inventory discrepancies flagged.` : ' completed successfully.';
        
        return {
          ...o,
          status: 'PACKING' as const,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...o.timeline,
            {
              id: `ev-pick-done-${Date.now()}`,
              status: 'PACKING',
              title: 'Items Picked & Audited',
              description: `Warehouse bin extraction${shortNote} Transferred to Packing Bench #12.`,
              actor: 'Bin Picking Operator',
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return o;
    });
    set({ orders: updated });
    saveToStorage('ent_ord_orders', updated);
  },

  markItemPacked: (orderId, itemId, status) => {
    const updated = get().orders.map(o => {
      if (o.id === orderId) {
        const updatedItems = o.items.map(it => {
          if (it.id === itemId) return { ...it, packingStatus: status };
          return it;
        });
        return { ...o, items: updatedItems };
      }
      return o;
    });
    set({ orders: updated });
    saveToStorage('ent_ord_orders', updated);
  },

  completePacking: (orderId) => {
    const updated = get().orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'READY_FOR_SHIPPING' as const,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...o.timeline,
            {
              id: `ev-pack-done-${Date.now()}`,
              status: 'READY_FOR_SHIPPING',
              title: 'Packages Sealed & Coated',
              description: 'Shock-proof casing and shipping barcode labels applied. Waiting for logistics pickup carrier.',
              actor: 'Packing Bench Station',
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return o;
    });
    set({ orders: updated });
    saveToStorage('ent_ord_orders', updated);
  },

  // ==========================================
  // SHIPPING & LOGISTICS DISPATCH
  // ==========================================

  createShipment: (orderId, data) => {
    const orders = get().orders;
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');

    const shipments = get().shipments;
    const shpNumber = `AERO-SHP-2026-${String(shipments.length + 1).padStart(3, '0')}`;
    
    const newShipment: Shipment = {
      id: `ship-${Date.now()}`,
      shipmentNumber: shpNumber,
      orderId,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      customerName: order.customerName,
      carrier: data.carrier,
      trackingNumber: data.trackingNumber,
      status: 'PREPARING',
      shippingMethod: data.shippingMethod,
      shippedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0], // +3 days
      items: data.items.map((it, i) => {
        const oItem = order.items.find(oi => oi.sku === it.sku);
        return {
          id: `sh-it-${Date.now()}-${i}`,
          productName: oItem ? oItem.productName : 'Direct Logistics SKU',
          sku: it.sku,
          quantityOrdered: oItem ? oItem.quantity : it.qty,
          quantityShipped: it.qty
        };
      })
    };

    const newTracking: TrackingDetail = {
      id: `track-${Date.now()}`,
      trackingNumber: data.trackingNumber,
      carrier: data.carrier,
      orderNumber: order.orderNumber,
      status: 'PREPARING',
      estimatedDelivery: newShipment.estimatedDelivery,
      origin: 'Mumbai fulfillment center',
      destination: `${order.shippingAddress.city}, ${order.shippingAddress.state}`,
      steps: [
        {
          id: `tr-s-${Date.now()}`,
          title: 'Parcel Manifest Drafted',
          description: `Consignment is prepared for pickup by ${data.carrier}.`,
          location: 'Mumbai Depot Hub',
          timestamp: new Date().toISOString()
        }
      ]
    };

    // Update Order state
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'SHIPPED' as const,
          trackingNumber: data.trackingNumber,
          carrier: data.carrier,
          estimatedDeliveryDate: newShipment.estimatedDelivery,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...o.timeline,
            {
              id: `ev-ship-gen-${Date.now()}`,
              status: 'SHIPPED',
              title: 'Logistics Consignment Dispatched',
              description: `Handed over packages to ${data.carrier} with tracking code: ${data.trackingNumber}.`,
              actor: 'Logistics Manager',
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return o;
    });

    set({
      orders: updatedOrders,
      shipments: [newShipment, ...shipments],
      tracking: [newTracking, ...get().tracking]
    });

    saveToStorage('ent_ord_orders', updatedOrders);
    saveToStorage('ent_ord_shipments', [newShipment, ...shipments]);
    saveToStorage('ent_ord_tracking', [newTracking, ...get().tracking]);

    return newShipment;
  },

  updateShipmentStatus: (shipmentId, status, details) => {
    const updatedShipments = get().shipments.map(s => {
      if (s.id === shipmentId) {
        const updatedShipment = {
          ...s,
          status,
          actualDelivery: status === 'DELIVERED' ? new Date().toISOString() : s.actualDelivery,
          deliveryNotes: details || s.deliveryNotes
        };

        // Also update matching tracking details
        const updatedTracking = get().tracking.map(t => {
          if (t.trackingNumber === s.trackingNumber) {
            const stepTitle = status === 'DELIVERED' ? 'Consignment Delivered' : 
                              status === 'IN_TRANSIT' ? 'Parcel In Transit' : 
                              status === 'OUT_FOR_DELIVERY' ? 'Out for delivery' : 
                              status === 'FAILED_ATTEMPT' ? 'Delivery Attempt Failed' : 'Parcel Updated';
            
            return {
              ...t,
              status,
              steps: [
                {
                  id: `tr-step-${Date.now()}`,
                  title: stepTitle,
                  description: details || `Parcel routing status set to ${status}.`,
                  location: t.destination,
                  timestamp: new Date().toISOString()
                },
                ...t.steps
              ]
            };
          }
          return t;
        });

        // Also update matching order status if DELIVERED
        if (status === 'DELIVERED') {
          const updatedOrders = get().orders.map(o => {
            if (o.id === s.orderId) {
              return {
                ...o,
                status: 'DELIVERED' as const,
                updatedAt: new Date().toISOString(),
                timeline: [
                  ...o.timeline,
                  {
                    id: `ev-del-auto-${Date.now()}`,
                    status: 'DELIVERED',
                    title: 'Parcel Delivery Confirmed',
                    description: details || 'Consignment successfully signed and handed to receiver.',
                    actor: `${s.carrier} Agent`,
                    timestamp: new Date().toISOString()
                  }
                ]
              };
            }
            return o;
          });
          set({ orders: updatedOrders });
          saveToStorage('ent_ord_orders', updatedOrders);
        }

        set({ tracking: updatedTracking });
        saveToStorage('ent_ord_tracking', updatedTracking);

        return updatedShipment;
      }
      return s;
    });

    set({ shipments: updatedShipments });
    saveToStorage('ent_ord_shipments', updatedShipments);
  },

  // ==========================================
  // INVOICING LEDGER
  // ==========================================

  createInvoice: (orderId) => {
    const orders = get().orders;
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');

    const invoices = get().invoices;
    const invNumber = `AERO-INV-2026-${String(invoices.length + 1).padStart(3, '0')}`;
    
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNumber,
      orderId,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      subtotal: order.subtotal,
      tax: order.tax,
      totalAmount: order.totalAmount,
      status: order.paymentStatus === 'PAID' ? 'PAID' : 'SENT',
      issuedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString().split('T')[0], // 15 days credit terms
      paidAt: order.paymentStatus === 'PAID' ? new Date().toISOString() : undefined,
      paymentMethod: order.paymentStatus === 'PAID' ? order.paymentMethod : undefined
    };

    // Link Invoice ID back to order
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          invoiceId: newInvoice.id,
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    });

    const updatedInvs = [newInvoice, ...invoices];
    set({
      orders: updatedOrders,
      invoices: updatedInvs
    });

    saveToStorage('ent_ord_orders', updatedOrders);
    saveToStorage('ent_ord_invoices', updatedInvs);

    return newInvoice;
  },

  payInvoice: (invoiceId) => {
    const updatedInvs = get().invoices.map(inv => {
      if (inv.id === invoiceId) {
        const paidInv = {
          ...inv,
          status: 'PAID' as const,
          paidAt: new Date().toISOString(),
          paymentMethod: 'BANK_TRANSFER' as PaymentMethod // default bank transfer on manual clearance
        };

        // Also update matching Order payment status
        const updatedOrders = get().orders.map(o => {
          if (o.id === inv.orderId) {
            return {
              ...o,
              paymentStatus: 'PAID' as const,
              status: o.status === 'PENDING' ? 'APPROVED' as OrderStatus : o.status,
              updatedAt: new Date().toISOString(),
              timeline: [
                ...o.timeline,
                {
                  id: `ev-inv-cl-${Date.now()}`,
                  status: 'APPROVED',
                  title: 'Financial Ledger Invoice Cleared',
                  description: `Invoiced receipt #${inv.invoiceNumber} paid in full. Handled to fulfillment clearance.`,
                  actor: 'Finance Department',
                  timestamp: new Date().toISOString()
                }
              ]
            };
          }
          return o;
        });

        set({ orders: updatedOrders });
        saveToStorage('ent_ord_orders', updatedOrders);

        return paidInv;
      }
      return inv;
    });

    set({ invoices: updatedInvs });
    saveToStorage('ent_ord_invoices', updatedInvs);
  },

  voidInvoice: (invoiceId) => {
    const updatedInvs = get().invoices.map(inv => {
      if (inv.id === invoiceId) {
        return { ...inv, status: 'VOID' as const };
      }
      return inv;
    });
    set({ invoices: updatedInvs });
    saveToStorage('ent_ord_invoices', updatedInvs);
  },

  // ==========================================
  // RETURNS, REFUNDS & CANCELLATIONS
  // ==========================================

  requestReturn: (data) => {
    const returns = get().returns;
    const retNumber = `AERO-RET-2026-${String(returns.length + 1).padStart(3, '0')}`;
    
    const newReturn: ReturnRequest = {
      ...data,
      id: `ret-${Date.now()}`,
      returnNumber: retNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update matching Order state
    const updatedOrders = get().orders.map(o => {
      if (o.id === data.orderId) {
        return {
          ...o,
          status: 'RETURN_REQUESTED' as const,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...o.timeline,
            {
              id: `ev-ret-req-${Date.now()}`,
              status: 'RETURN_REQUESTED',
              title: 'Consignment Return Request Logged',
              description: `Return ledger #${retNumber} generated. Reason: ${data.reason}.`,
              actor: 'Logistics Supervisor',
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return o;
    });

    const updatedReturns = [newReturn, ...returns];
    set({
      orders: updatedOrders,
      returns: updatedReturns
    });

    saveToStorage('ent_ord_orders', updatedOrders);
    saveToStorage('ent_ord_returns', updatedReturns);

    return newReturn;
  },

  processReturnStatus: (returnId, status, itemStatuses, customRefundAmount) => {
    const updatedReturns = get().returns.map(ret => {
      if (ret.id === returnId) {
        const finalRefundAmt = customRefundAmount !== undefined ? customRefundAmount : ret.refundAmount;
        const processedReturn: ReturnRequest = {
          ...ret,
          status,
          refundAmount: finalRefundAmt,
          updatedAt: new Date().toISOString()
        };

        if (itemStatuses) {
          processedReturn.items = ret.items.map(it => ({
            ...it,
            status: itemStatuses[it.id] || it.status
          }));
        }

        // Handle success operations
        if (status === 'APPROVED' || status === 'COMPLETED') {
          // 1. Process customer refund if approved or completed
          if (ret.refundToWallet) {
            try {
              const { useCustomerStore } = require('./customerStore');
              const customerState = useCustomerStore.getState();
              customerState.adjustWalletBalance(
                ret.customerId,
                'CREDIT',
                finalRefundAmt,
                'REFUND',
                `Refund credit for Return Ledger #${ret.returnNumber} on Order #${ret.orderNumber}`,
                'FinOps Returns'
              );
            } catch (err) {
              console.error('Failed to link credit refund back to CRM wallet:', err);
            }
          }

          // 2. Adjust matching order status to REFUNDED/RETURNED
          const updatedOrders = get().orders.map(o => {
            if (o.id === ret.orderId) {
              return {
                ...o,
                status: 'RETURNED' as const,
                paymentStatus: 'REFUNDED' as const,
                updatedAt: new Date().toISOString(),
                timeline: [
                  ...o.timeline,
                  {
                    id: `ev-ret-com-${Date.now()}`,
                    status: 'RETURNED',
                    title: 'Consignment Returned & Refund Disbursed',
                    description: `Return request #${ret.returnNumber} finalized. Total Refund of ₹${finalRefundAmt.toLocaleString()} credited successfully.`,
                    actor: 'FinOps Audit Team',
                    timestamp: new Date().toISOString()
                  }
                ]
              };
            }
            return o;
          });

          // Also adjust matching Invoice status if refund is done
          const updatedInvs = get().invoices.map(inv => {
            if (inv.orderId === ret.orderId) {
              return { ...inv, status: 'VOID' as const };
            }
            return inv;
          });

          set({ orders: updatedOrders, invoices: updatedInvs });
          saveToStorage('ent_ord_orders', updatedOrders);
          saveToStorage('ent_ord_invoices', updatedInvs);
        } else if (status === 'REJECTED') {
          // Reject return on Order timeline
          const updatedOrders = get().orders.map(o => {
            if (o.id === ret.orderId) {
              return {
                ...o,
                status: 'APPROVED' as const, // restore back to active status or retain DELIVERED
                updatedAt: new Date().toISOString(),
                timeline: [
                  ...o.timeline,
                  {
                    id: `ev-ret-rej-${Date.now()}`,
                    status: 'APPROVED',
                    title: 'Return Request Rejected',
                    description: `Return ledger #${ret.returnNumber} audited and rejected by administrative review.`,
                    actor: 'Ops Desk Supervisor',
                    timestamp: new Date().toISOString()
                  }
                ]
              };
            }
            return o;
          });
          set({ orders: updatedOrders });
          saveToStorage('ent_ord_orders', updatedOrders);
        }

        return processedReturn;
      }
      return ret;
    });

    set({ returns: updatedReturns });
    saveToStorage('ent_ord_returns', updatedReturns);
  },

  cancelOrder: (orderId, reason) => {
    const updatedOrders = get().orders.map(o => {
      if (o.id === orderId) {
        const cancelledOrder = {
          ...o,
          status: 'CANCELLED' as const,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...o.timeline,
            {
              id: `ev-can-${Date.now()}`,
              status: 'CANCELLED',
              title: 'Order Cancelled',
              description: `Consignment voided. Reason: ${reason}`,
              actor: 'Administrative Portal Clerk',
              timestamp: new Date().toISOString()
            }
          ]
        };

        // If paid, issue immediate wallet refund
        if (o.paymentStatus === 'PAID') {
          try {
            const { useCustomerStore } = require('./customerStore');
            const customerState = useCustomerStore.getState();
            customerState.adjustWalletBalance(
              o.customerId,
              'CREDIT',
              o.totalAmount,
              'REFUND',
              `Immediate wallet reversal for cancelled Order #${o.orderNumber}`,
              'Automatic Checkout Gateway'
            );
            
            // Deduct points earned on that order if any
            const pointsEarned = Math.floor(o.totalAmount / 100);
            if (pointsEarned > 0) {
              customerState.adjustRewardPoints(
                o.customerId,
                'EXPIRED',
                pointsEarned,
                `Points reversal for cancelled Order #${o.orderNumber}`,
                o.id
              );
            }

            cancelledOrder.paymentStatus = 'REFUNDED' as const;
            cancelledOrder.timeline.push({
              id: `ev-can-ref-${Date.now()}`,
              status: 'REFUNDED',
              title: 'Automatic Financial Reversal Completed',
              description: `₹${o.totalAmount.toLocaleString()} credited back successfully to customer wallet balance.`,
              actor: 'Gateway Core Ledger',
              timestamp: new Date().toISOString()
            });
          } catch (err) {
            console.error('Failed to refund customer balance during order cancel:', err);
          }
        }

        // Void invoice if exists
        if (o.invoiceId) {
          const updatedInvs = get().invoices.map(inv => {
            if (inv.orderId === orderId) return { ...inv, status: 'VOID' as const };
            return inv;
          });
          set({ invoices: updatedInvs });
          saveToStorage('ent_ord_invoices', updatedInvs);
        }

        return cancelledOrder;
      }
      return o;
    });

    set({ orders: updatedOrders });
    saveToStorage('ent_ord_orders', updatedOrders);
  }
}));
