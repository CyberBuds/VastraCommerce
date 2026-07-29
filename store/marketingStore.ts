// store/marketingStore.ts
import { create } from 'zustand';

interface MarketingState {
  couponFilters: Record<string, any>;
  campaignFilters: Record<string, any>;
  giftCardFilters: Record<string, any>;
  selectedCoupons: string[];
  selectedCampaigns: string[];
  selectedGiftCards: string[];
  setCouponFilters: (filters: Record<string, any>) => void;
  setCampaignFilters: (filters: Record<string, any>) => void;
  setGiftCardFilters: (filters: Record<string, any>) => void;
  setSelectedCoupons: (ids: string[]) => void;
  setSelectedCampaigns: (ids: string[]) => void;
  setSelectedGiftCards: (ids: string[]) => void;
  resetCouponFilters: () => void;
  resetCampaignFilters: () => void;
  resetGiftCardFilters: () => void;
}

export const useMarketingStore = create<MarketingState>((set) => ({
  couponFilters: {},
  campaignFilters: {},
  giftCardFilters: {},
  selectedCoupons: [],
  selectedCampaigns: [],
  selectedGiftCards: [],
  setCouponFilters: (filters) => set({ couponFilters: filters }),
  setCampaignFilters: (filters) => set({ campaignFilters: filters }),
  setGiftCardFilters: (filters) => set({ giftCardFilters: filters }),
  setSelectedCoupons: (ids) => set({ selectedCoupons: ids }),
  setSelectedCampaigns: (ids) => set({ selectedCampaigns: ids }),
  setSelectedGiftCards: (ids) => set({ selectedGiftCards: ids }),
  resetCouponFilters: () => set({ couponFilters: {} }),
  resetCampaignFilters: () => set({ campaignFilters: {} }),
  resetGiftCardFilters: () => set({ giftCardFilters: {} }),
}));
