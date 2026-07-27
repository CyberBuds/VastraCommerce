// features/marketing/types/validation.ts
import { z } from 'zod';

export const couponSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  type: z.enum(['PERCENTAGE', 'FLAT', 'FREE_SHIPPING']),
  value: z.number().min(0, 'Value must be positive'),
  description: z.string().optional(),
  minOrderAmount: z.number().optional(),
  maxDiscountAmount: z.number().optional(),
  maxUsageCount: z.number().optional(),
  perCustomerLimit: z.number().optional(),
  applicableCategoryIds: z.array(z.string()).optional(),
  applicableProductIds: z.array(z.string()).optional(),
  applicableBrandIds: z.array(z.string()).optional(),
  applicableCustomerIds: z.array(z.string()).optional(),
  applicableCustomerGroupIds: z.array(z.string()).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export const discountRuleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['BOGO', 'BUY_X_GET_Y', 'CATEGORY', 'BRAND', 'CART', 'PRODUCT', 'TIER_PRICING', 'CUSTOMER_GROUP']),
  description: z.string().optional(),
  conditions: z.any(),
  actions: z.any(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export const flashSaleSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    bannerUrl: z.string().optional(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    priority: z.number().int(),
    productIds: z.array(z.string()).min(1, 'At least one product is required'),
    discountRuleIds: z.array(z.string()).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SCHEDULED']),
});

export const campaignSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.enum(['EMAIL', 'SMS', 'PUSH', 'SOCIAL_MEDIA', 'WHATSAPP']),
    objective: z.enum(['SALES', 'LEAD_GENERATION', 'BRAND_AWARENESS', 'ENGAGEMENT']),
    budget: z.number().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    audience: z.any(),
    status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED']),
});

export const bannerSchema = z.object({
    title: z.string().min(1, "Title is required"),
    link: z.string().url("Invalid URL"),
    type: z.enum(['DESKTOP', 'MOBILE', 'TABLET', 'HOMEPAGE', 'CATEGORY', 'POPUP']),
    priority: z.number().int(),
    status: z.enum(['ACTIVE', 'INACTIVE']),
    image: z.any().refine((file) => file, "Image is required."),
});

export const promotionalPageSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    // TODO: Add more complex validation for sections
});

export const giftCardSchema = z.object({
    code: z.string().min(1, "Code is required"),
    initialAmount: z.number().min(1, "Amount must be greater than 0"),
    recipientEmail: z.string().email().optional(),
    expiryDate: z.string().datetime(),
});

export const referralRuleSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    reward: z.number().min(0),
    minSpend: z.number().min(0),
    status: z.enum(['ACTIVE', 'INACTIVE']),
});

export const loyaltyProgramSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    pointExpiryDays: z.number().int().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']),
});

export const emailCampaignSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    subject: z.string().min(1, 'Subject is required'),
    templateId: z.string().min(1, 'Template is required'),
    audience: z.any(),
    scheduledAt: z.string().datetime().optional(),
});

export const smsCampaignSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    templateId: z.string().min(1, 'Template is required'),
    audience: z.any(),
    scheduledAt: z.string().datetime().optional(),
});

export const whatsAppCampaignSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    templateId: z.string().min(1, 'Template is required'),
    audience: z.any(),
    scheduledAt: z.string().datetime().optional(),
});

export const pushNotificationSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    body: z.string().min(1, 'Body is required'),
    targetUrl: z.string().url(),
    audience: z.any(),
    scheduledAt: z.string().datetime().optional(),
    priority: z.enum(['high', 'normal']),
});
