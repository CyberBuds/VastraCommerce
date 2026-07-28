export type DateRangeType = 
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'last_30_days'
  | 'this_month'
  | 'last_month'
  | 'this_quarter'
  | 'this_year'
  | 'custom';

export interface ReportFilterState {
  dateRange: DateRangeType;
  startDate?: string;
  endDate?: string;
  storeId?: string;
  warehouseId?: string;
  categoryId?: string;
  brandId?: string;
  customerGroupId?: string;
  paymentMethod?: string;
  orderStatus?: string;
}

export interface ExecutiveMetrics {
  totalRevenue: number;
  netRevenue: number;
  grossSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  inventoryValue: number;
  refundAmount: number;
  taxCollected: number;
  netProfit: number;
  grossLoss: number;
  averageOrderValue: number;
  conversionRate: number;
  repeatCustomerRate: number;
  revenueChange: number;
  ordersChange: number;
  conversionChange: number;
}

export interface SalesTrendData {
  period: string;
  grossSales: number;
  netSales: number;
  discounts: number;
  refunds: number;
  orders: number;
}

export interface SalesByBreakdown {
  id: string;
  name: string;
  category?: string;
  ordersCount: number;
  quantitySold: number;
  totalRevenue: number;
  percentageOfTotal: number;
}

export interface OrderStatusBreakdown {
  status: string;
  count: number;
  value: number;
  percentage: number;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  repeatCustomers: number;
  averageLtv: number;
  topCustomers: {
    id: string;
    name: string;
    email: string;
    totalOrders: number;
    totalSpent: number;
    ltv: number;
    lastOrderDate: string;
  }[];
}

export interface InventoryValuationItem {
  id: string;
  sku: string;
  productName: string;
  category: string;
  warehouse: string;
  stockOnHand: number;
  reservedStock: number;
  costPrice: number;
  retailPrice: number;
  totalCostValue: number;
  totalRetailValue: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export interface PaymentGatewayMetric {
  gateway: string;
  method: string;
  transactionsCount: number;
  successfulCount: number;
  failedCount: number;
  totalVolume: number;
  feeAmount: number;
  successRate: number;
}

export interface MarketingCampaignReport {
  id: string;
  campaignName: string;
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH' | 'REFERRAL' | 'COUPON';
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenueGenerated: number;
  roi: number;
}

export interface FinanceSummary {
  grossRevenue: number;
  cogs: number;
  operatingExpenses: number;
  marketingExpenses: number;
  logisticsExpenses: number;
  taxLiability: number;
  netMargin: number;
  ebitda: number;
}

export interface ShippingPerformanceItem {
  courierName: string;
  totalShipments: number;
  deliveredOnTime: number;
  delayedCount: number;
  failedCount: number;
  avgDeliveryHours: number;
  totalCost: number;
  slaRate: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userEmail: string;
  userRole: string;
  action: string;
  module: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
}

export interface SystemMetricItem {
  timestamp: string;
  cpuUsagePct: number;
  memoryUsagePct: number;
  apiRequestsPerMin: number;
  avgLatencyMs: number;
  errorRatePct: number;
  activeJobsCount: number;
  dbPoolConnections: number;
}

export interface CustomReportTemplate {
  id: string;
  title: string;
  description: string;
  module: 'SALES' | 'ORDERS' | 'CUSTOMERS' | 'INVENTORY' | 'FINANCE';
  selectedFields: string[];
  groupBy: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  aggregation: 'SUM' | 'AVG' | 'COUNT' | 'MAX' | 'MIN';
  createdAt: string;
  updatedAt: string;
}

export interface ScheduledReportItem {
  id: string;
  name: string;
  templateName: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  format: 'CSV' | 'EXCEL' | 'PDF' | 'JSON';
  recipients: string[];
  nextRunAt: string;
  lastRunAt: string;
  status: 'ACTIVE' | 'PAUSED' | 'FAILED';
}

export interface ExportHistoryRecord {
  id: string;
  fileName: string;
  reportType: string;
  format: 'CSV' | 'EXCEL' | 'PDF' | 'JSON';
  rowCount: number;
  fileSizeBytes: number;
  exportedBy: string;
  exportedAt: string;
  downloadUrl: string;
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
}
