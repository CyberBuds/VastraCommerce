// services/marketingService.ts
import {
  Coupon,
  DiscountRule,
  FlashSale,
  Campaign,
  Banner,
  PromotionalPage,
  GiftCard,
  Referral,
  LoyaltyProgram,
  AbandonedCart,
  ProductRecommendation,
  EmailCampaign,
  SmsCampaign,
  PushNotification,
  MarketingDashboardStats,
  ReferralRule,
  WhatsAppCampaign,
} from '@/types/marketing';
import { PaginatedResponse, ApiResponse  } from '@/types/common';
import { api } from '@/services/api';
 type SuccessResponse = ApiResponse<any>;

// Dashboard
export const getMarketingDashboardStats = async (): Promise<MarketingDashboardStats> => {
  const response = await api.get('/marketing/dashboard/stats');
  return response.data;
};

// Coupons
export const getCoupons = async (params: any): Promise<PaginatedResponse<Coupon>> => {
  const response = await api.get('/coupons', { params });
  return response.data;
};

export const getCoupon = async (id: string): Promise<Coupon> => {
  const response = await api.get(`/coupons/${id}`);
  return response.data;
};

export const createCoupon = async (data: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): Promise<Coupon> => {
  const response = await api.post('/coupons', data);
  return response.data;
};

export const updateCoupon = async (id: string, data: Partial<Coupon>): Promise<Coupon> => {
  const response = await api.put(`/coupons/${id}`, data);
  return response.data;
};

export const deleteCoupon = async (id: string): Promise<SuccessResponse> => {
  const response = await api.delete(`/coupons/${id}`);
  return response.data;
};

export const bulkDeleteCoupons = async (ids: string[]): Promise<SuccessResponse> => {
    const response = await api.post('/coupons/bulk-delete', { ids });
    return response.data;
};

export const bulkUpdateCouponsStatus = async (ids: string[], status: 'ACTIVE' | 'INACTIVE'): Promise<SuccessResponse> => {
    const response = await api.post('/coupons/bulk-status-update', { ids, status });
    return response.data;
};


// Discount Rules
export const getDiscountRules = async (params: any): Promise<PaginatedResponse<DiscountRule>> => {
    const response = await api.get('/discount-rules', { params });
    return response.data;
};

export const getDiscountRule = async (id: string): Promise<DiscountRule> => {
    const response = await api.get(`/discount-rules/${id}`);
    return response.data;
};

export const createDiscountRule = async (data: Omit<DiscountRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<DiscountRule> => {
    const response = await api.post('/discount-rules', data);
    return response.data;
};

export const updateDiscountRule = async (id: string, data: Partial<DiscountRule>): Promise<DiscountRule> => {
    const response = await api.put(`/discount-rules/${id}`, data);
    return response.data;
};

export const deleteDiscountRule = async (id: string): Promise<SuccessResponse> => {
    const response = await api.delete(`/discount-rules/${id}`);
    return response.data;
};

// Flash Sales
export const getFlashSales = async (params: any): Promise<PaginatedResponse<FlashSale>> => {
    const response = await api.get('/flash-sales', { params });
    return response.data;
};

export const getFlashSale = async (id: string): Promise<FlashSale> => {
    const response = await api.get(`/flash-sales/${id}`);
    return response.data;
};

export const createFlashSale = async (data: Omit<FlashSale, 'id' | 'createdAt' | 'updatedAt'>): Promise<FlashSale> => {
    const response = await api.post('/flash-sales', data);
    return response.data;
};

export const updateFlashSale = async (id: string, data: Partial<FlashSale>): Promise<FlashSale> => {
    const response = await api.put(`/flash-sales/${id}`, data);
    return response.data;
};

export const deleteFlashSale = async (id: string): Promise<SuccessResponse> => {
    const response = await api.delete(`/flash-sales/${id}`);
    return response.data;
};

// Campaigns
export const getCampaigns = async (params: any): Promise<PaginatedResponse<Campaign>> => {
    const response = await api.get('/campaigns', { params });
    return response.data;
};

export const getCampaign = async (id: string): Promise<Campaign> => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
};

