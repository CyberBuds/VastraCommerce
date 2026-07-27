import { create } from 'zustand';
import { 
  Customer, 
  CustomerGroup, 
  CustomerSegment, 
  Address, 
  WalletTransaction, 
  RewardPointHistory, 
  WishlistItem, 
  CustomerReview, 
  SupportTicket, 
  CustomerNote, 
  ActivityLog,
  TicketMessage
} from '@/types/customer';

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
    console.error('Failed to sync CRM state to storage:', e);
  }
}

// ==========================================
// DEFAULT SEED DATA
// ==========================================

const DEFAULT_GROUPS: CustomerGroup[] = [
  { id: 'g-default', name: 'Retail Customers', code: 'RETAIL', description: 'Standard consumer tier with standard retail pricing.', isDefault: true, discountPercentage: 0, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'g-wholesale', name: 'Wholesale Partners', code: 'WHOLESALE', description: 'B2B procurement accounts qualifying for wholesale bulk rates.', isDefault: false, discountPercentage: 15, pricingRuleDescription: '15% Flat off all catalog categories on order > ₹25,000.', createdAt: '2026-01-02T00:00:00Z' },
  { id: 'g-vip', name: 'VIP High Net', code: 'VIP', description: 'Elite tier with dedicated account managers and pre-launch access.', isDefault: false, discountPercentage: 10, pricingRuleDescription: '10% Flat off, 2x multiplier on loyalty rewards, free air shipping.', createdAt: '2026-01-05T00:00:00Z' },
  { id: 'g-premium', name: 'Premium Club', code: 'PREMIUM', description: 'Loyal recurring subscribers on annual premium logistics tier.', isDefault: false, discountPercentage: 5, pricingRuleDescription: '5% Flat off, priority dispatch windows.', createdAt: '2026-01-08T00:00:00Z' },
  { id: 'g-corporate', name: 'Corporate Enterprise', code: 'CORPORATE', description: 'Registered business entities with customized tax and billing rules.', isDefault: false, discountPercentage: 12, pricingRuleDescription: '12% Flat off, Net 30 payment terms allowed.', createdAt: '2026-01-10T00:00:00Z' },
];

const DEFAULT_SEGMENTS: CustomerSegment[] = [
  { id: 'seg-1', name: 'High Spenders (VIP)', description: 'Customers with cumulative spend > ₹1,00,000.', queryConfig: { minRevenue: 100000 }, memberCount: 2, createdAt: '2026-02-01T00:00:00Z' },
  { id: 'seg-2', name: 'Inactive Users', description: 'Registered users who have not logged in since June 2026.', queryConfig: { lastLoginAfter: '2026-06-01T00:00:00Z' }, memberCount: 3, createdAt: '2026-02-05T00:00:00Z' },
  { id: 'seg-3', name: 'Wallet Whales', description: 'Users keeping active balances > ₹10,000 in their customer wallet.', queryConfig: { minWalletBalance: 10000 }, memberCount: 1, createdAt: '2026-02-10T00:00:00Z' },
  { id: 'seg-4', name: 'Loyalty Superstars', description: 'Loyalty point holders with > 1,000 redeemable points.', queryConfig: { minLoyaltyPoints: 1000 }, memberCount: 2, createdAt: '2026-02-12T00:00:00Z' },
];

