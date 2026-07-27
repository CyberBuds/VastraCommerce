export interface Address {
  id: string;
  type: 'BILLING' | 'SHIPPING';
  isDefault: boolean;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface WalletTransaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  purpose: 'REFUND' | 'ADJUSTMENT' | 'DEPOSIT' | 'ORDER_PAYMENT';
  referenceId?: string;
  notes?: string;
  timestamp: string;
  approvedBy?: string;
}

export interface RewardPointHistory {
  id: string;
  type: 'EARNED' | 'REDEEMED' | 'EXPIRED';
  points: number;
  reason: string;
  referenceId?: string;
  expiryDate?: string;
  timestamp: string;
}

export interface WishlistItem {
  sku: string;
  productName: string;
  price: number;
  addedAt: string;
}

export interface CustomerReview {
  id: string;
  productName: string;
  sku: string;
  rating: number; // 1 to 5
  reviewText: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  replyText?: string;
  images?: string[];
  createdAt: string;
}

export interface TicketMessage {
  id: string;
  sender: 'CUSTOMER' | 'STAFF' | 'SYSTEM';
  senderName: string;
  content: string;
  attachments?: string[];
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  title: string;
  customerId: string;
  customerName: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  department: 'BILLING' | 'TECHNICAL' | 'SALES' | 'GENERAL';
  category: string;
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  internalNotes?: string;
  attachments?: string[];
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerNote {
  id: string;
  content: string;
  type: 'PRIVATE' | 'PUBLIC';
  isPinned: boolean;
  author: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: 'REGISTRATION' | 'LOGIN' | 'ORDER_PLACEMENT' | 'PAYMENT' | 'RETURN' | 'REFUND' | 'WISHLIST_ADD' | 'WISHLIST_REMOVE' | 'REVIEW' | 'SUPPORT_TICKET' | 'REWARD_EARNED' | 'REWARD_REDEEMED' | 'WALLET_ADJUSTMENT' | 'PROFILE_UPDATE';
  title: string;
  description: string;
  referenceId?: string;
  timestamp: string;
}

export interface Customer {
  id: string;
  customerCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  dob?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  emailVerified: boolean;
  phoneVerified: boolean;
  source: 'WEB' | 'IOS' | 'ANDROID' | 'ADMIN' | 'REFERRAL';
  referralCode?: string;
  groupId: string;
  groupName: string;
  tags: string[];
  createdAt: string;
  lastLoginAt?: string;

  // Embedded related collections
  addresses: Address[];
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  rewardPoints: number;
  rewardPointsHistory: RewardPointHistory[];
  wishlist: WishlistItem[];
  reviews: CustomerReview[];
  tickets: SupportTicket[];
  notes: CustomerNote[];
  activityLogs: ActivityLog[];
}

export interface CustomerGroup {
  id: string;
  name: string;
  code: string;
  description: string;
  isDefault?: boolean;
  discountPercentage: number;
  pricingRuleDescription?: string;
  createdAt: string;
}

export interface CustomerSegment {
  id: string;
  name: string;
  code?: string;
  description?: string;
  queryConfig?: {
    minOrders?: number;
    minRevenue?: number;
    country?: string;
    city?: string;
    registeredAfter?: string;
    lastLoginAfter?: string;
    minLoyaltyPoints?: number;
    minWalletBalance?: number;
  };
  rules?: {
    minRevenue?: number;
    minPoints?: number;
    minWallet?: number;
  };
  memberCount: number;
  createdAt: string;
}
