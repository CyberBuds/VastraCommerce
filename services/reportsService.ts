import {
  ExecutiveMetrics,
  SalesTrendData,
  SalesByBreakdown,
  OrderStatusBreakdown,
  CustomerAnalytics,
  InventoryValuationItem,
  PaymentGatewayMetric,
  MarketingCampaignReport,
  FinanceSummary,
  ShippingPerformanceItem,
  AuditLogItem,
  SystemMetricItem,
} from '@/features/reports/types/reportsTypes';

const emptyExecutiveMetrics: ExecutiveMetrics = {
  totalRevenue: 0,
  netRevenue: 0,
  grossSales: 0,
  totalOrders: 0,
  totalCustomers: 0,
  totalProducts: 0,
  inventoryValue: 0,
  refundAmount: 0,
  taxCollected: 0,
  netProfit: 0,
  grossLoss: 0,
  averageOrderValue: 0,
  conversionRate: 0,
  repeatCustomerRate: 0,
  revenueChange: 0,
  ordersChange: 0,
  conversionChange: 0,
};

const emptyCustomerAnalytics: CustomerAnalytics = {
  totalCustomers: 0,
  newCustomers: 0,
  activeCustomers: 0,
  inactiveCustomers: 0,
  repeatCustomers: 0,
  averageLtv: 0,
  topCustomers: [],
};

const emptyFinanceSummary: FinanceSummary = {
  grossRevenue: 0,
  cogs: 0,
  operatingExpenses: 0,
  marketingExpenses: 0,
  logisticsExpenses: 0,
  taxLiability: 0,
  netMargin: 0,
  ebitda: 0,
};

export const reportsService = {
  getExecutiveMetrics: async (): Promise<ExecutiveMetrics> => emptyExecutiveMetrics,
  getSalesTrend: async (): Promise<SalesTrendData[]> => [],
  getSalesByCategory: async (): Promise<SalesByBreakdown[]> => [],
  getOrderStatusBreakdown: async (): Promise<OrderStatusBreakdown[]> => [],
  getCustomerAnalytics: async (): Promise<CustomerAnalytics> => emptyCustomerAnalytics,
  getInventoryValuation: async (): Promise<InventoryValuationItem[]> => [],
  getPaymentGateways: async (): Promise<PaymentGatewayMetric[]> => [],
  getMarketingCampaigns: async (): Promise<MarketingCampaignReport[]> => [],
  getFinanceSummary: async (): Promise<FinanceSummary> => emptyFinanceSummary,
  getShippingPerformance: async (): Promise<ShippingPerformanceItem[]> => [],
  getAuditLogs: async (): Promise<AuditLogItem[]> => [],
  getSystemMetrics: async (): Promise<SystemMetricItem[]> => [],
};