const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    customerCode: 'ENT-CUST-1001',
    firstName: 'Yash',
    lastName: 'Gupta',
    email: 'ykgupta042@gmail.com',
    phone: '+91 98765 43210',
    avatarUrl: 'https://picsum.photos/seed/yash/200',
    dob: '1995-10-24',
    gender: 'MALE',
    status: 'ACTIVE',
    emailVerified: true,
    phoneVerified: true,
    source: 'WEB',
    referralCode: 'YASH95',
    groupId: 'g-vip',
    groupName: 'VIP High Net',
    tags: ['Key Account', 'Tech Enthusiast', 'Early Adopter'],
    createdAt: '2026-01-15T08:30:00Z',
    lastLoginAt: '2026-07-20T06:00:00Z',
    walletBalance: 15450.00,
    rewardPoints: 1250,
    addresses: [
      { id: 'addr-1-1', type: 'BILLING', isDefault: true, name: 'Yash Gupta Head Office', phone: '+91 98765 43210', addressLine1: '402, Signature Corporate Towers', addressLine2: 'Bandstand Road, Bandra West', city: 'Mumbai', state: 'Maharashtra', postalCode: '400050', country: 'India', latitude: 19.0436, longitude: 72.8231 },
      { id: 'addr-1-2', type: 'SHIPPING', isDefault: true, name: 'Yash Gupta Residence', phone: '+91 98765 43210', addressLine1: 'Apartment 24B, Sea Breeze Apartments', addressLine2: 'Carter Road', city: 'Mumbai', state: 'Maharashtra', postalCode: '400052', country: 'India', latitude: 19.0655, longitude: 72.8256 }
    ],
    walletTransactions: [
      { id: 'tx-1-1', type: 'CREDIT', amount: 20000.00, purpose: 'DEPOSIT', notes: 'Initial wallet load', timestamp: '2026-01-15T10:00:00Z', approvedBy: 'FinOps System' },
      { id: 'tx-1-2', type: 'DEBIT', amount: 4550.00, purpose: 'ORDER_PAYMENT', referenceId: 'ORD-98432', notes: 'Deduction for turbine assembly', timestamp: '2026-07-20T05:30:00Z', approvedBy: 'Checkout Agent' }
    ],
    rewardPointsHistory: [
      { id: 'rw-1-1', type: 'EARNED', points: 1000, reason: 'Welcome bonus for account creation', timestamp: '2026-01-15T08:30:00Z' },
      { id: 'rw-1-2', type: 'EARNED', points: 250, reason: 'Purchase reward points on turbine parts', referenceId: 'ORD-98432', timestamp: '2026-07-20T05:30:00Z' }
    ],
    wishlist: [
      { sku: 'SKU-AERO-10000', productName: 'AeroFlow Turbine X1', price: 950.00, addedAt: '2026-07-15T12:00:00Z' },
      { sku: 'SKU-AERO-10004', productName: 'GigaCharge battery pack', price: 1200.00, addedAt: '2026-07-18T16:45:00Z' }
    ],
    reviews: [
      { id: 'rev-1-1', productName: 'AeroFlow Turbine X1', sku: 'SKU-AERO-10000', rating: 5, reviewText: 'Industrial efficiency at its absolute finest. High-density turbine operates perfectly quiet in extreme heat.', status: 'APPROVED', replyText: 'Thank you Yash! We appreciate your continuous enterprise trust.', createdAt: '2026-07-19T10:00:00Z' }
    ],
    tickets: [
      {
        id: 'tkt-1-1',
        ticketNumber: 'TKT-2026-001',
        title: 'Expedited customs clearance verification',
        customerId: 'cust-1',
        customerName: 'Yash Gupta',
        assignedStaffId: 'staff-1',
        assignedStaffName: 'Ananya Roy (Logistics Support)',
        priority: 'URGENT',
        department: 'TECHNICAL',
        category: 'Customs Delay',
        status: 'IN_PROGRESS',
        internalNotes: 'Customer requested prioritised air clearing for turbine gaskets.',
        attachments: ['customs_clearance_declaration.pdf'],
        createdAt: '2026-07-19T09:15:00Z',
        updatedAt: '2026-07-20T06:00:00Z',
        messages: [
          { id: 'msg-1-1-1', sender: 'CUSTOMER', senderName: 'Yash Gupta', content: 'Hi, please expedite customs clearing clearance paperwork on consignment SKU-AERO-10000. It is currently stalled at the terminal.', timestamp: '2026-07-19T09:15:00Z' },
          { id: 'msg-1-1-2', sender: 'STAFF', senderName: 'Ananya Roy', content: 'Understood Yash, our logistics team is already validating structural transport manifests. We will update you in 2 hours.', timestamp: '2026-07-19T11:30:00Z' }
        ]
      }
    ],
    notes: [
      { id: 'not-1-1', content: 'Prefers communication over WhatsApp. Direct WhatsApp number is configured.', type: 'PRIVATE', isPinned: true, author: 'Admin Officer', createdAt: '2026-01-16T11:00:00Z' },
      { id: 'not-1-2', content: 'Enterprise account eligible for standard air shipment upgrades.', type: 'PUBLIC', isPinned: false, author: 'Support Manager', createdAt: '2026-03-20T14:15:00Z' }
    ],
    activityLogs: [
      { id: 'act-1-1', action: 'REGISTRATION', title: 'Account Activated', description: 'Registered via web portal', timestamp: '2026-01-15T08:30:00Z' },
      { id: 'act-1-2', action: 'WALLET_ADJUSTMENT', title: 'Loaded Wallet Balance', description: 'Loaded ₹20,000 via NetBanking', referenceId: 'tx-1-1', timestamp: '2026-01-15T10:00:00Z' },
      { id: 'act-1-3', action: 'ORDER_PLACEMENT', title: 'Order Completed', description: 'Ordered turbine parts', referenceId: 'ORD-98432', timestamp: '2026-07-20T05:30:00Z' }
    ]
  },
  {
    id: 'cust-2',
    customerCode: 'ENT-CUST-1002',
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@gmail.com',
    phone: '+91 87654 32109',
    avatarUrl: 'https://picsum.photos/seed/aarav/200',
    dob: '1988-05-12',
    gender: 'MALE',
    status: 'ACTIVE',
    emailVerified: true,
    phoneVerified: false,
    source: 'ANDROID',
    groupId: 'g-default',
    groupName: 'Retail Customers',
    tags: ['Retail', 'Fluid Buyer'],
    createdAt: '2026-02-10T11:45:00Z',
    lastLoginAt: '2026-07-15T14:20:00Z',
    walletBalance: 2450.00,
    rewardPoints: 450,
    addresses: [
      { id: 'addr-2-1', type: 'BILLING', isDefault: true, name: 'Aarav Sharma Residence', phone: '+91 87654 32109', addressLine1: 'Flat 503, Shanti Niketan', addressLine2: 'Jubilee Hills Road 10', city: 'Hyderabad', state: 'Telangana', postalCode: '500033', country: 'India' }
    ],
    walletTransactions: [
      { id: 'tx-2-1', type: 'CREDIT', amount: 3000.00, purpose: 'DEPOSIT', timestamp: '2026-02-10T12:00:00Z' },
      { id: 'tx-2-2', type: 'DEBIT', amount: 550.00, purpose: 'ORDER_PAYMENT', timestamp: '2026-05-12T09:30:00Z' }
    ],
    rewardPointsHistory: [
      { id: 'rw-2-1', type: 'EARNED', points: 450, reason: 'Fluid purchase credit', timestamp: '2026-05-12T09:30:00Z' }
    ],
    wishlist: [
      { sku: 'SKU-AERO-10002', productName: 'Industrial Hydraulic Fluid', price: 180.00, addedAt: '2026-06-20T10:00:00Z' }
    ],
    reviews: [
      { id: 'rev-2-1', productName: 'Industrial Hydraulic Fluid', sku: 'SKU-AERO-10002', rating: 4, reviewText: 'Good viscosity levels. Fast transport sealing packaging.', status: 'APPROVED', replyText: 'Glad you like it, Aarav!', createdAt: '2026-05-13T11:00:00Z' }
    ],
    tickets: [],
    notes: [],
    activityLogs: [
      { id: 'act-2-1', action: 'REGISTRATION', title: 'Account Activated', description: 'Registered via Android App', timestamp: '2026-02-10T11:45:00Z' }
    ]
  },
  {
    id: 'cust-3',
    customerCode: 'ENT-CUST-1003',
    firstName: 'Priya',
    lastName: 'Nair',
    email: 'priya.nair@corporate.in',
    phone: '+91 76543 21098',
    avatarUrl: 'https://picsum.photos/seed/priya/200',
    dob: '1990-03-18',
    gender: 'FEMALE',
    status: 'ACTIVE',
    emailVerified: true,
    phoneVerified: true,
    source: 'WEB',
    referralCode: 'PRIYA03',
    groupId: 'g-corporate',
    groupName: 'Corporate Enterprise',
    tags: ['Strategic Partner', 'Heavy Industry'],
    createdAt: '2026-03-01T14:30:00Z',
    lastLoginAt: '2026-07-20T08:15:00Z',
    walletBalance: 87200.00,
    rewardPoints: 2400,
    addresses: [
      { id: 'addr-3-1', type: 'BILLING', isDefault: true, name: 'Nair Industrial Supplies', phone: '+91 76543 21098', addressLine1: 'Plot 45, Electronics City Phase 1', city: 'Bengaluru', state: 'Karnataka', postalCode: '560100', country: 'India' },
      { id: 'addr-3-2', type: 'SHIPPING', isDefault: true, name: 'Main Depot Bengaluru', phone: '+91 76543 21098', addressLine1: 'Warehouse 4-C, Electronic City Block B', city: 'Bengaluru', state: 'Karnataka', postalCode: '560100', country: 'India' }
    ],
    walletTransactions: [
      { id: 'tx-3-1', type: 'CREDIT', amount: 100000.00, purpose: 'DEPOSIT', notes: 'Corporate purchase advance', timestamp: '2026-03-01T15:00:00Z' },
      { id: 'tx-3-2', type: 'DEBIT', amount: 12800.00, purpose: 'ORDER_PAYMENT', notes: 'Parts purchase invoice #ENT-492', timestamp: '2026-04-10T11:00:00Z' }
    ],
    rewardPointsHistory: [
      { id: 'rw-3-1', type: 'EARNED', points: 2400, reason: 'High volume parts buy', timestamp: '2026-04-10T11:00:00Z' }
    ],
    wishlist: [],
    reviews: [],
    tickets: [
      {
        id: 'tkt-3-1',
        ticketNumber: 'TKT-2026-002',
        title: 'GST Identification Invoice amendment request',
        customerId: 'cust-3',
        customerName: 'Priya Nair',
        assignedStaffId: 'staff-2',
        assignedStaffName: 'Rajesh Kumar (Billing Supervisor)',
        priority: 'MEDIUM',
        department: 'BILLING',
        category: 'Invoicing GST',
        status: 'RESOLVED',
        internalNotes: 'GSTIN successfully updated in the corporate ERP node.',
        createdAt: '2026-07-10T10:00:00Z',
        updatedAt: '2026-07-11T16:00:00Z',
        messages: [
          { id: 'msg-3-1-1', sender: 'CUSTOMER', senderName: 'Priya Nair', content: 'Dear billing team, please update GSTIN to 29AABCN8492C1Z8 on the last transaction receipt.', timestamp: '2026-07-10T10:00:00Z' },
          { id: 'msg-3-1-2', sender: 'STAFF', senderName: 'Rajesh Kumar', content: 'Hello Priya, we have amended the invoice data fields. Updated PDF sent to your email. Closing this request.', timestamp: '2026-07-11T15:45:00Z' },
          { id: 'msg-3-1-3', sender: 'SYSTEM', senderName: 'Automation Engine', content: 'Ticket status was automatically set to RESOLVED.', timestamp: '2026-07-11T16:00:00Z' }
        ]
      }
    ],
    notes: [
      { id: 'not-3-1', content: 'B2B GST Account: 29AABCN8492C1Z8 verified.', type: 'PRIVATE', isPinned: true, author: 'Rajesh Kumar', createdAt: '2026-03-02T10:00:00Z' }
    ],
    activityLogs: [
      { id: 'act-3-1', action: 'REGISTRATION', title: 'Corporate Registration Completed', description: 'Enrolled under Corporate SLA structure', timestamp: '2026-03-01T14:30:00Z' }
    ]
  },
  {
    id: 'cust-4',
    customerCode: 'ENT-CUST-1004',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@enterprise.com',
    phone: '+1 555 0199',
    dob: '1975-08-15',
    gender: 'MALE',
    status: 'INACTIVE',
    emailVerified: true,
    phoneVerified: true,
    source: 'ADMIN',
    groupId: 'g-default',
    groupName: 'Retail Customers',
    tags: ['Legacy User'],
    createdAt: '2025-05-10T09:00:00Z',
    lastLoginAt: '2026-05-10T12:00:00Z',
    walletBalance: 0.00,
    rewardPoints: 0,
    addresses: [
      { id: 'addr-4-1', type: 'BILLING', isDefault: true, name: 'John Doe NY Office', phone: '+1 555 0199', addressLine1: '120 Broadway Street', city: 'New York', state: 'NY', postalCode: '10271', country: 'USA' }
    ],
    walletTransactions: [],
    rewardPointsHistory: [],
    wishlist: [],
    reviews: [],
    tickets: [],
    notes: [],
    activityLogs: [
      { id: 'act-4-1', action: 'REGISTRATION', title: 'Legacy Import', description: 'Imported by logistics administrator', timestamp: '2025-05-10T09:00:00Z' }
    ]
  },
  {
    id: 'cust-5',
    customerCode: 'ENT-CUST-1005',
    firstName: 'Karan',
    lastName: 'Mehta',
    email: 'karan.mehta@techcorp.com',
    phone: '+91 99887 76655',
    avatarUrl: 'https://picsum.photos/seed/karan/200',
    dob: '1992-12-05',
    gender: 'MALE',
    status: 'BLOCKED',
    emailVerified: false,
    phoneVerified: true,
    source: 'REFERRAL',
    referralCode: 'YASH95',
    groupId: 'g-default',
    groupName: 'Retail Customers',
    tags: ['Fraud Risk', 'Payment Dispute'],
    createdAt: '2026-04-15T15:30:00Z',
    lastLoginAt: '2026-05-01T18:00:00Z',
    walletBalance: 0.00,
    rewardPoints: 100,
    addresses: [
      { id: 'addr-5-1', type: 'BILLING', isDefault: true, name: 'Karan Mehta Flat', phone: '+91 99887 76655', addressLine1: 'C-904, Royal Palms', city: 'Pune', state: 'Maharashtra', postalCode: '411048', country: 'India' }
    ],
    walletTransactions: [
      { id: 'tx-5-1', type: 'CREDIT', amount: 5000.00, purpose: 'DEPOSIT', timestamp: '2026-04-15T16:00:00Z' },
      { id: 'tx-5-2', type: 'DEBIT', amount: 5000.00, purpose: 'ADJUSTMENT', notes: 'Chargeback dispute correction', timestamp: '2026-05-02T10:00:00Z' }
    ],
    rewardPointsHistory: [
      { id: 'rw-5-1', type: 'EARNED', points: 100, reason: 'Referral signup points', timestamp: '2026-04-15T15:30:00Z' }
    ],
    wishlist: [],
    reviews: [
      { id: 'rev-5-1', productName: 'Carbon Fiber Strut', sku: 'SKU-AERO-10003', rating: 1, reviewText: 'Disappointed with transport logistics times, order took 8 days.', status: 'REJECTED', createdAt: '2026-04-25T14:00:00Z' }
    ],
    tickets: [
      {
        id: 'tkt-5-1',
        ticketNumber: 'TKT-2026-003',
        title: 'Disputed wallet credit charges',
        customerId: 'cust-5',
        customerName: 'Karan Mehta',
        assignedStaffId: 'staff-3',
        assignedStaffName: 'Yash Gupta (Audit Officer)',
        priority: 'HIGH',
        department: 'BILLING',
        category: 'Dispute Chargeback',
        status: 'CLOSED',
        internalNotes: 'Chargeback raised on bank, account blocked for validation security rules.',
        createdAt: '2026-05-01T10:00:00Z',
        updatedAt: '2026-05-02T11:00:00Z',
        messages: [
          { id: 'msg-5-1-1', sender: 'CUSTOMER', senderName: 'Karan Mehta', content: 'I want a full refund on my last loaded balance.', timestamp: '2026-05-01T10:00:00Z' },
          { id: 'msg-5-1-2', sender: 'STAFF', senderName: 'Yash Gupta', content: 'Hello Karan, your bank already filed a legal chargeback query. As a result, we have adjusted your wallet. This account is locked under terms of service rules.', timestamp: '2026-05-02T10:30:00Z' }
        ]
      }
    ],
    notes: [
      { id: 'not-5-1', content: 'Account locked due to bank chargeback. Risk team flagged.', type: 'PRIVATE', isPinned: true, author: 'Yash Gupta', createdAt: '2026-05-02T11:00:00Z' }
    ],
    activityLogs: [
      { id: 'act-5-1', action: 'REGISTRATION', title: 'Referred Signup', description: 'Signed up using referral code YASH95', timestamp: '2026-04-15T15:30:00Z' },
      { id: 'act-5-2', action: 'SUPPORT_TICKET', title: 'Ticket Lodged', description: 'Created billing ticket', referenceId: 'tkt-5-1', timestamp: '2026-05-01T10:00:00Z' }
    ]
  },
  {
    id: 'cust-6',
    customerCode: 'ENT-CUST-1006',
    firstName: 'Anjali',
    lastName: 'Sen',
    email: 'anjali.sen@retail.co.in',
    phone: '+91 91234 56789',
    avatarUrl: 'https://picsum.photos/seed/anjali/200',
    dob: '1993-07-20',
    gender: 'FEMALE',
    status: 'ACTIVE',
    emailVerified: true,
    phoneVerified: true,
    source: 'WEB',
    groupId: 'g-premium',
    groupName: 'Premium Club',
    tags: ['Premium Support', 'High Frequency'],
    createdAt: '2026-01-20T10:00:00Z',
    lastLoginAt: '2026-07-19T17:30:00Z',
    walletBalance: 4200.00,
    rewardPoints: 1100,
    addresses: [
      { id: 'addr-6-1', type: 'BILLING', isDefault: true, name: 'Anjali Sen Home', phone: '+91 91234 56789', addressLine1: 'Flat B-702, Greenfield Residences', addressLine2: 'Salt Lake Sector V', city: 'Kolkata', state: 'West Bengal', postalCode: '700091', country: 'India' }
    ],
    walletTransactions: [
      { id: 'tx-6-1', type: 'CREDIT', amount: 5000.00, purpose: 'DEPOSIT', timestamp: '2026-01-20T11:00:00Z' },
      { id: 'tx-6-2', type: 'DEBIT', amount: 800.00, purpose: 'ORDER_PAYMENT', timestamp: '2026-02-15T14:00:00Z' }
    ],
    rewardPointsHistory: [
      { id: 'rw-6-1', type: 'EARNED', points: 1100, reason: 'Annual subscription loyalty tier credit', timestamp: '2026-01-20T10:00:00Z' }
    ],
    wishlist: [
      { sku: 'SKU-AERO-10001', productName: 'Quantum Spark Plug', price: 12.50, addedAt: '2026-07-18T10:00:00Z' }
    ],
    reviews: [
      { id: 'rev-6-1', productName: 'Quantum Spark Plug', sku: 'SKU-AERO-10001', rating: 5, reviewText: 'Very reliable spark ignition plug. Will buy wholesale next schedule.', status: 'APPROVED', createdAt: '2026-03-01T10:00:00Z' }
    ],
    tickets: [],
    notes: [],
    activityLogs: [
      { id: 'act-6-1', action: 'REGISTRATION', title: 'Joined Premium Membership', description: 'Activated premium SLA tier', timestamp: '2026-01-20T10:00:00Z' }
    ]
  }
];