export const createCampaign = async (data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign> => {
    const response = await api.post('/campaigns', data);
    return response.data;
};

export const updateCampaign = async (id: string, data: Partial<Campaign>): Promise<Campaign> => {
    const response = await api.put(`/campaigns/${id}`, data);
    return response.data;
};

export const deleteCampaign = async (id: string): Promise<SuccessResponse> => {
    const response = await api.delete(`/campaigns/${id}`);
    return response.data;
};

// Banners
export const getBanners = async (params: any): Promise<PaginatedResponse<Banner>> => {
    const response = await api.get('/banners', { params });
    return response.data;
};

export const createBanner = async (data: FormData): Promise<Banner> => {
    const response = await api.post('/banners', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const updateBanner = async (id: string, data: FormData): Promise<Banner> => {
    const response = await api.put(`/banners/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteBanner = async (id: string): Promise<SuccessResponse> => {
    const response = await api.delete(`/banners/${id}`);
    return response.data;
};

// Promotional Pages
export const getPromotionalPages = async (params: any): Promise<PaginatedResponse<PromotionalPage>> => {
    const response = await api.get('/promotional-pages', { params });
    return response.data;
};

export const getPromotionalPage = async (id: string): Promise<PromotionalPage> => {
    const response = await api.get(`/promotional-pages/${id}`);
    return response.data;
};

export const createPromotionalPage = async (data: Omit<PromotionalPage, 'id' | 'createdAt' | 'updatedAt'>): Promise<PromotionalPage> => {
    const response = await api.post('/promotional-pages', data);
    return response.data;
};

export const updatePromotionalPage = async (id: string, data: Partial<PromotionalPage>): Promise<PromotionalPage> => {
    const response = await api.put(`/promotional-pages/${id}`, data);
    return response.data;
};

export const deletePromotionalPage = async (id: string): Promise<SuccessResponse> => {
    const response = await api.delete(`/promotional-pages/${id}`);
    return response.data;
};

// Gift Cards
export const getGiftCards = async (params: any): Promise<PaginatedResponse<GiftCard>> => {
    const response = await api.get('/gift-cards', { params });
    return response.data;
};

export const getGiftCard = async (id: string): Promise<GiftCard> => {
    const response = await api.get(`/gift-cards/${id}`);
    return response.data;
};

export const createGiftCard = async (data: Omit<GiftCard, 'id' | 'createdAt' | 'updatedAt' | 'balance' | 'transactions' | 'status'>): Promise<GiftCard> => {
    const response = await api.post('/gift-cards', data);
    return response.data;
};

export const updateGiftCard = async (id: string, data: Partial<GiftCard>): Promise<GiftCard> => {
    const response = await api.put(`/gift-cards/${id}`, data);
    return response.data;
};

export const deleteGiftCard = async (id: string): Promise<SuccessResponse> => {
    const response = await api.delete(`/gift-cards/${id}`);
    return response.data;
};

// Referral Program
export const getReferrals = async(params: any): Promise<PaginatedResponse<Referral>> => {
    const response = await api.get('/referrals', { params });
    return response.data;
}
export const getReferralRules = async(): Promise<ReferralRule[]> => {
    const response = await api.get('/referrals/rules');
    return response.data;
}
export const updateReferralRule = async(id: string, data: Partial<ReferralRule>): Promise<ReferralRule> => {
    const response = await api.put(`/referrals/rules/${id}`, data);
    return response.data;
}

// Loyalty Program
export const getLoyaltyProgram = async(): Promise<LoyaltyProgram> => {
    const response = await api.get('/loyalty-program');
    return response.data;
}
export const updateLoyaltyProgram = async(data: Partial<LoyaltyProgram>): Promise<LoyaltyProgram> => {
    const response = await api.put('/loyalty-program', data);
    return response.data;
}
export const getLoyaltyTransactions = async(params: any): Promise<PaginatedResponse<any>> => {
    const response = await api.get('/loyalty-program/transactions', { params });
    return response.data;
}

// Abandoned Carts
export const getAbandonedCarts = async(params: any): Promise<PaginatedResponse<AbandonedCart>> => {
    const response = await api.get('/abandoned-carts', { params });
    return response.data;
}
export const recoverAbandonedCart = async(id: string): Promise<SuccessResponse> => {
    const response = await api.post(`/abandoned-carts/${id}/recover`);
    return response.data;
}

// Product Recommendations
export const getProductRecommendations = async(productId: string): Promise<ProductRecommendation[]> => {
    const response = await api.get(`/products/${productId}/recommendations`);
    return response.data;
}
export const updateProductRecommendations = async(productId: string, data: Partial<ProductRecommendation>): Promise<ProductRecommendation> => {
    const response = await api.put(`/products/${productId}/recommendations`, data);
    return response.data;
}

// Email Campaigns
export const getEmailCampaigns = async(params: any): Promise<PaginatedResponse<EmailCampaign>> => {
    const response = await api.get('/email-campaigns', { params });
    return response.data;
}
export const createEmailCampaign = async (data: Partial<EmailCampaign>): Promise<EmailCampaign> => {
    const response = await api.post('/email-campaigns', data);
    return response.data;
};
export const getEmailCampaign = async (id: string): Promise<EmailCampaign> => {
    const response = await api.get(`/email-campaigns/${id}`);
    return response.data;
};
export const updateEmailCampaign = async (id: string, data: Partial<EmailCampaign>): Promise<EmailCampaign> => {
    const response = await api.put(`/email-campaigns/${id}`, data);
    return response.data;
};
export const deleteEmailCampaign = async (id: string): Promise<SuccessResponse> => {
    const response = await api.delete(`/email-campaigns/${id}`);
    return response.data;
};
export const sendTestEmail = async (id: string, email: string): Promise<SuccessResponse> => {
    const response = await api.post(`/email-campaigns/${id}/send-test`, { email });
    return response.data;
};

// SMS Campaigns
export const getSmsCampaigns = async(params: any): Promise<PaginatedResponse<SmsCampaign>> => {
    const response = await api.get('/sms-campaigns', { params });
    return response.data;
};
export const createSmsCampaign = async (data: Partial<SmsCampaign>): Promise<SmsCampaign> => {
    const response = await api.post('/sms-campaigns', data);
    return response.data;
};
export const updateSmsCampaign = async (id: string, data: Partial<SmsCampaign>): Promise<SmsCampaign> => {
    const response = await api.put(`/sms-campaigns/${id}`, data);
    return response.data;
};
export const deleteSmsCampaign = async (id: string): Promise<SuccessResponse> => {
    const response = await api.delete(`/sms-campaigns/${id}`);
    return response.data;
};

// WhatsApp Campaigns
export const getWhatsAppCampaigns = async(params: any): Promise<PaginatedResponse<WhatsAppCampaign>> => {
    const response = await api.get('/whatsapp-campaigns', { params });
    return response.data;
};
export const createWhatsAppCampaign = async (data: Partial<WhatsAppCampaign>): Promise<WhatsAppCampaign> => {
    const response = await api.post('/whatsapp-campaigns', data);
    return response.data;
};
export const updateWhatsAppCampaign = async (id: string, data: Partial<WhatsAppCampaign>): Promise<WhatsAppCampaign> => {
    const response = await api.put(`/whatsapp-campaigns/${id}`, data);
    return response.data;
};
export const deleteWhatsAppCampaign = async (id: string): Promise<SuccessResponse> => {
    const response = await api.delete(`/whatsapp-campaigns/${id}`);
    return response.data;
};

// Push Notifications
export const getPushNotifications = async(params: any): Promise<PaginatedResponse<PushNotification>> => {
    const response = await api.get('/push-notifications', { params });
    return response.data;
};
export const createPushNotification = async (data: Partial<PushNotification>): Promise<PushNotification> => {
    const response = await api.post('/push-notifications', data);
    return response.data;
};
export const deletePushNotification = async (id: string): Promise<SuccessResponse> => {
    const response = await api.delete(`/push-notifications/${id}`);
    return response.data;
};
