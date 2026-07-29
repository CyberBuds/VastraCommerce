// types/marketing.ts

export interface MarketingDashboardStats {
  activeCampaigns: number;
  runningCoupons: number;
  flashSales: number;
  revenueFromPromotions: number;
  discountAmount: number;
  giftCardsIssued: number;
  referralRegistrations: number;
  loyaltyMembers: number;
  abandonedCarts: number;
  recoveredCarts: number;
  campaignROI: number;
}

export interface CampaignPerformance {
  name: string;
  revenue: number;
  conversions: number;
  roi: number;
}

export interface CouponUsage {
  code: string;
  usageCount: number;
  discountAmount: number;
}

export interface SalesTrend {
  date: string;
  promotionalSales: number;
  regularSales: number;
}

export interface ReferralTrend {
  date: string;
  signups: number;
  rewardedAmount: number;
}

export interface GiftCardUsage {
  date: string;
  issued: number;
  redeemed: number;
}

export interface EmailOpenRate {
  campaign: string;
  openRate: number;
}

export interface SmsDeliveryRate {
    campaign: string;
    deliveryRate: number;
}

export interface PushDeliveryRate {
    campaign: string;
    deliveryRate: number;
}

export interface AbandonedCartRecoveryRate {
    date: string;
    recoveryRate: number;
}


export type CouponType = 'PERCENTAGE' | 'FLAT' | 'FREE_SHIPPING';
export type DiscountRuleType = 'BOGO' | 'BUY_X_GET_Y' | 'CATEGORY' | 'BRAND' | 'CART' | 'PRODUCT' | 'TIER_PRICING' | 'CUSTOMER_GROUP';
export type CampaignType = 'EMAIL' | 'SMS' | 'PUSH' | 'SOCIAL_MEDIA' | 'WHATSAPP';
export type CampaignObjective = 'SALES' | 'LEAD_GENERATION' | 'BRAND_AWARENESS' | 'ENGAGEMENT';
export type BannerType = 'DESKTOP' | 'MOBILE' | 'TABLET' | 'HOMEPAGE' | 'CATEGORY' | 'POPUP';
export type RecommendationType = 'RELATED_PRODUCTS' | 'CROSS_SELL' | 'UP_SELL' | 'TRENDING' | 'RECENTLY_VIEWED' | 'AI';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  description?: string;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  maxUsageCount?: number;
  usageCount: number;
  perCustomerLimit?: number;
  applicableCategoryIds?: string[];
  applicableProductIds?: string[];
  applicableBrandIds?: string[];
  applicableCustomerIds?: string[];
  applicableCustomerGroupIds?: string[];
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
}

export interface DiscountRule {
  id: string;
  name: string;
  type: DiscountRuleType;
  description?: string;
  conditions: any; // Flexible for different rule types
  actions: any; // Flexible for different rule types
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface FlashSale {
  id: string;
  name: string;
  bannerUrl?: string;
  startTime: string;
  endTime: string;
  priority: number;
  productIds: string[];
  discountRuleIds: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'SCHEDULED' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  objective: CampaignObjective;
  budget?: number;
  startDate: string;
  endDate: string;
  audience: any; // Can be complex
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  assets?: { name: string; url: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  type: BannerType;
  priority: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface PromotionalPage {
  id: string;
  title: string;
  slug: string;
  banner: { imageUrl: string; title: string };
  sections: { type: 'PRODUCT_GRID' | 'TEXT' | 'COUNTDOWN'; content: any }[];
  seo: { title: string; description: string; keywords: string[] };
  status: 'PUBLISHED' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
}

export interface GiftCard {
  id: string;
  code: string;
  initialAmount: number;
  balance: number;
  recipientEmail?: string;
  senderName?: string;
  message?: string;
  expiryDate: string;
  redeemedAt?: string;
  status: 'ACTIVE' | 'REDEEMED' | 'EXPIRED' | 'DISABLED';
  transactions: {
    id: string;
    amount: number;
    type: 'ISSUE' | 'REDEEM' | 'REFUND';
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  rewardAmount?: number;
  createdAt: string;
}

export interface ReferralRule {
    id: string;
    name: string;
    reward: number;
    minSpend: number;
    status: 'ACTIVE' | 'INACTIVE';
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  pointRules: { action: string; points: number }[];
  membershipLevels: { name: string; minPoints: number; benefits: string[] }[];
  pointExpiryDays?: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  points: number;
  type: 'EARN' | 'REDEEM' | 'EXPIRE';
  description: string;
  createdAt: string;
}

export interface AbandonedCart {
  id: string;
  customerId: string;
  customerEmail: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
  cartValue: number;
  recoveryStatus: 'PENDING' | 'CONTACTED' | 'RECOVERED' | 'FAILED';
  lastContactedAt?: string;
  createdAt: string;
}

export interface ProductRecommendation {
  id: string;
  productId: string;
  type: RecommendationType;
  recommendedProductIds: string[];
  score?: number;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  templateId: string;
  audience: any;
  scheduledAt?: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENT' | 'FAILED';
  analytics?: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  createdAt: string;
}

export interface SmsCampaign {
  id: string;
  name: string;
  templateId: string;
  audience: any;
  scheduledAt?: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENT' | 'FAILED';
  deliveryReport?: any;
  createdAt: string;
}

export interface WhatsAppCampaign {
    id: string;
    name: string;
    templateId: string;
    audience: any;
    scheduledAt?: string;
    status: 'DRAFT' | 'SCHEDULED' | 'SENT' | 'FAILED';
    deliveryReport?: any;
    createdAt: string;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  targetUrl: string;
  audience: any;
  scheduledAt?: string;
  priority: 'high' | 'normal';
  status: 'DRAFT' | 'SCHEDULED' | 'SENT' | 'FAILED';
  analytics?: {
    sent: number;
    delivered: number;
    clicked: number;
    failed: number;
  };
  createdAt: string;
}