// ==========================================
// STORE ACTIONS & INTERFACE
// ==========================================

interface CustomerState {
  customers: Customer[];
  groups: CustomerGroup[];
  segments: CustomerSegment[];
  isLoading: boolean;
}

interface CustomerActions {
  // Customer CRUD
  addCustomer: (customer: Omit<Customer, 'id' | 'customerCode' | 'createdAt' | 'addresses' | 'walletTransactions' | 'rewardPointsHistory' | 'wishlist' | 'reviews' | 'tickets' | 'notes' | 'activityLogs'> & { addresses?: Address[] }) => Customer;
  updateCustomer: (id: string, updated: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  // Bulk operations
  bulkUpdateStatus: (ids: string[], status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED') => void;
  bulkDelete: (ids: string[]) => void;
  bulkAssignGroup: (ids: string[], groupId: string, groupName: string) => void;
  bulkAssignTags: (ids: string[], tags: string[]) => void;

  // Wallet
  adjustWalletBalance: (customerId: string, type: 'CREDIT' | 'DEBIT', amount: number, purpose: WalletTransaction['purpose'], notes?: string, approvedBy?: string) => void;
  
  // Reward Points
  adjustRewardPoints: (customerId: string, type: 'EARNED' | 'REDEEMED' | 'EXPIRED', points: number, reason: string, referenceId?: string) => void;
  
  // Wishlist
  moveToCart: (customerId: string, sku: string) => void;
  removeFromWishlist: (customerId: string, sku: string) => void;
  bulkDeleteWishlist: (customerId: string, skus: string[]) => void;
  addToWishlist: (customerId: string, item: WishlistItem) => void;

  // Reviews
  approveReview: (customerId: string, reviewId: string) => void;
  rejectReview: (customerId: string, reviewId: string) => void;
  deleteReview: (customerId: string, reviewId: string) => void;
  replyToReview: (customerId: string, reviewId: string, replyText: string) => void;

  // Support Tickets
  addTicket: (customerId: string, title: string, department: SupportTicket['department'], priority: SupportTicket['priority'], category: string, initialMessage: string, attachments?: string[]) => SupportTicket;
  addTicketMessage: (ticketId: string, sender: TicketMessage['sender'], senderName: string, content: string, attachments?: string[]) => void;
  assignTicketStaff: (ticketId: string, staffId: string, staffName: string) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  addTicketInternalNotes: (ticketId: string, notes: string) => void;

  // Notes
  addCustomerNote: (customerId: string, content: string, type: CustomerNote['type'], author: string) => void;
  togglePinNote: (customerId: string, noteId: string) => void;
  deleteCustomerNote: (customerId: string, noteId: string) => void;

  // Groups CRUD
  addGroup: (group: Omit<CustomerGroup, 'id' | 'createdAt'>) => void;
  updateGroup: (id: string, updated: Partial<CustomerGroup>) => void;
  deleteGroup: (id: string) => void;

  // Segments CRUD
  addSegment: (segment: Omit<CustomerSegment, 'id' | 'createdAt' | 'memberCount'>) => void;
  updateSegment: (id: string, updated: Partial<CustomerSegment>) => void;
  deleteSegment: (id: string) => void;
  recalculateSegmentMembers: () => void;
}

export const useCustomerStore = create<CustomerState & CustomerActions>((set, get) => ({
  customers: getFromStorage('ent_crm_customers', DEFAULT_CUSTOMERS),
  groups: getFromStorage('ent_crm_groups', DEFAULT_GROUPS),
  segments: getFromStorage('ent_crm_segments', DEFAULT_SEGMENTS),
  isLoading: false,

  // 1. ADD CUSTOMER
  addCustomer: (data) => {
    const customers = get().customers;
    const groups = get().groups;
    
    const targetGroup = groups.find(g => g.id === data.groupId);
    const grpName = targetGroup ? targetGroup.name : 'Retail Customers';

    const newCustomer: Customer = {
      ...data,
      id: `cust-${Date.now()}`,
      customerCode: `ENT-CUST-${1000 + customers.length + 1}`,
      groupName: grpName,
      createdAt: new Date().toISOString(),
      addresses: data.addresses || [],
      walletBalance: data.walletBalance || 0,
      walletTransactions: data.walletBalance ? [{
        id: `tx-init-${Date.now()}`,
        type: 'CREDIT',
        amount: data.walletBalance,
        purpose: 'DEPOSIT',
        notes: 'Initial account activation deposit',
        timestamp: new Date().toISOString(),
        approvedBy: 'CRM Officer'
      }] : [],
      rewardPoints: data.rewardPoints || 0,
      rewardPointsHistory: data.rewardPoints ? [{
        id: `rw-init-${Date.now()}`,
        type: 'EARNED',
        points: data.rewardPoints,
        reason: 'Initial account setup allocation',
        timestamp: new Date().toISOString()
      }] : [],
      wishlist: [],
      reviews: [],
      tickets: [],
      notes: [],
      activityLogs: [
        {
          id: `act-init-${Date.now()}`,
          action: 'REGISTRATION',
          title: 'Profile Provisioned',
          description: `Account created under ${grpName} group classification.`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    const updated = [...customers, newCustomer];
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
    get().recalculateSegmentMembers();
    return newCustomer;
  },

  // 2. UPDATE CUSTOMER
  updateCustomer: (id, updatedFields) => {
    const updated = get().customers.map(c => {
      if (c.id === id) {
        const withUpdates = { ...c, ...updatedFields };
        // Log update action if meaningful fields change
        if (updatedFields.status || updatedFields.groupId) {
          withUpdates.activityLogs = [
            {
              id: `act-upd-${Date.now()}`,
              action: 'PROFILE_UPDATE',
              title: 'Account Settings Modified',
              description: `Admin updated fields: ${updatedFields.status ? `Status: ${updatedFields.status}` : ''} ${updatedFields.groupId ? `Group Reassigned` : ''}`,
              timestamp: new Date().toISOString()
            },
            ...c.activityLogs
          ];
        }
        return withUpdates;
      }
      return c;
    });

    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
    get().recalculateSegmentMembers();
  },

  // 3. DELETE CUSTOMER
  deleteCustomer: (id) => {
    const updated = get().customers.filter(c => c.id !== id);
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
    get().recalculateSegmentMembers();
  },

  // 4. BULK OPERATIONS
  bulkUpdateStatus: (ids, status) => {
    const updated = get().customers.map(c => {
      if (ids.includes(c.id)) {
        return {
          ...c,
          status,
          activityLogs: [
            {
              id: `act-bulk-${Date.now()}`,
              action: 'PROFILE_UPDATE' as const,
              title: `Status Changed to ${status}`,
              description: `Bulk operation triggered status override.`,
              timestamp: new Date().toISOString()
            },
            ...c.activityLogs
          ]
        };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
    get().recalculateSegmentMembers();
  },

  bulkDelete: (ids) => {
    const updated = get().customers.filter(c => !ids.includes(c.id));
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
    get().recalculateSegmentMembers();
  },

  bulkAssignGroup: (ids, groupId, groupName) => {
    const updated = get().customers.map(c => {
      if (ids.includes(c.id)) {
        return {
          ...c,
          groupId,
          groupName,
          activityLogs: [
            {
              id: `act-grp-${Date.now()}`,
              action: 'PROFILE_UPDATE' as const,
              title: `Reassigned to Group: ${groupName}`,
              description: `Bulk assignment triggered group update.`,
              timestamp: new Date().toISOString()
            },
            ...c.activityLogs
          ]
        };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
    get().recalculateSegmentMembers();
  },

  bulkAssignTags: (ids, tags) => {
    const updated = get().customers.map(c => {
      if (ids.includes(c.id)) {
        // Merge without duplicates
        const mergedTags = Array.from(new Set([...c.tags, ...tags]));
        return { ...c, tags: mergedTags };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  // 5. ADJUST WALLET
  adjustWalletBalance: (customerId, type, amount, purpose, notes, approvedBy) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const delta = type === 'CREDIT' ? amount : -amount;
        const newBalance = Math.max(0, c.walletBalance + delta);
        
        const newTx: WalletTransaction = {
          id: `tx-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          type,
          amount,
          purpose,
          notes: notes || 'Financial audit correction',
          timestamp: new Date().toISOString(),
          approvedBy: approvedBy || 'System Administrator'
        };

        const newLog: ActivityLog = {
          id: `act-tx-${Date.now()}`,
          action: 'WALLET_ADJUSTMENT',
          title: `Wallet ${type === 'CREDIT' ? 'Credited' : 'Debited'}`,
          description: `Amount: ₹${amount.toLocaleString()} for ${purpose}. New Balance: ₹${newBalance.toLocaleString()}`,
          referenceId: newTx.id,
          timestamp: new Date().toISOString()
        };

        return {
          ...c,
          walletBalance: newBalance,
          walletTransactions: [newTx, ...c.walletTransactions],
          activityLogs: [newLog, ...c.activityLogs]
        };
      }
      return c;
    });

    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
    get().recalculateSegmentMembers();
  },

  // 6. ADJUST REWARD POINTS
  adjustRewardPoints: (customerId, type, points, reason, referenceId) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const delta = type === 'EARNED' ? points : -points;
        const newPoints = Math.max(0, c.rewardPoints + delta);

        const newHistory: RewardPointHistory = {
          id: `rw-hist-${Date.now()}`,
          type,
          points,
          reason,
          referenceId,
          expiryDate: type === 'EARNED' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : undefined, // 1 year expiry
          timestamp: new Date().toISOString()
        };

        const newLog: ActivityLog = {
          id: `act-rw-${Date.now()}`,
          action: type === 'EARNED' ? 'REWARD_EARNED' : 'REWARD_REDEEMED',
          title: `Loyalty Points ${type}`,
          description: `${points} points for ${reason}. New Balance: ${newPoints}`,
          referenceId: newHistory.id,
          timestamp: new Date().toISOString()
        };

        return {
          ...c,
          rewardPoints: newPoints,
          rewardPointsHistory: [newHistory, ...c.rewardPointsHistory],
          activityLogs: [newLog, ...c.activityLogs]
        };
      }
      return c;
    });

    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
    get().recalculateSegmentMembers();
  },

  // 7. WISHLIST ACTIONS
  moveToCart: (customerId, sku) => {
    // In our simplified mock, moving to cart just triggers a toast on client side and deletes from wishlist
    get().removeFromWishlist(customerId, sku);
  },

  removeFromWishlist: (customerId, sku) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const itemToRemove = c.wishlist.find(w => w.sku === sku);
        const filtered = c.wishlist.filter(w => w.sku !== sku);

        const newLogs = itemToRemove ? [
          {
            id: `act-wish-rm-${Date.now()}`,
            action: 'WISHLIST_REMOVE' as const,
            title: 'Removed from Wishlist',
            description: `${itemToRemove.productName} removed.`,
            timestamp: new Date().toISOString()
          },
          ...c.activityLogs
        ] : c.activityLogs;

        return {
          ...c,
          wishlist: filtered,
          activityLogs: newLogs
        };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  bulkDeleteWishlist: (customerId, skus) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const filtered = c.wishlist.filter(w => !skus.includes(w.sku));
        return { ...c, wishlist: filtered };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  addToWishlist: (customerId, item) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        // Avoid duplicate SKU
        if (c.wishlist.some(w => w.sku === item.sku)) return c;
        const added = [...c.wishlist, item];
        return {
          ...c,
          wishlist: added,
          activityLogs: [
            {
              id: `act-wish-add-${Date.now()}`,
              action: 'WISHLIST_ADD' as const,
              title: 'Added to Wishlist',
              description: `Marked item: ${item.productName}.`,
              timestamp: new Date().toISOString()
            },
            ...c.activityLogs
          ]
        };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  // 8. REVIEWS ACTIONS
  approveReview: (customerId, reviewId) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const updatedReviews = c.reviews.map(r => {
          if (r.id === reviewId) {
            return { ...r, status: 'APPROVED' as const };
          }
          return r;
        });

        const targetReview = c.reviews.find(r => r.id === reviewId);
        const logs = targetReview ? [
          {
            id: `act-rev-${Date.now()}`,
            action: 'REVIEW' as const,
            title: 'Product Review Approved',
            description: `Review for ${targetReview.productName} published.`,
            timestamp: new Date().toISOString()
          },
          ...c.activityLogs
        ] : c.activityLogs;

        return { ...c, reviews: updatedReviews, activityLogs: logs };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  rejectReview: (customerId, reviewId) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const updatedReviews = c.reviews.map(r => {
          if (r.id === reviewId) return { ...r, status: 'REJECTED' as const };
          return r;
        });
        return { ...c, reviews: updatedReviews };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  deleteReview: (customerId, reviewId) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const filtered = c.reviews.filter(r => r.id !== reviewId);
        return { ...c, reviews: filtered };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  replyToReview: (customerId, reviewId, replyText) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const updatedReviews = c.reviews.map(r => {
          if (r.id === reviewId) return { ...r, replyText };
          return r;
        });
        return { ...c, reviews: updatedReviews };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  // 9. SUPPORT TICKETS ACTIONS
  addTicket: (customerId, title, department, priority, category, initialMessage, attachments) => {
    let newlyCreatedTicket!: SupportTicket;

    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const newTicketNum = `TKT-${Date.now().toString().slice(-4)}`;
        const newTicket: SupportTicket = {
          id: `tkt-${Date.now()}`,
          ticketNumber: newTicketNum,
          title,
          customerId,
          customerName: `${c.firstName} ${c.lastName}`,
          priority,
          department,
          category,
          status: 'OPEN',
          attachments,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [
            {
              id: `msg-${Date.now()}-init`,
              sender: 'CUSTOMER',
              senderName: `${c.firstName} ${c.lastName}`,
              content: initialMessage,
              timestamp: new Date().toISOString()
            }
          ]
        };

        newlyCreatedTicket = newTicket;

        return {
          ...c,
          tickets: [newTicket, ...c.tickets],
          activityLogs: [
            {
              id: `act-tkt-${Date.now()}`,
              action: 'SUPPORT_TICKET' as const,
              title: `Support Ticket Created: ${newTicketNum}`,
              description: title,
              referenceId: newTicket.id,
              timestamp: new Date().toISOString()
            },
            ...c.activityLogs
          ]
        };
      }
      return c;
    });

    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
    return newlyCreatedTicket;
  },

  addTicketMessage: (ticketId, sender, senderName, content, attachments) => {
    const updated = get().customers.map(c => {
      // Find customer that has this ticket
      if (c.tickets.some(t => t.id === ticketId)) {
        const updatedTickets = c.tickets.map(t => {
          if (t.id === ticketId) {
            const newMsg: TicketMessage = {
              id: `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
              sender,
              senderName,
              content,
              attachments,
              timestamp: new Date().toISOString()
            };

            const autoStatusUpdate: SupportTicket['status'] = (sender === 'STAFF' && t.status === 'OPEN') ? 'ASSIGNED' : t.status;

            return {
              ...t,
              status: autoStatusUpdate,
              messages: [...t.messages, newMsg],
              updatedAt: new Date().toISOString()
            };
          }
          return t;
        });

        return { ...c, tickets: updatedTickets };
      }
      return c;
    });

    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  assignTicketStaff: (ticketId, staffId, staffName) => {
    const updated = get().customers.map(c => {
      if (c.tickets.some(t => t.id === ticketId)) {
        const updatedTickets = c.tickets.map(t => {
          if (t.id === ticketId) {
            return {
              ...t,
              assignedStaffId: staffId,
              assignedStaffName: staffName,
              status: 'ASSIGNED' as const,
              updatedAt: new Date().toISOString()
            };
          }
          return t;
        });
        return { ...c, tickets: updatedTickets };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  updateTicketStatus: (ticketId, status) => {
    const updated = get().customers.map(c => {
      if (c.tickets.some(t => t.id === ticketId)) {
        const updatedTickets = c.tickets.map(t => {
          if (t.id === ticketId) {
            return {
              ...t,
              status,
              updatedAt: new Date().toISOString()
            };
          }
          return t;
        });
        return { ...c, tickets: updatedTickets };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  addTicketInternalNotes: (ticketId, notes) => {
    const updated = get().customers.map(c => {
      if (c.tickets.some(t => t.id === ticketId)) {
        const updatedTickets = c.tickets.map(t => {
          if (t.id === ticketId) return { ...t, internalNotes: notes, updatedAt: new Date().toISOString() };
          return t;
        });
        return { ...c, tickets: updatedTickets };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  // 10. CUSTOMER NOTES ACTIONS
  addCustomerNote: (customerId, content, type, author) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const newNote: CustomerNote = {
          id: `note-${Date.now()}`,
          content,
          type,
          isPinned: false,
          author,
          createdAt: new Date().toISOString()
        };
        return { ...c, notes: [newNote, ...c.notes] };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  togglePinNote: (customerId, noteId) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const updatedNotes = c.notes.map(n => {
          if (n.id === noteId) return { ...n, isPinned: !n.isPinned };
          return n;
        });
        return { ...c, notes: updatedNotes };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  deleteCustomerNote: (customerId, noteId) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const filtered = c.notes.filter(n => n.id !== noteId);
        return { ...c, notes: filtered };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  // 11. GROUPS ACTIONS
  addGroup: (data) => {
    const newGroup: CustomerGroup = {
      ...data,
      id: `g-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [...get().groups, newGroup];
    set({ groups: updated });
    saveToStorage('ent_crm_groups', updated);
  },

  updateGroup: (id, updatedFields) => {
    const updated = get().groups.map(g => (g.id === id ? { ...g, ...updatedFields } : g));
    set({ groups: updated });
    saveToStorage('ent_crm_groups', updated);

    // Sync group name across customers if name was altered
    if (updatedFields.name) {
      const customersUpdated = get().customers.map(c => {
        if (c.groupId === id) return { ...c, groupName: updatedFields.name! };
        return c;
      });
      set({ customers: customersUpdated });
      saveToStorage('ent_crm_customers', customersUpdated);
    }
  },

  deleteGroup: (id) => {
    const updated = get().groups.filter(g => g.id !== id);
    set({ groups: updated });
    saveToStorage('ent_crm_groups', updated);
  },

  // 12. SEGMENTS ACTIONS
  addSegment: (data) => {
    const newSegment: CustomerSegment = {
      ...data,
      id: `seg-${Date.now()}`,
      memberCount: 0,
      createdAt: new Date().toISOString()
    };
    const updated = [...get().segments, newSegment];
    set({ segments: updated });
    saveToStorage('ent_crm_segments', updated);
    get().recalculateSegmentMembers();
  },

  updateSegment: (id, updatedFields) => {
    const updated = get().segments.map(s => (s.id === id ? { ...s, ...updatedFields } : s));
    set({ segments: updated });
    saveToStorage('ent_crm_segments', updated);
    get().recalculateSegmentMembers();
  },

  deleteSegment: (id) => {
    const updated = get().segments.filter(s => s.id !== id);
    set({ segments: updated });
    saveToStorage('ent_crm_segments', updated);
  },

  // 13. RE-CALCULATE MEMBER COUNTS IN SEGMENTS
  recalculateSegmentMembers: () => {
    const customers = get().customers;
    const segments = get().segments;

    const updated = segments.map(seg => {
      const config = seg.queryConfig || {};
      const rules = seg.rules || {};
      const minOrders = config.minOrders;
      const minRevenue = config.minRevenue !== undefined ? config.minRevenue : rules.minRevenue;
      const country = config.country;
      const city = config.city;
      const registeredAfter = config.registeredAfter;
      const lastLoginAfter = config.lastLoginAfter;
      const minLoyaltyPoints = config.minLoyaltyPoints !== undefined ? config.minLoyaltyPoints : rules.minPoints;
      const minWalletBalance = config.minWalletBalance !== undefined ? config.minWalletBalance : rules.minWallet;
      
      const members = customers.filter(c => {
        // Evaluate condition criteria
        if (minRevenue !== undefined) {
          // Accumulate deposit transaction volumes
          const revenueValue = c.walletTransactions
            .filter(t => t.type === 'DEBIT' && t.purpose === 'ORDER_PAYMENT')
            .reduce((sum, t) => sum + t.amount, 0);
          if (revenueValue < minRevenue) return false;
        }

        if (minWalletBalance !== undefined && c.walletBalance < minWalletBalance) return false;
        if (minLoyaltyPoints !== undefined && c.rewardPoints < minLoyaltyPoints) return false;

        if (country) {
          const hasCountry = c.addresses.some(a => a.country.toLowerCase().includes(country.toLowerCase()));
          if (!hasCountry) return false;
        }

        if (city) {
          const hasCity = c.addresses.some(a => a.city.toLowerCase().includes(city.toLowerCase()));
          if (!hasCity) return false;
        }

        if (registeredAfter && new Date(c.createdAt) < new Date(registeredAfter)) return false;
        if (lastLoginAfter && (!c.lastLoginAt || new Date(c.lastLoginAt) < new Date(lastLoginAfter))) return false;

        return true;
      });

      return {
        ...seg,
        memberCount: members.length
      };
    });

    set({ segments: updated });
    saveToStorage('ent_crm_segments', updated);
  }
}));
